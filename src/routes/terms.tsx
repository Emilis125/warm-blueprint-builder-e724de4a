import { createFileRoute } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';

export const Route = createFileRoute('/terms')({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: 'Terms & Conditions — TipTracker Pro' },
      { name: 'description', content: 'Terms and conditions for using TipTracker Pro by EJGroup.' },
    ],
  }),
});

function TermsPage() {
  return (
    <div className="min-h-screen max-w-[430px] mx-auto px-4 pt-12 pb-16">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => window.history.back()} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-[28px] font-bold text-foreground">Terms & Conditions</h1>
      </div>

      <div className="space-y-5 text-[14px] leading-relaxed text-foreground/80">
        <p className="text-muted-foreground text-[12px]">Last updated: April 12, 2026</p>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">1. Introduction</h2>
          <p>
            These Terms & Conditions ("Terms") govern your use of TipTracker Pro ("the Service"), operated by <strong>EJGroup</strong> ("we", "us", "our"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">2. Acceptance</h2>
          <p>
            By creating an account or continuing to use the Service, you confirm that you accept these Terms and agree to comply with them. You represent that you are at least 18 years of age or have the authority to bind your organization.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">3. The Service</h2>
          <p>
            TipTracker Pro is a tip tracking and reporting application designed for hospitality workers. It allows users to log tips, view analytics, set goals, and export data for tax purposes. The Service is offered in Free, Pro, and Premium tiers with varying feature access.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">4. Account & Credentials</h2>
          <p>
            You must provide accurate information when creating your account and keep your login credentials confidential. You are responsible for all activity that occurs under your account. Notify us immediately of any unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">5. Licence</h2>
          <p>
            We grant you a limited, non-exclusive, non-transferable, revocable licence to use the Service for your personal or internal business purposes, subject to these Terms and the plan you have subscribed to. You may not reverse-engineer, resell, redistribute, or circumvent any technical limitations of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">6. Intellectual Property</h2>
          <p>
            All intellectual property rights in the Service — including software, documentation, branding, design, and content — are owned by EJGroup. Nothing in these Terms transfers any IP rights to you beyond the limited licence granted above.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">7. User Content</h2>
          <p>
            You retain ownership of the data you enter into the Service (e.g. tip entries, notes). By using the Service, you grant us a limited licence to host and process your content solely for the purpose of providing the Service to you.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">8. Prohibited Use</h2>
          <p>You must not use the Service for any unlawful purpose, including but not limited to:</p>
          <ul className="list-disc ml-5 mt-1 space-y-1">
            <li>Fraud, spam, or deceptive practices</li>
            <li>Infringing the intellectual property rights of others</li>
            <li>Attempting to interfere with or compromise the security or integrity of the Service (including distributing malware, unauthorized access, scraping, or probing)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">9. Payments & Subscriptions</h2>
          <p>
            Payments are processed securely by <strong>Stripe</strong>. Stripe handles all payment processing, billing, and card data securely in compliance with PCI DSS standards.
          </p>
          <p className="mt-2">
            Subscriptions renew automatically at the end of each billing period unless cancelled. Pro plan subscriptions include a 7-day free trial; you will not be charged until the trial ends. You may cancel at any time through the subscription management portal.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">10. Service Level</h2>
          <p>
            We strive to provide reliable access to the Service but do not guarantee uninterrupted, error-free, or secure performance at all times. The Service is provided on an "as is" and "as available" basis.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">11. Warranties Disclaimer</h2>
          <p>
            To the fullest extent permitted by law, we disclaim all implied warranties, including merchantability, fitness for a particular purpose, and non-infringement. We make no warranty that the Service will meet your requirements.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">12. Limitation of Liability</h2>
          <p>
            Our aggregate liability to you for any claims arising from your use of the Service is limited to the total fees you have paid to us in the 12 months preceding the claim. We shall not be liable for indirect, consequential, incidental, or special damages, including loss of profits, data, or goodwill. Nothing in these Terms excludes liability for fraud, death, or personal injury caused by negligence.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">13. Indemnity</h2>
          <p>
            You agree to indemnify and hold harmless EJGroup from any claims, damages, or expenses arising from your use of the Service, your content, any unlawful use, or your violation of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">14. Suspension & Termination</h2>
          <p>
            We may suspend or terminate your access to the Service at any time for material breach, non-payment, security or fraud risk, or repeated or serious policy violations. Upon termination, your right to use the Service ceases immediately. You may export your data before termination where possible.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">15. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">16. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of the jurisdiction in which EJGroup is established. Disputes shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">17. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us through the in-app support feature or visit our website.
          </p>
        </section>
      </div>
    </div>
  );
}
