// Import js-cookie library from CDN
import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.mjs';

// Cookie management utility for GDPR compliance and user preferences
export const CookieManager = {
  // Set GDPR consent cookie
  setConsent(value) {
    Cookies.set('cookie_consent', value, { expires: 365 });
  },

  // Check if user has given consent
  hasConsent() {
    const val = Cookies.get('cookie_consent');
    console.log('Cookie value:', val); // Debug log
    return val === 'true';
  },

  // Set user preferences cookie
  setPreferences(preferences) {
    Cookies.set('user_preferences', JSON.stringify(preferences), { expires: 30 });
  },

  // Get user preferences from cookie
  getPreferences() {
    const prefs = Cookies.get('user_preferences');
    return prefs ? JSON.parse(prefs) : null;
  },

  // Clear all cookies
  clear() {
    Object.keys(Cookies.get()).forEach(cookie => {
      Cookies.remove(cookie);
    });
  }
};

// Display cookie consent banner for GDPR compliance
export function showCookieConsent() {
    // Check if user has already given consent
    if (CookieManager.hasConsent()) {
        return;
    }

    // Remove any existing banner to avoid duplicates
    const existingBanner = document.querySelector('.cookie-consent');
    if (existingBanner) {
        existingBanner.remove();
    }

    // Create cookie consent banner
    const cookieBar = document.createElement('div');
    cookieBar.className = 'cookie-consent';
    cookieBar.innerHTML = `
        <p>This website uses cookies to improve your experience. By continuing to browse, you accept their use.</p>
        <button id="accept-cookies">Accept</button>
        <button id="decline-cookies">Decline</button>
    `;

    // Add banner to document body
    document.body.appendChild(cookieBar);

    // Handle accept button click
    document.getElementById('accept-cookies').addEventListener('click', () => {
        CookieManager.setConsent('true');
        cookieBar.classList.add('hidden');
        setTimeout(() => cookieBar.remove(), 500); // Remove after animation
    });

    // Handle decline button click
    document.getElementById('decline-cookies').addEventListener('click', () => {
        CookieManager.setConsent('false');
        cookieBar.classList.add('hidden');
        setTimeout(() => cookieBar.remove(), 500); // Remove after animation
    });

    // Ensure banner remains visible
    requestAnimationFrame(() => {
        cookieBar.style.display = 'flex';
        cookieBar.style.zIndex = '10001';
    });
}