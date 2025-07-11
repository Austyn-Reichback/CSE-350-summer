document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.querySelector('.input-area input');
    const targetLanguage = document.getElementById('targetLanguage');
    const translateButton = document.querySelector('.input-area button');
    const translatedText = document.querySelector('.message-area');
    const loadingIndicator = document.createElement('div');
    

    translateButton.addEventListener('click', async () => {
        const text = inputText.value.trim();
        const lang = targetLanguage.value;

        if (!text) {
            const errorDiv = document.createElement('div');
            errorDiv.textContent = 'Please enter text to translate.';
            errorDiv.className = 'error-message';
            translatedText.appendChild(errorDiv);
            return;
        }

        // Clear previous messages
        translatedText.innerHTML = '';
        loadingIndicator.classList.remove('hidden');
        translateButton.disabled = true;

        try {
            const payload = {
                contents: [{
                    role: "user",
                    parts: [{ text: `Translate this text to ${lang}. Return only the translation, no additional text: ${text}` }]
                }]
            };

            const apiKey = "AIzaSyCuMBNIcuXj3njv2T3wAw8bajABxcuOsCU"; 

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
            }

            const result = await response.json();
            console.log('API Response:', result); // Debug log

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                
                let translatedTextContent = result.candidates[0].content.parts[0].text;
                
                // Clean up the response - remove common prefixes
                translatedTextContent = translatedTextContent.replace(/^Translation:\s*/i, '');
                translatedTextContent = translatedTextContent.replace(/^Here's the translation:\s*/i, '');
                translatedTextContent = translatedTextContent.replace(/^The translation is:\s*/i, '');
                translatedTextContent = translatedTextContent.replace(/^Translated text:\s*/i, '');
                translatedTextContent = translatedTextContent.replace(/^In \w+:\s*/i, '');
                translatedTextContent = translatedTextContent.replace(/^["']|["']$/g, '');
                translatedTextContent = translatedTextContent.trim();
                
                const messageDiv = document.createElement('div');
                messageDiv.textContent = translatedTextContent;
                messageDiv.className = 'translated-message';
                translatedText.appendChild(messageDiv);
            } else {
                const errorDiv = document.createElement('div');
                errorDiv.textContent = 'Translation failed: No valid response from API.';
                errorDiv.className = 'error-message';
                translatedText.appendChild(errorDiv);
            }

        } catch (error) {
            console.error('Error during translation:', error);
            const errorDiv = document.createElement('div');
            errorDiv.textContent = `Translation error: ${error.message}. Please try again.`;
            errorDiv.className = 'error-message';
            translatedText.appendChild(errorDiv);
        } finally {
            loadingIndicator.classList.add('hidden');
            translateButton.disabled = false;
        }
    });

    // Allow sending with Enter key
    inputText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            translateButton.click();
        }
    });
});