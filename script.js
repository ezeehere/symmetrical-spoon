/**
 * PROJECT CONFIGURATION
 * -------------------------------------------------------------------------
 * INSTRUCTIONS FOR THE USER:
 * 1. Create a Google Form with the following fields:
 *    - Name (Short answer)
 *    - Email (Short answer)
 *    - Rating (Linear scale 1-5 or Multiple choice)
 *    - Category (Dropdown: Event, Service, Product, General)
 *    - Feedback (Paragraph)
 * 2. Get the "pre-filled link" of your form to find the "entry.XXXXXX" IDs for each field.
 * 3. Replace the values in the config object below.
 */

const CONFIG = {
    // REAL Google Form Action URL
    FORM_ACTION_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSe8Qeg1b9-90UVeG6nS27hqK8wlG01TwTHTNZswHTFGX79dig/formResponse',

    // REAL Entry IDs extraction
    ENTRY_IDS: {
        name: 'entry.1927553934',
        email: 'entry.2146988832',
        rating: 'entry.935331672',
        category: 'entry.1219905193',
        message: 'entry.271360266'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    const submitBtn = form.querySelector('.submit-btn');
    const statusMsg = document.getElementById('statusMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI Loading State
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;
        statusMsg.style.opacity = '0';

        // Collect Form Data
        const formData = new FormData();
        formData.append(CONFIG.ENTRY_IDS.name, document.getElementById('name').value);
        formData.append(CONFIG.ENTRY_IDS.email, document.getElementById('email').value);

        // Get Rating
        const rating = document.querySelector('input[name="rating"]:checked');
        formData.append(CONFIG.ENTRY_IDS.rating, rating ? rating.value : '');

        formData.append(CONFIG.ENTRY_IDS.category, document.getElementById('category').value);
        formData.append(CONFIG.ENTRY_IDS.message, document.getElementById('message').value);

        try {
            // Google Forms blocks CORS, so we catch the error but assume it worked if it was a network error (opaque response)
            // or use 'no-cors' mode which sends the request but returns an opaque response.
            await fetch(CONFIG.FORM_ACTION_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });

            // Success UI
            showStatus('✨ Thank you! Your feedback has been recorded.', 'success');
            form.reset();
        } catch (error) {
            console.error('Submission Error:', error);
            showStatus('❌ Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    function showStatus(message, type) {
        statusMsg.innerText = message;
        statusMsg.style.color = type === 'success' ? '#4ade80' : '#f87171'; // Green : Red
        statusMsg.style.opacity = '1';

        setTimeout(() => {
            statusMsg.style.opacity = '0';
        }, 5000);
    }
});
