import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = 'PetCare <onboarding@resend.dev>'; // Free Resend domain for testing

export async function sendEmail({ to, subject, html }) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('📧 [DEV MODE] Would send email to:', to);
      console.log('📧 Subject:', subject);
      console.log('📧 HTML:', html.substring(0, 200) + '...');
      return { success: true, dev: true };
    }

    if (!resend) {
      console.log('📧 [ERROR] Resend not initialized');
      return { success: false, error: 'Resend not initialized' };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html
    });

    if (error) {
      console.error('📧 Email send error:', error);
      return { success: false, error };
    }

    console.log('📧 Email sent successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('📧 Email send error:', err.message);
    return { success: false, error: err.message };
  }
}
