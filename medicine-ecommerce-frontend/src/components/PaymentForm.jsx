import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';

const PaymentForm = ({ onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + '/orders',
            },
            redirect: "if_required",
        });

        if (error) {
            setErrorMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            onSuccess(paymentIntent.id);
            setIsProcessing(false);
        } else {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '20px' }}
            >
                {isProcessing ? t('btnProcessing') || "Processing..." : t('btnPayNow') || "Pay Now"}
            </button>
        </form>
    );
};

export default PaymentForm;
