require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: '🚀 Stripe Backend läuft!' });
});

app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency, description } = req.body;
        console.log('📡 Create PaymentIntent:', { amount, currency });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency || 'eur',
            description: description,
            automatic_payment_methods: { enabled: true },
        });

        console.log('✅ PaymentIntent created:', paymentIntent.id);
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('\n🚀 STRIPE BACKEND LÄUFT!');
    console.log('📡 Server: http://localhost:' + PORT);
});