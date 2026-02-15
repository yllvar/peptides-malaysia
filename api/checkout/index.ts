import { prisma } from '../_db.js';

export const config = {
    runtime: 'nodejs',
};
import { calculateShippingCost } from '../../src/lib/utils/shipping.js';

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
                guestPhone: !userId ? shippingInfo.phone : undefined,
                shippingName: shippingInfo.fullName,
                shippingPhone: shippingInfo.phone,
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
        // FORCE Sandbox for verification
        const baseUrl = 'https://dev.toyyibpay.com';

        formData.append('userSecretKey', (process.env.TOYYIBPAY_SECRET_KEY || '').trim());
        formData.append('categoryCode', (process.env.TOYYIBPAY_CATEGORY_CODE || '').trim());
        formData.append('billName', orderNumber);
        formData.append('billDescription', 'Evo Peptides Research Order');
        formData.append('billPriceSetting', '0');
        formData.append('billPayorInfo', '1');
        formData.append('billAmount', Math.round(finalTotal * 100).toString());
        formData.append('billReturnUrl', `${process.env.VITE_APP_URL || 'https://peptides-malaysia.vercel.app'}/payment/status`);
        formData.append('billCallbackUrl', `${process.env.VITE_APP_URL || 'https://peptides-malaysia.vercel.app'}/api/checkout/webhook`);
        formData.append('billExternalReferenceNo', order.id);
        formData.append('billTo', shippingInfo.fullName);
        formData.append('billEmail', shippingInfo.email);
        formData.append('billPhone', shippingInfo.phone);

        // 5. Call ToyyibPay
        const tpResponse = await fetch(`${baseUrl}/index.php/api/createBill`, {
            method: 'POST',
            body: formData,
        });

        const data = await tpResponse.json();

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
            return Response.json({ error: 'Failed to generate payment link' }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Checkout error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
