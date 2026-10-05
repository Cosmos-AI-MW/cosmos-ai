import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Deletion — Cosmos AI",
  description: "How to request deletion of your personal data from Cosmos AI.",
};

export default function DataDeletionPage() {
  return (
    <main className="bg-cosmos-chalk min-h-screen font-sans">
      <Navbar />

      <section className="bg-cosmos-forest px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-cosmos-teal mb-2 text-sm font-medium tracking-widest uppercase">
            Legal
          </div>
          <h1 className="font-display text-4xl font-semibold text-white">
            Data Deletion
          </h1>
          <p className="text-cosmos-mist mt-3 text-base font-light">
            Request removal of your personal data from Cosmos AI.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* How to request */}
          <div className="border-cosmos-silver rounded-2xl border bg-white p-8 md:p-12">
            <h2 className="font-display text-cosmos-forest mb-6 text-2xl font-semibold">
              How to Request Data Deletion
            </h2>
            <p className="text-cosmos-forest/80 mb-6 text-base font-light">
              You have the right to request deletion of your personal data held
              by Cosmos AI at any time. We will process your request within 30
              days and confirm once complete.
            </p>

            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Send an email request",
                  description: (
                    <>
                      Email{" "}
                      <a
                        href="mailto:hello@cosmosai.mw"
                        className="text-cosmos-teal hover:underline"
                      >
                        hello@cosmosai.mw
                      </a>{" "}
                      with the subject line:{" "}
                      <span className="text-cosmos-forest font-medium">
                        Data Deletion Request
                      </span>
                    </>
                  ),
                },
                {
                  step: "2",
                  title: "Include your details",
                  description:
                    "Include the email address or WhatsApp phone number associated with your Cosmos AI account so we can locate your records.",
                },
                {
                  step: "3",
                  title: "We confirm and delete",
                  description:
                    "We will confirm receipt of your request and delete your personal data within 30 days. You will receive a confirmation email once complete.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="bg-cosmos-forest flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-display text-cosmos-forest mb-1 text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-cosmos-forest/80 text-base font-light">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What gets deleted */}
          <div className="border-cosmos-silver rounded-2xl border bg-white p-8 md:p-12">
            <h2 className="font-display text-cosmos-forest mb-6 text-2xl font-semibold">
              What Gets Deleted
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-display text-cosmos-teal mb-3 text-lg font-semibold">
                  Deleted within 30 days
                </h3>
                <ul className="space-y-2">
                  {[
                    "Your account email and password",
                    "Your conversation and document history",
                    "Your usage records and tier information",
                    "WhatsApp phone number and message history",
                    "Contact form submissions",
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
              </div>
              <div>
                <h3 className="font-display text-cosmos-forest mb-3 text-lg font-semibold">
                  Retained where required by law
                </h3>
                <ul className="space-y-2">
                  {[
                    "Transaction and payment records",
                    "Records required for tax or accounting purposes",
                    "Data needed to resolve ongoing disputes",
                  ].map((item) => (
                    <li
                      key={item}
                      className="text-cosmos-forest/80 flex gap-2 text-base font-light"
                    >
                      <span className="bg-cosmos-forest/40 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="border-cosmos-teal bg-cosmos-mist rounded-2xl border p-8">
            <h2 className="font-display text-cosmos-forest mb-3 text-xl font-semibold">
              Questions?
            </h2>
            <p className="text-cosmos-forest/80 mb-4 text-base font-light">
              If you have questions about your data or this process, we are
              happy to help.
            </p>
            <a
              href="mailto:hello@cosmosai.mw"
              className="bg-cosmos-accent hover:bg-cosmos-forest-light inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white transition-colors"
            >
              hello@cosmosai.mw
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
