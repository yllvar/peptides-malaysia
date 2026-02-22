import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend(): Resend | null {
    if (!process.env.RESEND_API_KEY) return null;
    if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
    return _resend;
}
const FROM_EMAIL = `"Evo™ Peptides Research" <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`;

if (FROM_EMAIL.includes('resend.dev')) {
    console.log(`[Email] Using testing domain ${FROM_EMAIL}. Emails will likely only be delivered to the Resend account owner (evopeptidesmastermail@gmail.com).`);
}

interface EmailOrder {
    orderNumber: string;
    total: number;
    items: Array<{
        productName: string;
        quantity: number;
        lineTotal: number;
    }>;
    shippingName: string;
    shippingAddress: string;
    shippingCity: string;
    shippingPostcode: string;
}

export async function sendOrderReceivedEmail(to: string, order: EmailOrder) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is missing, skipping email.');
        return;
    }

    try {
        const { data, error } = await getResend()!.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: `Order Confirmation #${order.orderNumber}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>Thank you for your order!</h1>
                    <p>Hi ${order.shippingName},</p>
                    <p>We have received your order <strong>#${order.orderNumber}</strong> and it is now being processed.</p>
                    
                    <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>Order Summary</h3>
                        ${order.items.map(item => `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>${item.quantity}x ${item.productName}</span>
                                <span>RM ${Number(item.lineTotal).toFixed(2)}</span>
                            </div>
                        `).join('')}
                        <hr style="border: 0; border-top: 1px solid #ddd; margin: 10px 0;" />
                        <div style="display: flex; justify-content: space-between; font-weight: bold;">
                            <span>Total</span>
                            <span>RM ${Number(order.total).toFixed(2)}</span>
                        </div>
                    </div>

                    <p>Verification usually takes 5-15 minutes during lab hours. Once verified, your research batch will be prepared for immediate dispatch.</p>
                    
                    <p style="color: #666; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; pt: 20px;">
                        <strong>Evo™ Peptides Research Hub</strong><br/>
                        Analytical Standards Department<br/>
                        evopeptidesmastermail@gmail.com
                    </p>
                </div>
            `
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Email Exception:', err);
        return { success: false, error: err };
    }
}

export async function sendShippingConfirmationEmail(to: string, orderNumber: string, trackingNumber: string, courier: string, name: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is missing, skipping email.');
        return;
    }

    try {
        const { data, error } = await getResend()!.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: `Your Order #${orderNumber} has Shipped!`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>Your order is on the way! 🚚</h1>
                    <p>Hi ${name},</p>
                    <p>Great news! Your order <strong>#${orderNumber}</strong> has been shipped.</p>
                    
                    <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>Tracking Information</h3>
                        <p><strong>Courier:</strong> ${courier}</p>
                        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
                    </div>

                    <p>You can track your package using the tracking number above depending on the courier's website.</p>
                    
                    <p style="color: #666; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; pt: 20px;">
                        <strong>Evo™ Peptides Research Hub</strong><br/>
                        Logistics & Dispatch Department<br/>
                        evopeptidesmastermail@gmail.com
                    </p>
                </div>
            `
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Email Exception:', err);
        return { success: false, error: err };
    }
}
