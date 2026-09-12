import { Resend } from "resend";
import { env } from "~/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  token: string,
  baseUrl: string,
) {
  const verificationUrl = `${baseUrl}/auth/verify?token=${token}`;

  await resend.emails.send({
    from: "Cosmos AI <noreply@cosmosai.mw>",
    to: email,
    subject: "Verify your Cosmos AI account",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body style="margin:0;padding:0;background:#F2F5F3;font-family:sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:40px 20px;">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #C8D0CC;">
                  <tr>
                    <td style="background:#0D4A3A;padding:32px 40px;">
                      <p style="margin:0;font-size:20px;font-weight:600;letter-spacing:4px;color:#B8CFC4;">COSMOS AI</p>
                      <p style="margin:4px 0 0;font-size:11px;letter-spacing:3px;color:#2A8C6E;">SHAPING TOMORROW WITH AI</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <h1 style="margin:0 0 16px;font-size:28px;font-weight:600;color:#0D4A3A;">Verify your email</h1>
                      <p style="margin:0 0 24px;font-size:16px;font-weight:300;line-height:1.6;color:#2E2E2E;">
                        Thank you for creating a Cosmos AI account. Click the button below to verify your email address and activate your account.
                      </p>
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="border-radius:50px;background:#2E7D5E;">
                            <a href="${verificationUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:500;color:#ffffff;text-decoration:none;border-radius:50px;">
                              Verify Email Address
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:24px 0 0;font-size:13px;font-weight:300;color:#666666;">
                        This link expires in 24 hours. If you did not create a Cosmos AI account you can safely ignore this email.
                      </p>
                      <p style="margin:16px 0 0;font-size:12px;color:#999999;word-break:break-all;">
                        Or copy this link: ${verificationUrl}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#F2F5F3;padding:24px 40px;border-top:1px solid #C8D0CC;">
                      <p style="margin:0;font-size:12px;color:#666666;">
                        © ${new Date().getFullYear()} Cosmos AI · Malawi · <a href="https://cosmosai.mw" style="color:#2A8C6E;text-decoration:none;">cosmosai.mw</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}

export async function sendContactNotification(submission: {
  name: string;
  organisation?: string | null;
  email: string;
  phone?: string | null;
  service?: string | null;
  message: string;
}) {
  const adminEmails = [
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_EMAIL_2,
  ].filter(Boolean) as string[];

  if (adminEmails.length === 0) return;

  await resend.emails.send({
    from: "Cosmos AI <noreply@cosmosai.mw>",
    to: adminEmails,
    subject: `New enquiry from ${submission.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body style="margin:0;padding:0;background:#F2F5F3;font-family:sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:40px 20px;">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #C8D0CC;">
                  <tr>
                    <td style="background:#0D4A3A;padding:32px 40px;">
                      <p style="margin:0;font-size:20px;font-weight:600;letter-spacing:4px;color:#B8CFC4;">COSMOS AI</p>
                      <p style="margin:4px 0 0;font-size:11px;letter-spacing:3px;color:#2A8C6E;">NEW CONTACT ENQUIRY</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <h1 style="margin:0 0 24px;font-size:24px;font-weight:600;color:#0D4A3A;">
                        New enquiry from ${submission.name}
                      </h1>
                      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #C8D0CC;border-radius:12px;overflow:hidden;">
                        ${[
                          ["Name", submission.name],
                          ["Organisation", submission.organisation ?? "—"],
                          ["Email", submission.email],
                          ["Phone", submission.phone ?? "—"],
                          ["Service", submission.service ?? "—"],
                        ]
                          .map(
                            ([label, value], i) => `
                          <tr style="background:${i % 2 === 0 ? "#F2F5F3" : "#ffffff"};">
                            <td style="padding:12px 16px;font-size:12px;font-weight:600;color:#2A8C6E;letter-spacing:2px;text-transform:uppercase;width:140px;">
                              ${label}
                            </td>
                            <td style="padding:12px 16px;font-size:14px;font-weight:300;color:#2E2E2E;">
                              ${value}
                            </td>
                          </tr>
                        `,
                          )
                          .join("")}
                      </table>
                      <div style="margin-top:24px;padding:20px;background:#F2F5F3;border-radius:12px;border:1px solid #C8D0CC;">
                        <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#2A8C6E;letter-spacing:2px;text-transform:uppercase;">Message</p>
                        <p style="margin:0;font-size:15px;font-weight:300;line-height:1.6;color:#2E2E2E;">
                          ${submission.message}
                        </p>
                      </div>
                      <div style="margin-top:24px;">
                        <a href="${process.env.NEXTAUTH_URL ?? "https://cosmosai.mw"}/admin" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:500;color:#ffffff;text-decoration:none;border-radius:50px;background:#2E7D5E;">
                          View in Admin Dashboard
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#F2F5F3;padding:24px 40px;border-top:1px solid #C8D0CC;">
                      <p style="margin:0;font-size:12px;color:#666666;">
                        © ${new Date().getFullYear()} Cosmos AI · Malawi · <a href="https://cosmosai.mw" style="color:#2A8C6E;text-decoration:none;">cosmosai.mw</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}
