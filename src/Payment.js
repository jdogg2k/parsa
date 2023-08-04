import React, { Component, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_51IJhJOCf3jLfB4xrjNjrw3taspXPEw6tS085AO54fmgwMjTwMcq0jeitYkPsU1LfWA4V3Xki3nN7pL40jdSVvW5z00zhtOTBHN');

const Payment = () => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(0);

  const handlePayment = async () => {
    const stripe = await stripePromise;

    const paymentIntent = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'amount': '300',  // amount in the smallest currency unit
        'currency': 'usd',  // currency code
        'payment_method_types[]': 'card'  // payment method
      })
    })

    console.log(paymentIntent)

    // Call Stripe.js to handle the payment
    return
    const result = await stripe.confirmCardPayment('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', {
      payment_method: {
        card: {
          // You can use an element like @stripe/react-stripe-js to collect card details
          // Replace this with appropriate card details
          number: '4242 4242 4242 4242',
          exp_month: 12,
          exp_year: 2023,
          cvc: '123',
        },
      },
    });

    console.log(result)
    return

    if (result.error) {
      // Handle payment error
      console.error(result.error.message);
    } else {
      // Payment success
      console.log('Payment succeeded:', result.paymentIntent);
    }
  };

  return (
    <div>
      <h1>Make a Payment</h1>
      <h4>**WORK IN PROGRESS - DO NOT USE**</h4>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
};

export default Payment;