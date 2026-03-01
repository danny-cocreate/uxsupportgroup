const PrivacyPolicy = () => (
  <main className="container mx-auto px-4 py-24">
    <div className="max-w-4xl mx-auto">
      <h1 className="font-headline text-4xl md:text-5xl font-bold text-uxsg-ink mb-8">Privacy Policy</h1>
      <p className="text-foreground/80 mb-8">Last updated: November 2025</p>
      
      <div className="space-y-8 text-foreground/90">
        <section>
          <h2 className="font-headline text-2xl font-bold text-uxsg-ink mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                When you register for the AIxUX Virtual Summit, we collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact information (email address)</li>
                <li>Professional information (job title, company name)</li>
                <li>Profile information (bio, LinkedIn URL, profile photo)</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Workshop participation and engagement data</li>
              </ul>
            </section>

            <section>
              <h2 className="font-headline text-2xl font-bold text-uxsg-ink mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide access to the virtual summit and related materials</li>
                <li>Send event communications, updates, and Zoom access details</li>
                <li>Create and display your attendee profile in our community gallery</li>
                <li>Facilitate networking and AI-powered matchmaking</li>
                <li>Process payments and send receipts</li>
                <li>Improve our events and services</li>
                <li>Send occasional updates about future events (you can opt out anytime)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-headline text-2xl font-bold text-uxsg-ink mb-4">3. Information Sharing</h2>
              <p className="mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> Zoom (video conferencing), Stripe (payment processing), and email service providers</li>
                <li><strong>Community Gallery:</strong> Your profile information will be visible to other attendees if you opt to create a profile</li>
                <li><strong>Sponsors:</strong> Only aggregated, anonymized data unless you explicitly opt in to share your information</li>
              </ul>
            </section>

            <section>
              <h2 className="font-headline text-2xl font-bold text-uxsg-ink mb-4">4. Your Profile and Public Information</h2>
              <p className="mb-4">
                By creating an attendee profile, you agree that the following information may be displayed publicly in our community gallery:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name, profile photo, job title, and company</li>
                <li>Bio and professional information you provide</li>
                <li>Links to your professional profiles (LinkedIn, portfolio)</li>
                <li>Workshop achievements and contributions (if applicable)</li>
              </ul>
              <p className="mt-4">
                You can request to remove or modify your profile at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="font-headline text-2xl font-bold text-uxsg-ink mb-4">5. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information. Payment information is processed securely through Stripe and we do not store credit card details. All data is encrypted in transit and at rest.
              </p>
            </section>

            <section>
              <h2 className="font-headline text-2xl font-bold text-uxsg-ink mb-4">6. Recording and Content</h2>
              <p className="mb-4">
                The virtual summit sessions will be recorded. By attending, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sessions may be recorded and made available to registered attendees</li>
                <li>Your participation (audio, video, chat) may be captured in recordings</li>
                <li>You can disable your camera and use chat anonymously if you prefer</li>
                <li>Recordings are for personal use only and may not be redistributed</li>
              </ul>
            </section>

            <section>
              <h2 className="font-headline text-2xl font-bold text-uxsg-ink mb-4">7. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt out of marketing communications</li>
                <li>Withdraw consent for profile display</li>
              </ul>
            </section>

            <section>
              <h2 className="font-headline text-2xl font-bold text-uxsg-ink mb-4">8. Cookies and Analytics</h2>
              <p>
                We use cookies and similar technologies to improve your experience on our website and analyze usage patterns. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="font-headline text-2xl font-bold text-uxsg-ink mb-4">9. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect information from children.
              </p>
            </section>

            <section>
              <h2 className="font-headline text-2xl font-bold text-uxsg-ink mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify registered attendees of any material changes via email.
              </p>
            </section>

            <section>
              <h2 className="font-headline text-2xl font-bold text-uxsg-ink mb-4">11. Contact Us</h2>
              <p>
                If you have questions about this privacy policy or how we handle your information, please contact us at privacy@uxsg.co
              </p>
            </section>
      </div>
    </div>
  </main>
);

export default PrivacyPolicy;
