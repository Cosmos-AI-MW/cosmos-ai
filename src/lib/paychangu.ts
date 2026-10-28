const PAYCHANGU_BASE_URL = "https://api.paychangu.com";

const SECRET_KEY = process.env.PAYCHANGU_SECRET_KEY ?? "";

// Plan details
export const PLANS = {
  starter: {
    name: "Starter",
    amount: 5000,
    currency: "MWK",
    generationsLimit: 50,
    description: "Cosmos AI Starter Plan — 50 generations per month",
  },
  professional: {
    name: "Professional",
    amount: 15000,
    currency: "MWK",
    generationsLimit: 999999,
    description: "Cosmos AI Professional Plan — Unlimited generations",
  },
} as const;

export type PlanKey = keyof typeof PLANS;

// Initiate a hosted checkout payment
export async function initiatePayment({
  txRef,
  plan,
  email,
  firstName,
  lastName,
}: {
  txRef: string;
  plan: PlanKey;
  email: string;
  firstName: string;
  lastName?: string;
}) {
  const planDetails = PLANS[plan];
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://cosmosai.mw";

  const response = await fetch(`${PAYCHANGU_BASE_URL}/payment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      amount: planDetails.amount.toString(),
      currency: planDetails.currency,
      tx_ref: txRef,
      first_name: firstName,
      last_name: lastName ?? "",
      email,
      callback_url: `${baseUrl}/api/webhooks/paychangu`,
      return_url: `${baseUrl}/account?payment=cancelled`,
      customization: {
        title: `Cosmos AI — ${planDetails.name} Plan`,
        description: planDetails.description,
      },
      meta: JSON.stringify({ plan }),
    }),
  });

  const data = (await response.json()) as {
    status: string;
    message: string;
    data?: { checkout_url: string };
  };

  if (!response.ok || data.status !== "success") {
    throw new Error(data.message ?? "Payment initiation failed");
  }

  return data.data?.checkout_url;
}

// Verify a transaction
export async function verifyTransaction(txRef: string) {
  const response = await fetch(
    `${PAYCHANGU_BASE_URL}/verify-payment/${txRef}`,
    {
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        Accept: "application/json",
      },
    },
  );

  const data = (await response.json()) as {
    status: string;
    message: string;
    data?: {
      status: string;
      tx_ref: string;
      amount: number;
      currency: string;
      meta?: string;
    };
  };

  return data;
}
