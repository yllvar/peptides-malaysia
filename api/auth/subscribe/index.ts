import { prisma, connectDb } from '../../_db.js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return Response.json({ error: 'Invalid email address' }, { status: 400 });
        }

        await connectDb();

        const pdfUrl = `${process.env.VITE_APP_URL || 'https://evopeptides.shop'}/evo-reta-tutorial.pdf`;

        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: 'Evo™ Safety Protocol - Research Tutorial',
            html: `
                <div style="font-family: sans-serif; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #ff4d00; text-transform: uppercase; font-size: 24px; letter-spacing: 2px; margin-bottom: 25px;">Evo™ Research Protocol</h1>
                    <p style="font-size: 16px; line-height: 1.6; color: #ccc;">Thank you for requesting the official Evo™ Safety Protocol.</p>
                    <p style="font-size: 16px; line-height: 1.6; color: #ccc;">This document contains critical laboratory handling protocols and reconstitution data for research chemicals.</p>
                    <div style="margin: 40px 0;">
                        <a href="${pdfUrl}" style="background: #ff4d00; color: #fff; padding: 18px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; display: inline-block;">Download Protocol PDF</a>
                    </div>
                    <p style="font-size: 11px; color: #444; margin-top: 50px; border-top: 1px solid #222; padding-top: 20px; line-height: 1.5;">
                        DISCLAIMER: Evo™ compounds are for laboratory research use only. Strictly not for human consumption, veterinary use, or therapeutic application. Handling requires appropriate laboratory safety equipment and certifications.
                    </p>
                </div>
            `,
        });

        return Response.json({ message: 'Success! Please check your email for the protocol.' });

    } catch (error: any) {
        console.error('Subscription error:', error);
        return Response.json({ error: 'Failed to process subscription. Please try again.' }, { status: 500 });
    }
}
