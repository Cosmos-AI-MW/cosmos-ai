import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Cosmos AI",
  description: "Terms governing your use of Cosmos AI services.",
};

export default function TermsPage() {
  return (
    <main className="bg-cosmos-chalk min-h-screen font-sans">
      <Navbar />

      <section className="bg-cosmos-forest px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-cosmos-teal mb-2 text-sm font-medium tracking-widest uppercase">
            Legal
          </div>
          <h1 className="font-display text-4xl font-semibold text-white">
            Terms of Service
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
              These Terms govern your use of the Cosmos AI website, AI-powered
              tools, and WhatsApp assistant (the "Service"), operated by Cosmos
              AI ("we", "us", "our"). By using the Service, you agree to these
              Terms. If you do not agree, please do not use the Service.
            </p>

            {[
              {
                title: "1. The Service",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    Cosmos AI provides AI-powered business writing tools,
                    including Cosmos Write, accessible via our website and
                    WhatsApp. The Service helps individuals and organisations in
                    Malawi and beyond create professional documents quickly and
                    accurately. We may add, change, or remove features at any
                    time.
                  </p>
                ),
              },
              {
                title: "2. Eligibility",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    You must be at least 18 years old and legally able to enter
                    into a binding agreement to use the Service. If you are
                    using the Service on behalf of an organisation, you
                    represent that you have authority to bind that organisation
                    to these Terms. You must also comply with WhatsApp's own
                    terms and policies when using our WhatsApp assistant.
                  </p>
                ),
              },
              {
                title: "3. Your Account and Responsibilities",
                content: (
                  <>
                    <ul className="space-y-2 pl-4">
                      {[
                        "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
                        "Provide accurate information when registering or submitting requests.",
                        "Do not share your account with others or allow others to access the Service through your account.",
                        "Do not use the Service for anything unlawful, fraudulent, abusive, or harmful.",
                        "Do not attempt to reverse engineer, disrupt, or circumvent the Service or its security measures.",
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
                title: "4. AI-Generated Content",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    Cosmos AI uses artificial intelligence to generate documents
                    and responses. While we strive for accuracy, AI-generated
                    content may sometimes be inaccurate, incomplete, or out of
                    date. Do not rely on generated content as professional
                    legal, financial, or medical advice. Always review documents
                    carefully before sending or using them. Cosmos AI is not
                    liable for decisions made based on AI-generated content.
                  </p>
                ),
              },
              {
                title: "5. Usage Plans and Limits",
                content: (
                  <>
                    <p className="text-cosmos-forest/80 mb-3 text-base font-light">
                      The Service is offered under the following plans:
                    </p>
                    <ul className="mb-4 space-y-2 pl-4">
                      {[
                        "Free — 10 generations per month at no cost, available to registered users.",
                        "Starter — 50 generations per month at MWK 5,000/month.",
                        "Professional — Unlimited generations at MWK 15,000/month.",
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
                      Plan limits reset monthly on the anniversary of your
                      registration date. We reserve the right to adjust pricing
                      with reasonable notice to registered users.
                    </p>
                  </>
                ),
              },
              {
                title: "6. Intellectual Property",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    The Service, including its software, branding, and content,
                    belongs to Cosmos AI or its licensors. These Terms do not
                    grant you any ownership rights in the Service. You retain
                    ownership of the content you provide as input. Documents
                    generated by the Service based on your input may be used
                    freely by you for personal and commercial purposes.
                  </p>
                ),
              },
              {
                title: "7. Availability",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    We aim to keep the Service running reliably, but we do not
                    guarantee it will always be available or error-free. It may
                    be interrupted by maintenance, network problems, or issues
                    with third-party providers such as WhatsApp, our AI
                    provider, or our database host. We will endeavour to notify
                    users of planned maintenance where possible.
                  </p>
                ),
              },
              {
                title: "8. Third-Party Services",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    The Service relies on third-party providers including
                    Anthropic (AI generation), Meta's WhatsApp Business
                    Platform, Resend (email delivery), and Neon (database
                    hosting). We are not responsible for the services, outages,
                    or policies of these providers. Their respective terms and
                    privacy policies apply to their processing of your data.
                  </p>
                ),
              },
              {
                title: "9. Privacy",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    Our{" "}
                    <a
                      href="/privacy"
                      className="text-cosmos-teal hover:underline"
                    >
                      Privacy Policy
                    </a>{" "}
                    explains how we handle your information. By using the
                    Service, you agree to it.
                  </p>
                ),
              },
              {
                title: "10. Disclaimer of Warranties",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    The Service is provided "as is" and "as available". To the
                    maximum extent permitted by law, we make no warranties,
                    express or implied, including about accuracy, reliability,
                    or fitness for a particular purpose. We do not warrant that
                    generated documents will be legally compliant or suitable
                    for your specific needs.
                  </p>
                ),
              },
              {
                title: "11. Limitation of Liability",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    To the maximum extent permitted by law, Cosmos AI is not
                    liable for indirect, incidental, or consequential losses
                    arising from your use of the Service, including losses
                    caused by inaccurate AI-generated content or third-party
                    failures. Our total liability for any claim is limited to
                    the fees you paid us in the three months before the claim
                    arose. Nothing in these Terms excludes liability that cannot
                    be excluded under Malawian law.
                  </p>
                ),
              },
              {
                title: "12. Suspension and Termination",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    We may suspend or end your access at any time if you breach
                    these Terms, misuse the Service, or for any other reason
                    with reasonable notice where possible. You may stop using
                    the Service at any time and request deletion of your account
                    by emailing{" "}
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
                title: "13. Changes to These Terms",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    We may update these Terms from time to time. The "Last
                    updated" date at the top shows the latest version.
                    Continuing to use the Service after changes means you accept
                    them. For significant changes we will notify registered
                    users by email.
                  </p>
                ),
              },
              {
                title: "14. Governing Law",
                content: (
                  <p className="text-cosmos-forest/80 text-base font-light">
                    These Terms are governed by the laws of the Republic of
                    Malawi. Any disputes will be handled by the courts of
                    Malawi.
                  </p>
                ),
              },
              {
                title: "15. Contact",
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
