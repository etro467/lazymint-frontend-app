import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// You might add functions here for creating checkout sessions, etc.
// For example:
// export const createCheckoutSession = async (priceId: string) => {
//   const stripe = await getStripe();
//   if (stripe) {
//     // Call your Firebase Cloud Function to create a checkout session
//     // const checkoutSession = await httpsCallable(functions, 'createStripeCheckoutSession')({ priceId });
//     // return stripe.redirectToCheckout({ sessionId: checkoutSession.data.id });
//   }
//   return null;
// };
