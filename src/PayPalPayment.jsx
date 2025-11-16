import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { DollarSign, Lock, AlertCircle, CheckCircle } from 'lucide-react';

// ⚠️ WICHTIG: Ersetze mit deinem echten PayPal Client ID!
// Test: Sandbox Client ID
// Live: Production Client ID
const PAYPAL_CLIENT_ID = 'DEIN_PAYPAL_CLIENT_ID_HIER';

function PayPalButtonsWrapper({ plan, onSuccess, onCancel }) {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const createOrder = (data, actions) => {
    console.log('📡 Erstelle PayPal Order für:', plan);
    setProcessing(true);
    
    return actions.order.create({
      purchase_units: [
        {
          description: `sakanera ${plan.name} - WG Inserat`,
          amount: {
            currency_code: 'EUR',
            value: plan.price.toFixed(2),
          },
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      },
    });
  };

  const onApprove = async (data, actions) => {
    try {
      console.log('✅ PayPal Order approved:', data.orderID);
      
      const details = await actions.order.capture();
      console.log('✅ PayPal Payment captured:', details);

      setProcessing(false);
      
      onSuccess({
        method: 'paypal',
        transactionId: details.id,
        amount: plan.price,
        status: details.status,
        payer: details.payer,
      });
    } catch (err) {
      console.error('❌ PayPal Error:', err);
      setError(err.message || 'Fehler bei der Zahlung');
      setProcessing(false);
    }
  };

  const onError = (err) => {
    console.error('❌ PayPal Error:', err);
    setError('Ein Fehler ist bei PayPal aufgetreten. Bitte versuche es erneut.');
    setProcessing(false);
  };

  const handleCancelPayPal = (data) => {
    console.log('❌ PayPal Payment cancelled:', data);
    setError('Zahlung wurde abgebrochen');
    setProcessing(false);
  };

  return (
    <div className="space-y-4">
      {/* Plan Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{plan.name}</h3>
            <p className="text-sm text-gray-600">{plan.description}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">{plan.price}€</p>
            <p className="text-sm text-gray-500">einmalig</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
        <Lock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-900">
          Du wirst zu PayPal weitergeleitet um die Zahlung sicher abzuschließen
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

      {/* PayPal Buttons */}
      <div className="space-y-3">
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          onCancel={handleCancelPayPal}
          disabled={processing}
        />
      </div>

      {/* Cancel Button */}
      <button
        type="button"
        onClick={() => onCancel()}
        disabled={processing}
        className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
      >
        Abbrechen
      </button>
    </div>
  );
}

export default function PayPalPayment({ plan, onSuccess, onCancel }) {
  const [sdkReady, setSdkReady] = useState(false);

  const initialOptions = {
    'client-id': PAYPAL_CLIENT_ID,
    currency: 'EUR',
    intent: 'capture',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center pb-4 border-b">
        <div className="flex items-center justify-center gap-2 mb-2">
          <DollarSign className="w-6 h-6 text-[#0070BA]" />
          <h3 className="text-xl font-bold text-gray-900">PayPal</h3>
        </div>
        <p className="text-sm text-gray-600">Sichere Zahlung mit PayPal</p>
      </div>

      {/* PayPal Provider */}
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtonsWrapper 
          plan={plan} 
          onSuccess={onSuccess} 
          onCancel={onCancel} 
        />
      </PayPalScriptProvider>

      {/* PayPal Badge */}
      <div className="pt-4 border-t text-center">
        <p className="text-xs text-gray-500">
          Powered by <span className="font-semibold text-[#0070BA]">PayPal</span>
        </p>
      </div>
    </div>
  );
}