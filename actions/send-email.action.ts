'use server';

import transporter from '@/lib/nodemailer';

const styles = {
  container: 'font-family: Arial, sans-serif; color: #333; padding: 20px;',
  header: 'color: #4CAF50; font-size: 24px; margin-bottom: 10px;',
  description: 'font-size: 16px; margin-bottom: 20px;',
  link: 'color: #4CAF50; text-decoration: none; font-weight: bold;',
  footer: 'font-size: 12px; color: #999; margin-top: 20px;',
};

export async function SendEmailAction({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: {
    header?: string;
    description?: string;
    link: string;
    footer?: string;
  };
}) {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    subject,
    html: `
      <div style="${styles.container}">
        <h1 style="${styles.header}">${body.header}</h1>
        <p style="${styles.description}">${body.description}</p>
        <a href=${body.link} style="${styles.link}">Click here</a>
        <p style="${styles.footer}">${body.footer}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { error: null };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: 'Something went wrong while sending the mail' };
  }
}
