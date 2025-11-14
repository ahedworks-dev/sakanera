import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PAYPAL_CONFIG = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sandbox',
  currency: 'EUR',
  intent: 'capture',
};

export default function PayPalPayment({ amount, planName, onSuccess, onError, onCancel }) {
  
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: `sakanera - ${planName}`,
          amount: {
            currency_code: PAYPAL_CONFIG.currency,
            value: amount.toFixed(2),
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
      const details = await actions.order.capture();
      
      console.log('✅ PayPal Zahlung erfolgreich:', details);

      onSuccess({
        paymentMethod: 'paypal',
        orderId: details.id,
        payerId: details.payer.payer_id,
        amount: amount,
        plan: planName,
        details: details,
      });

    } catch (err) {
      console.error('❌ PayPal Fehler:', err);
      onError(err);
    }
  };

  const onErrorHandler = (err) => {
    console.error('❌ PayPal Error:', err);
    onError(err);
  };

  const onCancelHandler = () => {
    console.log('⚠️ PayPal Zahlung abgebrochen');
    onCancel();
  };

  return (
    <PayPalScriptProvider
      options={{
        'client-id': PAYPAL_CONFIG.clientId,
        currency: PAYPAL_CONFIG.currency,
        intent: PAYPAL_CONFIG.intent,
      }}
    >
      <div className="space-y-6">
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

        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <PayPalButtons
            style={{
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'pay',
              height: 45,
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onErrorHandler}
            onCancel={onCancelHandler}
          />
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
        >
          Abbrechen
        </button>

        <div className="text-center text-xs text-gray-500">
          <p>🔒 Sichere Zahlung über PayPal</p>
          <p>Du wirst zu PayPal weitergeleitet</p>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}