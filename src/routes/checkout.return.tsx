import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CheckCircle } from "lucide-react";

const returnSearchSchema = z.object({
  session_id: z.string().optional(),
});

export const Route = createFileRoute("/checkout/return")({
  validateSearch: returnSearchSchema,
  component: CheckoutReturnPage,
  head: () => ({
    meta: [
      { title: "TipTracker Pro — Payment Complete" },
      { name: "description", content: "Your payment was successful." },
    ],
  }),
});

function CheckoutReturnPage() {
  const { session_id } = Route.useSearch();

  return (
    <div className="min-h-screen max-w-[430px] mx-auto px-4 flex flex-col items-center justify-center">
      <div className="text-center animate-fade-in-up">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(48,209,88,0.15)" }}
        >
          <CheckCircle className="w-8 h-8" style={{ color: "#30D158" }} />
        </div>
        <h1 className="text-[28px] font-bold text-foreground mb-2">
          Payment Successful!
        </h1>
        <p className="text-[15px] text-muted-foreground mb-6">
          Your subscription is now active. Enjoy all the premium features!
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center h-[54px] px-8 rounded-2xl text-[17px] font-bold"
          style={{
            background: "#0A84FF",
            color: "white",
            boxShadow: "0 0 24px rgba(10,132,255,0.50)",
          }}
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}