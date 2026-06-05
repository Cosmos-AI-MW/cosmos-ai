"use client";

import Link from "next/link";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import { useState } from "react";
import { api } from "~/trpc/react";

const services = [
  "AI Consulting & Advisory",
  "Custom AI Development",
  "AI Product Distribution",
  "AI Training & Workshops",
  "Data Analytics & Automation",
  "Not sure yet",
];

type FormState = {
  name: string;
  organisation: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const emptyForm: FormState = {
  name: "",
  organisation: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const submitContact = api.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setLoading(false);
    },
    onError: (error) => {
      console.error("Submission failed:", error);
      setLoading(false);
    },
  });

  function handleSubmit() {
    setLoading(true);
    submitContact.mutate({
      name: form.name,
      organisation: form.organisation,
      email: form.email,
      phone: form.phone,
      service: form.service,
      message: form.message,
    });
  }

  return (
    <main className="bg-cosmos-chalk min-h-screen font-sans">
      {/* NAVBAR */}
      <Navbar active="/contact" />

      {/* HERO */}
      <section className="bg-cosmos-forest px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="text-cosmos-teal mb-3 text-sm font-medium tracking-widest uppercase">
            Get in Touch
          </div>
          <h1 className="font-display mb-6 text-5xl font-semibold text-white">
            Let&apos;s Talk
          </h1>
          <p className="text-cosmos-mist mx-auto max-w-2xl text-xl leading-relaxed font-light">
            Book a free exploratory meeting. We understand your needs first,
            then advise on the best path forward. We take the time to understand
            you before recommending a direction or committing to anything.
          </p>
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <div className="text-cosmos-teal mb-2 text-sm font-medium tracking-widest uppercase">
                  Email
                </div>
                <p className="text-cosmos-forest text-base font-light">
                  hello@cosmosai.co.mw
                </p>
              </div>
              <div>
                <div className="text-cosmos-teal mb-2 text-sm font-medium tracking-widest uppercase">
                  Based In
                </div>
                <p className="text-cosmos-forest text-base font-light">
                  Malawi
                </p>
              </div>
              <div>
                <div className="text-cosmos-teal mb-2 text-sm font-medium tracking-widest uppercase">
                  Response Time
                </div>
                <p className="text-cosmos-forest text-base font-light">
                  We respond to all enquiries within one business day.
                </p>
              </div>
              <div>
                <div className="text-cosmos-teal mb-2 text-sm font-medium tracking-widest uppercase">
                  Exploratory Meeting
                </div>
                <p className="text-cosmos-forest text-base font-light">
                  A free meeting to understand your needs. We advise on the best
                  path forward with no obligation.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              {submitted ? (
                <div className="border-cosmos-teal flex h-full flex-col items-center justify-center rounded-2xl border bg-white p-12 text-center">
                  <div className="mb-4 text-5xl">✓</div>
                  <h2 className="font-display text-cosmos-forest mb-3 text-3xl font-semibold">
                    Message Received
                  </h2>
                  <p className="text-cosmos-forest mb-8 text-lg font-light">
                    Thank you for reaching out. We will be in touch within one
                    business day.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm(emptyForm);
                    }}
                    className="border-cosmos-forest text-cosmos-forest hover:bg-cosmos-forest rounded-full border px-8 py-3 text-base font-medium transition-colors hover:text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="border-cosmos-silver rounded-2xl border bg-white p-8">
                  <h2 className="font-display text-cosmos-forest mb-6 text-2xl font-semibold">
                    Send us a message
                  </h2>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="text-cosmos-forest mb-2 block text-sm font-medium">
                          Full Name <span className="text-cosmos-teal">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className="border-cosmos-silver bg-cosmos-chalk text-cosmos-forest focus:border-cosmos-teal w-full rounded-xl border px-4 py-3 text-base font-light transition-colors outline-none focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-cosmos-forest mb-2 block text-sm font-medium">
                          Organisation
                        </label>
                        <input
                          type="text"
                          name="organisation"
                          value={form.organisation}
                          onChange={handleChange}
                          placeholder="Company or institution"
                          className="border-cosmos-silver bg-cosmos-chalk text-cosmos-forest focus:border-cosmos-teal w-full rounded-xl border px-4 py-3 text-base font-light transition-colors outline-none focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="text-cosmos-forest mb-2 block text-sm font-medium">
                          Email <span className="text-cosmos-teal">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className="border-cosmos-silver bg-cosmos-chalk text-cosmos-forest focus:border-cosmos-teal w-full rounded-xl border px-4 py-3 text-base font-light transition-colors outline-none focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-cosmos-forest mb-2 block text-sm font-medium">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+265 ..."
                          className="border-cosmos-silver bg-cosmos-chalk text-cosmos-forest focus:border-cosmos-teal w-full rounded-xl border px-4 py-3 text-base font-light transition-colors outline-none focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-cosmos-forest mb-2 block text-sm font-medium">
                        Service Interested In
                      </label>
                      <select
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        className="border-cosmos-silver bg-cosmos-chalk text-cosmos-forest focus:border-cosmos-teal w-full rounded-xl border px-4 py-3 text-base font-light transition-colors outline-none focus:bg-white"
                      >
                        <option value="">Select a service</option>
                        {services.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-cosmos-forest mb-2 block text-sm font-medium">
                        Message <span className="text-cosmos-teal">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us about your organisation and what you are trying to achieve..."
                        className="border-cosmos-silver bg-cosmos-chalk text-cosmos-forest focus:border-cosmos-teal w-full rounded-xl border px-4 py-3 text-base font-light transition-colors outline-none focus:bg-white"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={
                        loading || !form.name || !form.email || !form.message
                      }
                      className="bg-cosmos-accent hover:bg-cosmos-forest-light w-full rounded-full px-8 py-3 text-base font-medium tracking-wide text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>

                    <p className="text-cosmos-forest/60 text-center text-sm font-light">
                      We respond to all enquiries within one business day.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
