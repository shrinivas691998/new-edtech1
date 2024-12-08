document.addEventListener('DOMContentLoaded', function() {
    // Get registration data from sessionStorage
    const registrationData = JSON.parse(sessionStorage.getItem('registrationData'));
    
    if (!registrationData) {
        alert('Registration data not found. Please register first.');
        window.location.href = 'registration.html';
        return;
    }

    // Display course details and amount
    document.getElementById('studentName').textContent = `${registrationData.firstName} ${registrationData.lastName}`;
    document.getElementById('courseDetails').textContent = `${registrationData.branch} - ${registrationData.course}`;
    
    // Set fixed course amount for all branches
    const amount = 15000; // ₹15,000 fixed amount for all courses
    document.getElementById('courseAmount').textContent = `₹${amount.toLocaleString('en-IN')}`; // Format with Indian number system

    // Initialize PhonePe payment
    document.getElementById('payButton').onclick = async function(e) {
        e.preventDefault();
        
        try {
            // Show loading spinner
            document.getElementById('loadingSpinner').style.display = 'block';
            document.getElementById('payButton').disabled = true;
            
            // Generate merchant transaction ID
            const merchantTransactionId = 'MT' + Date.now();
            
            // Create payment request
            const paymentRequest = {
                merchantId: "MERCHANTUAT",  // Replace with your PhonePe merchant ID
                merchantTransactionId: merchantTransactionId,
                amount: amount * 100, // Amount in paise (₹15,000 = 1500000 paise)
                callbackUrl: `${window.location.origin}/payment-callback.html`,
                merchantUserId: "MUID" + Date.now(),
                mobileNumber: registrationData.phone,
                deviceContext: {
                    deviceOS: "WEB"
                },
                paymentInstrument: {
                    type: "PAY_PAGE"
                }
            };

            // Call your backend to generate payment URL
            const response = await fetch('/api/generate-phonepe-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentRequest)
            });

            if (!response.ok) {
                throw new Error('Failed to generate payment URL');
            }

            const { paymentUrl } = await response.json();

            // Store transaction ID in sessionStorage
            sessionStorage.setItem('currentTransactionId', merchantTransactionId);

            // Open PhonePe payment page
            window.location.href = paymentUrl;

        } catch (error) {
            console.error('Payment initiation failed:', error);
            document.getElementById('statusMessage').className = 'status-message status-error';
            document.getElementById('statusMessage').textContent = 'Failed to initiate payment. Please try again.';
            document.getElementById('statusMessage').style.display = 'block';
        } finally {
            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('payButton').disabled = false;
        }
    };
});

// Function to handle payment callback
window.handlePaymentCallback = async function(status, transactionId) {
    try {
        if (status === 'SUCCESS') {
            const paymentDetails = {
                paymentId: transactionId,
                amount: document.getElementById('courseAmount').textContent.replace('₹', ''),
                status: 'Paid'
            };

            // Send confirmation emails
            await window.sendConfirmationEmails(paymentDetails);

            // Clear transaction ID
            sessionStorage.removeItem('currentTransactionId');

            // Show success message and redirect
            alert('Payment successful! Registration completed.');
            window.location.href = 'index.html';
        } else {
            throw new Error('Payment failed or cancelled');
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        alert('There was an error processing your payment. Please contact support.');
    }
};

// Verify payment status
async function verifyPaymentStatus(transactionId) {
    try {
        const response = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transactionId })
        });
        
        if (!response.ok) {
            throw new Error('Payment verification failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Payment verification failed:', error);
        throw error;
    }
} 