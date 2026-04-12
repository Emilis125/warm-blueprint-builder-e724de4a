import { createFileRoute } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';

export const Route = createFileRoute('/refund')({
  component: RefundPage,
  head: () => ({
    meta: [
      { title: 'Refund Policy — TipTracker Pro' },
      { name: 'description', content: 'Refund policy for TipTracker Pro by EJGroup.' },
    ],
  }),
});

function RefundPage() {
  return (
    <div className="min-h-screen max-w-[430px] mx-auto px-4 pt-12 pb-16">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => window.history.back()} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="text-[28px] font-bold text-foreground">Refund Policy</h1>
      </div>

      <div className="space-y-5 text-[14px] leading-relaxed text-foreground/80">
        <p className="text-muted-foreground text-[12px]">Last updated: April 12, 2026</p>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">Refund Policy</h2>
          <p>
            Refund requests for paid subscriptions will be reviewed on a case-by-case basis. If you experience a technical issue or billing error, please contact our support team and we will work to resolve it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">How to Request a Refund</h2>
          <p>
            Refunds are processed through <strong>Stripe</strong>. To request a refund:
          </p>
          <ol className="list-decimal ml-5 mt-2 space-y-2">
            <li>Contact our support team through the in-app support feature</li>
            <li>Provide your account email and the date of the charge</li>
            <li>We will process the refund within 5-10 business days</li>
          </ol>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">Free Trial</h2>
          <p>
            Pro plan subscriptions include a 7-day free trial. You will not be charged during the trial period. If you cancel before the trial ends, you will not be charged at all.
          </p>
        </section>


        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">Cancellation</h2>
          <p>
            You can cancel your subscription at any time through the Manage Subscription option in your profile. Upon cancellation, you retain access to paid features until the end of your current billing period. No further charges will be made.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">Contact</h2>
          <p>
            If you have any questions about our refund policy, please contact EJGroup through the in-app support feature or email us at{' '}
            <a href="mailto:ejgroup0@gmail.com" style={{ color: '#0A84FF' }}>ejgroup0@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
