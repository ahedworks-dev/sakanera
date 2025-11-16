import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';

// ⚠️ WICHTIG: Ersetze mit deinem echten Stripe Publishable Key!
// Test-Key (beginnt mit pk_test_...)
const stripePromise = loadStripe('pk_test_51SM5hdIwCp1TbZFGVAj6pcgkNrggYneyotRUpaynrUJPbk7YcDdGYQzOGgYc60z3CjcOe720WBZvUgSnqL04Jndg00ufAOb9dA');

// Card Element Styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
  hidePostalCode: true,
};

function CheckoutForm({ plan, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);
    setProcessing(true);

    try {
      // 1. Erstelle PaymentIntent auf deinem Server
      console.log('📡 Erstelle PaymentIntent für:', plan);
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: plan.price * 100, // in Cents
          currency: 'eur',
          description: `sakanera ${plan.name} - WG Inserat`,
        }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Erstellen des PaymentIntent');
      }

      const { clientSecret } = await response.json();

      // 2. Bestätige Zahlung mit Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        console.error('❌ Stripe Error:', stripeError);
        setError(stripeError.message);
        setLoading(false);
        setProcessing(false);
        return;
      }

      // 3. Erfolg!
      console.log('✅ Zahlung erfolgreich!', paymentIntent);
      
      onSuccess({
        method: 'stripe',
        transactionId: paymentIntent.id,
        amount: plan.price,
        status: paymentIntent.status,
      });

    } catch (err) {
      console.error('❌ Payment Fehler:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan Info */}
      <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{plan.name}</h3>
            <p className="text-sm text-gray-600">{plan.description}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-sky-600">{plan.price}€</p>
            <p className="text-sm text-gray-500">einmalig</p>
          </div>
        </div>
      </div>

      {/* Card Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <CreditCard className="w-4 h-4 inline mr-2" />
          Kreditkarten-Informationen
        </label>
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Deine Zahlung ist sicher verschlüsselt
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Fehler</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Processing Message */}
      {processing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <div>
            <p className="text-sm font-medium text-blue-900">Zahlung wird verarbeitet...</p>
            <p className="text-sm text-blue-700">Bitte warten, nicht schließen!</p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Verarbeiten...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              {plan.price}€ bezahlen
            </>
          )}
        </button>
      </div>

      {/* Stripe Badge */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Powered by <span className="font-semibold text-[#635BFF]">Stripe</span>
        </p>
      </div>
    </form>
  );
}

export default function StripePayment({ plan, onSuccess, onCancel }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center pb-4 border-b">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CreditCard className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Kreditkarte</h3>
        </div>
        <p className="text-sm text-gray-600">Sichere Zahlung mit Stripe</p>
      </div>

      {/* Stripe Elements Wrapper */}
      <Elements stripe={stripePromise}>
        <CheckoutForm plan={plan} onSuccess={onSuccess} onCancel={onCancel} />
      </Elements>

      {/* Accepted Cards */}
      <div className="pt-4 border-t">
        <p className="text-xs text-gray-500 text-center mb-2">Akzeptierte Karten:</p>
        <div className="flex items-center justify-center gap-3">
          <div className="px-3 py-1 bg-gray-100 rounded text-xs font-semibold">Visa</div>
          <div className="px-3 py-1 bg-gray-100 rounded text-xs font-semibold">Mastercard</div>
          <div className="px-3 py-1 bg-gray-100 rounded text-xs font-semibold">Amex</div>
        </div>
      </div>
    </div>
  );
}