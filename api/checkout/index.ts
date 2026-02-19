import { prisma } from '../_db.js';

export const config = {
    runtime: 'nodejs',
};
import { calculateShippingCost } from '../../src/lib/utils/shipping.js';

/** Strip all non-digit characters so phone numbers are stored in a consistent format for downstream queries (e.g. WhatsApp Bot LIKE lookups). */
const sanitizePhone = (phone: string): string => phone.replace(/\D/g, '');

export async function POST(request: Request) {
    try {
        const { items, shippingInfo, userId } = await request.json();

        if (!items || items.length === 0 || !shippingInfo) {
            return Response.json({ error: 'Invalid order data' }, { status: 400 });
        }

        // 1. Fetch products to get canonical prices and validate stock
        const productIds = items.map((i: any) => i.id);
        const dbProducts = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        let calculatedSubtotal = 0;
        const validatedItems = [];

        for (const item of items) {
            const product = dbProducts.find(p => p.id === item.id);
            if (!product) {
                return Response.json({ error: `Product ${item.id} not found` }, { status: 404 });
            }
            if (!item.quantity || item.quantity <= 0) {
                return Response.json({ error: `Invalid quantity for item ${item.id}` }, { status: 400 });
            }
            if (product.stockQuantity < item.quantity) {
                return Response.json({ error: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}` }, { status: 400 });
            }
            const price = Number(product.price);
            calculatedSubtotal += price * item.quantity;
            validatedItems.push({
                productId: product.id,
                productName: product.name,
                productPrice: price,
                quantity: item.quantity,
                lineTotal: price * item.quantity
            });
        }

        // 2. Calculate Shipping
        const shippingCost = calculateShippingCost(shippingInfo.postcode, calculatedSubtotal);
        const finalTotal = calculatedSubtotal + shippingCost;

        // 3. Create Order in Database
        const orderNumber = `EVO-${Date.now().toString().slice(-8)}`;

        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: userId || null,
                guestName: !userId ? shippingInfo.fullName : undefined,
                guestEmail: !userId ? shippingInfo.email : undefined,
                guestPhone: !userId ? sanitizePhone(shippingInfo.phone) : undefined,
                shippingName: shippingInfo.fullName,
                shippingPhone: sanitizePhone(shippingInfo.phone),
                shippingAddress: shippingInfo.address,
                shippingCity: shippingInfo.city,
                shippingPostcode: shippingInfo.postcode,
                shippingCost: shippingCost,
                subtotal: calculatedSubtotal,
                total: finalTotal,
                status: 'pending',
                items: {
                    create: validatedItems
                },
            },
        });

        // 4. Prepare ToyyibPay Payload
        const formData = new URLSearchParams();
        const baseUrl = (process.env.TOYYIBPAY_BASE_URL || 'https://dev.toyyibpay.com').trim();

        formData.append('userSecretKey', (process.env.TOYYIBPAY_SECRET_KEY || '').trim());
        formData.append('categoryCode', (process.env.TOYYIBPAY_CATEGORY_CODE || '').trim());
        formData.append('billName', orderNumber);
        formData.append('billDescription', 'Evo Peptides Research Order');
        formData.append('billPriceSetting', '0');
        formData.append('billPayorInfo', '1');
        formData.append('billAmount', Math.round(finalTotal * 100).toString());
        const host = request.headers.get('host');
        const protocol = host?.includes('localhost') ? 'http' : 'https';
        const currentOrigin = host ? `${protocol}://${host}` : (process.env.VITE_APP_URL || 'https://evopeptides.shop');

        formData.append('billReturnUrl', `${currentOrigin}/payment/status`);
        formData.append('billCallbackUrl', `${currentOrigin}/api/checkout/webhook`);
        formData.append('billExternalReferenceNo', order.id);
        formData.append('billTo', shippingInfo.fullName);
        formData.append('billEmail', shippingInfo.email);
        formData.append('billPhone', shippingInfo.phone);

        // 5. Call ToyyibPay
        console.log(`Calling ToyyibPay at: ${baseUrl}/index.php/api/createBill`);
        const tpResponse = await fetch(`${baseUrl}/index.php/api/createBill`, {
            method: 'POST',
            body: formData,
        });

        const rawText = await tpResponse.text();
        console.log('ToyyibPay Raw Response:', rawText);

        let data;
        try {
            data = JSON.parse(rawText);
        } catch (e) {
            console.error('Failed to parse ToyyibPay JSON:', rawText);
        }

        if (Array.isArray(data) && data[0]?.BillCode) {
            const billCode = data[0].BillCode;
            const paymentUrl = `${baseUrl}/${billCode}`;

            // Create Payment record
            await prisma.orderPayment.create({
                data: {
                    orderId: order.id,
                    gateway: 'TOYYIBPAY',
                    gatewayRef: billCode,
                    amount: finalTotal,
                    status: 'pending',
                }
            });

            return Response.json({ paymentUrl, orderId: order.id });
        } else {
            console.error('ToyyibPay Error Payload:', data);
            return Response.json({
                error: (Array.isArray(data) && typeof data[0] === 'string') ? data[0] : 'Failed to generate payment link'
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Checkout error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
