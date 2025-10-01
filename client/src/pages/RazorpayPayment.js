// RazorpayPayment.js
import React, { useState, useEffect } from 'react';

const RazorpayPayment = ({ amount, projectId, onSuccess }) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [scriptError, setScriptError] = useState(null);

    useEffect(() => {
        // Check if Razorpay script is already loaded
        if (window.Razorpay) {
            setScriptLoaded(true);
            return;
        }

        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
            console.log('Razorpay script loaded successfully');
            setScriptLoaded(true);
        };
        script.onerror = () => {
            console.error('Failed to load Razorpay script');
            setScriptError('Failed to load payment gateway. Please try again later.');
        };
        document.body.appendChild(script);

        // Cleanup: Remove script on component unmount
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = () => {
        if (!scriptLoaded) {
            alert('Payment gateway is still loading. Please wait...');
            return;
        }

        if (scriptError) {
            alert(scriptError);
            return;
        }

        if (!window.Razorpay) {
            console.error('Razorpay script not loaded');
            alert('Payment gateway not available. Please try again later.');
            return;
        }

        const options = {
            key: 'rzp_test_x0zcp1rXjViwm4', // Replace with your Razorpay Test Key
            amount: amount * 100, // Razorpay expects amount in paise (cents)
            currency: 'INR',
            name: 'Freelance Platform',
            description: `Payment for Job ID: ${projectId}`,
            handler: function (response) {
                console.log('Payment successful:', response);
                onSuccess(projectId);
            },
            prefill: {
                name: 'Client Name',
                email: 'client@example.com',
                contact: '9999999999'
            },
            notes: { projectId },
            theme: { color: '#3399cc' },
            modal: {
                ondismiss: function () {
                    console.log('Razorpay modal closed');
                }
            },
            config: {
                display: {
                    blocks: {
                        banks: {
                            name: 'Pay with Card',
                            instruments: [
                                {
                                    method: 'card'
                                }
                            ]
                        }
                    },
                    hide: [
                        'upi',
                        'otp',
                        'netbanking',
                        'wallet',
                        'paylater'
                    ],
                    sequence: ['block.banks'],
                    preferences: {
                        show_default_blocks: false
                    }
                }
            },
            payment: {
                methods: {
                    card: true,
                    upi: false,
                    netbanking: false,
                    wallet: false,
                    paylater: false
                }
            }
        };

        try {
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                alert('Payment failed: ' + response.error.description);
            });
            rzp.open();
        } catch (error) {
            console.error('Error initializing Razorpay:', error);
            alert('Error initializing payment: ' + error.message);
        }
    };

    return (
        <button className="btn btn-primary" onClick={handlePayment} disabled={!scriptLoaded || scriptError}>
            Pay ${amount} via Razorpay
        </button>
    );
};

export default RazorpayPayment;