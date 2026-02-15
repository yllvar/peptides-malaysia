import { prisma } from '../_db.js';

export const config = {
    runtime: 'nodejs',
};
import { calculateShippingCost } from '../../src/lib/utils/shipping.js';

export async function POST(request: Request) {
    try {
        const body = await request.clone().json();
        console.log('Checkout Request Body:', JSON.stringify(body, null, 2));

        const { items, shippingInfo, userId } = body;

        if (!items || items.length === 0 || !shippingInfo) {
            console.error('Missing order data:', { items: !!items, shippingInfo: !!shippingInfo });
            return Response.json({ error: 'Invalid order data' }, { status: 400 });
        }

        if (!process.env.TOYYIBPAY_SECRET_KEY || !process.env.TOYYIBPAY_CATEGORY_CODE) {
            console.error('ToyyibPay environment variables are missing');
            return Response.json({ error: 'Payment gateway misconfigured' }, { status: 500 });
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

        let order;
        try {
            order = await prisma.order.create({
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
            console.log('Order created successfully:', order.id);
        } catch (dbError) {
            console.error('Database Error during order creation:', dbError);
            throw new Error('Database operation failed');
        }

        // 4. Prepare ToyyibPay Payload
        const formData = new URLSearchParams();
        formData.append('userSecretKey', process.env.TOYYIBPAY_SECRET_KEY!);
        formData.append('categoryCode', process.env.TOYYIBPAY_CATEGORY_CODE!);
        formData.append('billName', orderNumber);
        formData.append('billDescription', 'Evo Peptides Research Order');
        formData.append('billPriceSetting', '1');
        formData.append('billPayorInfo', '1');
        formData.append('billAmount', Math.round(finalTotal * 100).toString());
        formData.append('billReturnUrl', `${process.env.VITE_APP_URL || 'https://peptides-malaysia.vercel.app'}/payment/status`);
        formData.append('billCallbackUrl', `${process.env.VITE_APP_URL || 'https://peptides-malaysia.vercel.app'}/api/checkout/webhook`);
        formData.append('billExternalReferenceNo', order.id);
        formData.append('billTo', shippingInfo.fullName);
        formData.append('billEmail', shippingInfo.email);
        formData.append('billPhone', shippingInfo.phone);

        // 5. Call ToyyibPay
        console.log('Calling ToyyibPay API...');
        let tpResponse;
        try {
            tpResponse = await fetch('https://toyyibpay.com/index.php/api/createBill', {
                method: 'POST',
                body: formData,
            });
        } catch (fetchError) {
            console.error('ToyyibPay Fetch Error:', fetchError);
            throw new Error('Failed to reach payment gateway');
        }

        const rawData = await tpResponse.text();
        console.log('ToyyibPay Raw Response:', rawData);

        let data;
        try {
            data = JSON.parse(rawData);
        } catch (jsonError) {
            console.error('Failed to parse ToyyibPay response as JSON:', rawData);
            return Response.json({ error: 'Gateway returned invalid response' }, { status: 502 });
        }

        if (Array.isArray(data) && data[0]?.BillCode) {
            const billCode = data[0].BillCode;
            const paymentUrl = `https://toyyibpay.com/${billCode}`;

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
            console.error('ToyyibPay Error:', data);
            return Response.json({ error: 'Failed to generate payment link' }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Checkout error:', error);
        return Response.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}
