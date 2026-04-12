import { createFileRoute } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: 'Privacy Policy — TipTracker Pro' },
      { name: 'description', content: 'Privacy policy for TipTracker Pro by EJGroup.' },
    ],
  }),
});

function PrivacyPage() {
  return (
    <div className="min-h-screen max-w-[430px] mx-auto px-4 pt-12 pb-16">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => window.history.back()} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-[28px] font-bold text-foreground">Privacy Policy</h1>
      </div>

      <div className="space-y-5 text-[14px] leading-relaxed text-foreground/80">
        <p className="text-muted-foreground text-[12px]">Last updated: April 12, 2026</p>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">1. Who We Are</h2>
          <p>
            <strong>EJGroup</strong> ("we", "us", "our") is the data controller for TipTracker Pro. We determine how and why your personal data is processed.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">2. Personal Data We Collect</h2>
          <p>We collect the following categories of personal data:</p>
          <ul className="list-disc ml-5 mt-1 space-y-1">
            <li><strong>Account information</strong> — name, email address, login credentials (email/password or OAuth provider tokens)</li>
            <li><strong>Tip data</strong> — amounts, dates, shifts, workplaces, and notes you enter</li>
            <li><strong>Usage data</strong> — pages visited, features used, device type, browser, IP address, and session identifiers</li>
            <li><strong>Support messages</strong> — any communications you send to us</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">3. How We Use Your Data</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>Providing the Service</strong> — storing your tips, generating reports, syncing data across devices (contract performance)</li>
            <li><strong>Account creation & authentication</strong> — verifying your identity and managing your account (contract performance)</li>
            <li><strong>Customer support</strong> — responding to your enquiries (legitimate interest)</li>
            <li><strong>Product improvement</strong> — analysing usage patterns to improve features (legitimate interest)</li>
            <li><strong>Security & fraud prevention</strong> — detecting and preventing unauthorized access (legitimate interest / legal obligation)</li>
            <li><strong>Communications</strong> — sending service updates and, with your consent, marketing messages (consent)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">4. Who We Share Data With</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>Stripe</strong> — our payment processor, for secure payment processing, subscription management, and billing</li>
            <li><strong>Hosting & infrastructure providers</strong> — for securely hosting the application and database</li>
            <li><strong>Analytics providers</strong> — for anonymised usage analytics to improve the Service</li>
            <li><strong>Professional advisers</strong> — legal and accounting advisers, where necessary</li>
            <li><strong>Authorities</strong> — where required by law or legal process</li>
          </ul>
          <p className="mt-2">We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">5. Data Retention</h2>
          <p>
            We retain your personal data for as long as your account is active and for a reasonable period afterwards to comply with legal obligations. When your data is no longer needed, it will be securely deleted or anonymised.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">6. Your Rights</h2>
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul className="list-disc ml-5 mt-1 space-y-1">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Restrict or object to processing</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, please contact us through the in-app support feature.</p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">7. Security</h2>
          <p>
            We implement appropriate technical and organisational measures to protect your personal data, including encryption in transit and at rest, access controls, and regular security reviews.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">8. Cookies</h2>
          <p>
            We use essential cookies to maintain your session and authentication state. We may use analytics cookies to understand how the Service is used. You can manage cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes through the Service. Continued use of the Service after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">10. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy or your personal data, please contact EJGroup through the in-app support feature.
          </p>
        </section>
      </div>
    </div>
  );
}
