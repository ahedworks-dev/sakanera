// STRIPE & PAYPAL KONFIGURATION
// Diese Keys müssen in .env eingetragen werden!

// WICHTIG: Für Production echte Keys verwenden!
// Aktuell: TEST/DEMO Keys

export const STRIPE_CONFIG = {
  // Stripe Publishable Key (TEST)
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdefghijklmnop',
};

export const PAYPAL_CONFIG = {
  // PayPal Client ID (TEST)
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AZDxjDScFpQtjWTJUtebzopURqB5t4dJDMT9EWwHpE9j8RxV4vB9hxW-sandbox',
  // PayPal Währung
  currency: 'EUR',
  // PayPal Intent
  intent: 'capture',
};

// Zahlungspakete
export const PAYMENT_PLANS = {
  '1month': {
    id: '1month',
    name: '1 Monat',
    duration: 1,
    price: 6.99,
    priceId: 'price_1month', // Stripe Price ID
  },
  '3months': {
    id: '3months',
    name: '3 Monate',
    duration: 3,
    price: 17.99,
    priceId: 'price_3months', // Stripe Price ID
    savings: 14,
    badge: 'Beliebt',
  },
  '6months': {
    id: '6months',
    name: '6 Monate',
    duration: 6,
    price: 29.99,
    priceId: 'price_6months', // Stripe Price ID
    savings: 29,
    badge: 'Bester Preis',
  },
};

// Helper: Konvertiere EUR zu Cent (für Stripe)
export const euroToCents = (euros) => Math.round(euros * 100);

// Helper: Format Preis
export const formatPrice = (price) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};
