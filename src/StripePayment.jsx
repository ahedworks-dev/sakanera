import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Stripe Promise laden
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo';
const stripePromise = loadStripe(STRIPE_KEY);

// Card Element Styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

// Stripe Checkout Form
function StripeCheckoutForm({ amount, planName, onSuccess, onError, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Simuliere erfolgreiche Zahlung (2 Sekunden)
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('✅ Stripe Payment Method erstellt:', paymentMethod);

      onSuccess({
        paymentMethod: 'stripe',
        paymentMethodId: paymentMethod.id,
        amount: amount,
        plan: planName,
      });

    } catch (err) {
      console.error('❌ Stripe Fehler:', err);
      setError(err.message);
      onError(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-sky-50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-sm text-gray-600">Zu zahlen:</div>
            <div className="text-3xl font-bold text-sky-600">{amount.toFixed(2)}€</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Paket:</div>
            <div className="text-lg font-semibold">{planName}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
        <label className="block text-sm font-medium mb-3 text-gray-700">
          Kreditkarten-Daten
        </label>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
          disabled={processing}
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-sky-500 text-white py-3 rounded-lg hover:bg-sky-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Zahlung wird verarbeitet...
            </span>
          ) : (
            `Jetzt bezahlen ${amount.toFixed(2)}€`
          )}
        </button>
      </div>

      <div className="text-center text-xs text-gray-500">
        <p>🔒 Sichere Zahlung über Stripe</p>
        <p>Deine Kartendaten werden verschlüsselt übertragen</p>
      </div>
    </form>
  );
}

// Wrapper Component mit Stripe Elements Provider
export default function StripePayment({ amount, planName, onSuccess, onError, onCancel }) {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm
        amount={amount}
        planName={planName}
        onSuccess={onSuccess}
        onError={onError}
        onCancel={onCancel}
      />
    </Elements>
  );
}