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
          <h2 className="text-[16px] font-semibold text-foreground mb-2">30-Day Money-Back Guarantee</h2>
          <p>
            We offer a <strong>30-day money-back guarantee</strong> on all paid subscriptions. If you are not satisfied with TipTracker Pro for any reason, you can request a full refund within 30 days of your purchase date — no questions asked.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">How to Request a Refund</h2>
          <p>
            Refunds are processed by our payment provider, <strong>Paddle</strong>. To request a refund:
          </p>
          <ol className="list-decimal ml-5 mt-2 space-y-2">
            <li>
              Visit{' '}
              <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" style={{ color: '#0A84FF' }}>
                paddle.net
              </a>{' '}
              and locate your transaction
            </li>
            <li>Follow the instructions to submit a refund request</li>
            <li>Alternatively, contact our support team through the in-app support feature and we will process the refund on your behalf</li>
          </ol>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">Free Trial</h2>
          <p>
            Pro plan subscriptions include a 7-day free trial. You will not be charged during the trial period. If you cancel before the trial ends, you will not be charged at all.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">After 30 Days</h2>
          <p>
            Refund requests made after the 30-day window will be reviewed on a case-by-case basis. We aim to be fair and reasonable in all cases.
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
            <a href="mailto:support@ejgroup.co" style={{ color: '#0A84FF' }}>support@ejgroup.co</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
