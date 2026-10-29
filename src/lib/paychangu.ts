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

// Detect mobile money network from Malawian number prefix
export function detectNetwork(mobile: string): "airtel" | "tnm" | null {
  // Remove country code if present
  const clean = mobile.replace(/^\+265/, "0").replace(/^265/, "0");

  // Airtel prefixes: 099x, 098x, 077x
  if (/^(099|098|077)/.test(clean)) return "airtel";

  // TNM prefixes: 088x, 089x
  if (/^(088|089)/.test(clean)) return "tnm";

  return null;
}

// Get mobile money operators from Paychangu
export async function getMobileMoneyOperators() {
  const response = await fetch(`${PAYCHANGU_BASE_URL}/mobile-money`, {
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
      Accept: "application/json",
    },
  });

  const data = (await response.json()) as {
    status: string;
    data?: Array<{
      id: number;
      ref_id: string;
      name: string;
      shortCode: string;
    }>;
  };

  return data.data ?? [];
}

// Initiate WhatsApp direct charge mobile money
export async function initiateWhatsAppPayment({
  mobile,
  chargeId,
  amount,
}: {
  mobile: string;
  chargeId: string;
  amount: number;
}) {
  // Get operators and find the right one
  const operators = await getMobileMoneyOperators();
  const network = detectNetwork(mobile);

  if (!network) {
    throw new Error(
      "Unrecognised mobile number. Please use an Airtel or TNM number.",
    );
  }

  // Find operator ref_id
  const operator = operators.find(
    (op) =>
      op.shortCode?.toLowerCase().includes(network) ||
      op.name?.toLowerCase().includes(network === "airtel" ? "airtel" : "tnm"),
  );

  if (!operator) {
    throw new Error(
      "Mobile money operator not available. Please try again later.",
    );
  }

  // Clean mobile number — Paychangu expects 9 digits without country code
  // Remove +265, 265, or leading 0 to get 9 digit number
  const cleanMobile = mobile
    .replace(/\s/g, "")
    .replace(/^\+265/, "")
    .replace(/^265/, "")
    .replace(/^0/, "");

  // Validate 9 digits
  if (!/^\d{9}$/.test(cleanMobile)) {
    throw new Error(
      "Please send a valid 9-digit Malawian mobile number. Example: 0991234567",
    );
  }

  const response = await fetch(
    `${PAYCHANGU_BASE_URL}/mobile-money/payments/initialize`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        mobile: cleanMobile,
        mobile_money_operator_ref_id: operator.ref_id,
        amount: amount.toString(),
        charge_id: chargeId,
      }),
    },
  );

  const data = (await response.json()) as {
    status: string;
    message: string;
    data?: { chargeId: string };
  };

  if (!response.ok || data.status !== "success") {
    const message =
      typeof data.message === "string"
        ? data.message
        : JSON.stringify(data.message);
    throw new Error(message ?? "Payment request failed");
  }

  return data;
}

// Verify WhatsApp direct charge
export async function verifyWhatsAppPayment(chargeId: string) {
  const response = await fetch(
    `${PAYCHANGU_BASE_URL}/mobile-money/payments/${chargeId}/verify`,
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
      charge_id: string;
      amount: number;
    };
  };

  return data;
}
