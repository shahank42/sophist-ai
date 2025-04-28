import DodoPayments from "dodopayments";

export const dodopayments = new DodoPayments({
  bearerToken: process.env.VITE_DODO_PAYMENTS_API_KEY,
  environment: "test_mode", // defaults to 'live_mode'
});
