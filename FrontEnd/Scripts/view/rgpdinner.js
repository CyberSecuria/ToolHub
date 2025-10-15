// inner HTML for the RGPD page
export function rgpdInner() {
    const template = `
        <header>
            <nav>
                <div class="logo">
                    <img src="Assets/logo ToolHub.png" alt="logo">
                    <h1>ToolHub</h1>
                </div>
                <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="toolbox.html">Toolbox</a></li>
            <li><a href="ressource.html">Ressources</a></li>
        </ul>
        <div class="login">
            <button href="login.html">Login</button>
            <button href="signup.html">Sign Up</button>
        </div>
            </nav>
        </header>

        <div class="rgpd-container">
            <h1>Privacy Policy and GDPR</h1>
            
            <section>
                <h2>1. Personal Data Collection</h2>
                <p>We collect the following information:</p>
                <ul>
                    <li>Account information (username, email)</li>
                    <li>Browsing preferences</li>
                    <li>Login data</li>
                    <li>Tool interaction data</li>
                    <li>User preferences and settings</li>
                </ul>
            </section>

            <section>
                <h2>2. Cookie Usage</h2>
                <p>Our website uses cookies for the following purposes:</p>
                <ul>
                    <li>Enhancing your browsing experience</li>
                    <li>Remembering your preferences</li>
                    <li>Analyzing website usage patterns</li>
                    <li>Managing user sessions</li>
                    <li>Providing personalized content</li>
                </ul>
            </section>

            <section>
                <h2>3. Your Rights Under GDPR</h2>
                <p>In accordance with GDPR regulations, you have the following rights:</p>
                <ul>
                    <li>Right to access your data</li>
                    <li>Right to rectification of incorrect data</li>
                    <li>Right to erasure ("right to be forgotten")</li>
                    <li>Right to data portability</li>
                    <li>Right to object to data processing</li>
                    <li>Right to restrict processing</li>
                </ul>
            </section>

            <section>
                <h2>4. Data Security</h2>
                <p>We implement appropriate security measures to protect your personal data against unauthorized access, modification, disclosure, or destruction. Our security measures include:</p>
                <ul>
                    <li>Encryption of sensitive data</li>
                    <li>Regular security assessments</li>
                    <li>Secure data storage protocols</li>
                    <li>Access control and authentication</li>
                </ul>
            </section>

            <section>
                <h2>5. Data Processing</h2>
                <p>We process your data to:</p>
                <ul>
                    <li>Provide and improve our services</li>
                    <li>Personalize your experience</li>
                    <li>Send important notifications</li>
                    <li>Maintain platform security</li>
                </ul>
            </section>

            <section>
                <h2>6. Contact Information</h2>
                <p>For any questions regarding our privacy policy or to exercise your rights, please contact us at:</p>
                <p>Email: privacy@toolhub.com</p>
                <p>Response Time: Within 72 hours</p>
            </section>
        </div>

        <footer class="site-footer">
            <div class="footer-content">
                <a href="rgpd.html">Privacy Policy & GDPR</a>
                <p>&copy; 2025 ToolHub. All rights reserved.</p>
            </div>
        </footer>
    `;

    return template;
}