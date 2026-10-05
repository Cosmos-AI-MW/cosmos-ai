import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Cosmos AI",
  description: "How Cosmos AI collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-cosmos-chalk min-h-screen font-sans">
      <Navbar />

      <section className="bg-cosmos-forest px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-cosmos-teal mb-2 text-sm font-medium tracking-widest uppercase">
            Legal
          </div>
          <h1 className="font-display text-4xl font-semibold text-white">
            Privacy Policy
          </h1>
          <p className="text-cosmos-mist mt-3 text-base font-light">
            Last updated: October 5, 2026
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="border-cosmos-silver rounded-2xl border bg-white p-8 md:p-12">
            <p className="text-cosmos-forest/70 mb-8 text-base font-light">
              Cosmos AI operates a website, AI-powered tools, and a
              WhatsApp-based assistant (the "Service"). This policy explains
              what information we collect, how we use it, and your choices. For
              questions, contact us at{" "}
              <a
                href="mailto:hello@cosmosai.mw"
                className="text-cosmos-teal hover:underline"
              >
                hello@cosmosai.mw
              </a>
              .
            </p>

            {[
              {
                title: "1. Information We Collect",
                content: (
                  <>
                    <p className="text-cosmos-forest/80 mb-3 text-base font-light">
                      When you use our website and tools, we collect:
                    </p>
                    <ul className="mb-4 space-y-2 pl-4">
                      {[
                        "Account details: your email address and encrypted password when you register.",
                        "Usage data: documents you generate through Cosmos Write, including prompts and outputs.",
                        "Contact information: name, organisation, phone number, and message when you submit our contact form.",
                        "Technical data: session identifiers, browser type, and approximate location for security and performance.",
                      ].map((item) => (
                        <li
                          key={item}
                          className="text-cosmos-forest/80 flex gap-2 text-base font-light"
                        >
                          <span className="bg-cosmos-teal mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-cosmos-forest/80 mb-3 text-base font-light">
                      When you message our WhatsApp number, we additionally
                      collect:
                    </p>
                    <ul className="space-y-2 pl-4">
                      {[
                        "Contact details: your WhatsApp phone number and profile name.",
                        "Messages: the content of messages you send to the Service and our replies.",
                        "Technical data: message timestamps and delivery status.",
                      ].map((item) => (
                        <li
                          key={item}
                          className="text-cosmos-forest/80 flex gap-2 text-base font-light"
                        >
                          <span className="bg-cosmos-teal mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-cosmos-forest/80 mt-4 text-base font-light">
                      We do not collect your WhatsApp password or access your
                      contacts, photos, or other chats.
                    </p>
                  </>
                ),
              },
              {
                title: "2. How We Use Your Information",
                content: (
                  <>
                    <p className="text-cosmos-forest/80 mb-3 text-base font-light">
                      We use your information to:
                    </p>
                    <ul className="space-y-2 pl-4">
                      {[
                        "Provide and improve the Service, including generating documents and responding to messages.",
                        "Manage your account, track usage against your plan limits, and process upgrades.",
                        "Respond to contact form submissions and support requests.",
                        "Send transactional emails such as email verification and account notifications.",
                        "Prevent fraud, abuse, and unauthorised use.",
                        "Comply with legal obligations.",
                      ].map((item) => (
                        <li
                          key={item}
                          className="text-cosmos-forest/80 flex gap-2 text-base font-light"
                        >
                          <span className="bg-cosmos-teal mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-cosmos-forest/80 mt-4 text-base font-light">
                      We do not sell your personal information.
                    </p>
                  </>
                ),
              },
              {
                title: "3. Sharing Your Information",
                content: (
                  <>
                    <p className="text-cosmos-forest/80 mb-3 text-base font-light">
                      We share information only with:
                    </p>
                    <ul className="space-y-2 pl-4">
                      {[
                        "Anthropic — our AI provider processes message content solely to generate responses on our behalf.",
                        "Resend — our email provider delivers transactional emails such as verification and notifications.",
                        "Meta Platforms (WhatsApp) — which delivers messages through the WhatsApp Business Platform under its own terms and privacy policy.",
                        "Neon — our database host stores your account and usage data under confidentiality obligations.",
                        "Authorities — when required by law or to protect against fraud or harm.",
                      ].map((item) => (
                        <li
                          key={item}
                          className="text-cosmos-forest/80 flex gap-2 text-base font-light"
                        >
                          <span className="bg-cosmos-teal mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                ),
              },
              {
                title: "4. AI Processing",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    Our tools use artificial intelligence to understand requests
                    and generate professional documents. Message and prompt
                    content is processed by Anthropic solely to generate
                    responses. We do not use your content to train AI models.
                    Generated documents are stored to provide your conversation
                    history and may be deleted at your request.
                  </p>
                ),
              },
              {
                title: "5. Data Retention",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    We keep your information only as long as needed to provide
                    the Service, meet legal and accounting requirements, and
                    resolve disputes. Account data is retained while your
                    account is active. After account deletion, personal data is
                    removed within 30 days except where the law requires longer
                    retention. Contact form submissions are retained for up to
                    12 months for business correspondence purposes.
                  </p>
                ),
              },
              {
                title: "6. Security",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    We use reasonable technical and organisational measures to
                    protect your information, including encryption in transit,
                    hashed passwords, and access controls. No system is
                    completely secure, so we cannot guarantee absolute security.
                    If you believe your account has been compromised, contact us
                    immediately at{" "}
                    <a
                      href="mailto:hello@cosmosai.mw"
                      className="text-cosmos-teal hover:underline"
                    >
                      hello@cosmosai.mw
                    </a>
                    .
                  </p>
                ),
              },
              {
                title: "7. Your Rights",
                content: (
                  <>
                    <p className="text-cosmos-forest/80 mb-3 text-base font-light">
                      Subject to applicable law, including the data protection
                      laws of Malawi, you may:
                    </p>
                    <ul className="mb-4 space-y-2 pl-4">
                      {[
                        "Request access to the information we hold about you.",
                        "Request correction of inaccurate information.",
                        "Request deletion of your information.",
                        "Object to or restrict certain processing.",
                      ].map((item) => (
                        <li
                          key={item}
                          className="text-cosmos-forest/80 flex gap-2 text-base font-light"
                        >
                          <span className="bg-cosmos-teal mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-cosmos-forest/80 text-base font-light">
                      To exercise these rights, email{" "}
                      <a
                        href="mailto:hello@cosmosai.mw"
                        className="text-cosmos-teal hover:underline"
                      >
                        hello@cosmosai.mw
                      </a>{" "}
                      or visit our{" "}
                      <a
                        href="/data-deletion"
                        className="text-cosmos-teal hover:underline"
                      >
                        data deletion page
                      </a>
                      .
                    </p>
                  </>
                ),
              },
              {
                title: "8. Children",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    The Service is not intended for anyone under 18 years of
                    age, and we do not knowingly collect information from
                    minors. If you believe we have collected information from
                    someone under 18, please contact us immediately.
                  </p>
                ),
              },
              {
                title: "9. Changes to This Policy",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    We may update this policy from time to time. The "Last
                    updated" date at the top of this page shows the latest
                    version. Continued use of the Service after changes means
                    you accept the updated policy. For significant changes we
                    will notify registered users by email.
                  </p>
                ),
              },
              {
                title: "10. Contact Us",
                content: (
                  <div className="text-cosmos-forest/80 space-y-1 text-base font-light">
                    <p>Cosmos AI</p>
                    <p>
                      Email:{" "}
                      <a
                        href="mailto:hello@cosmosai.mw"
                        className="text-cosmos-teal hover:underline"
                      >
                        hello@cosmosai.mw
                      </a>
                    </p>
                    <p>
                      Website:{" "}
                      <a
                        href="https://cosmosai.mw"
                        className="text-cosmos-teal hover:underline"
                      >
                        cosmosai.mw
                      </a>
                    </p>
                  </div>
                ),
              },
            ].map((section) => (
              <div
                key={section.title}
                className="border-cosmos-silver mb-8 border-b pb-8 last:mb-0 last:border-0 last:pb-0"
              >
                <h2 className="font-display text-cosmos-forest mb-4 text-xl font-semibold">
                  {section.title}
                </h2>
                {section.content}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
