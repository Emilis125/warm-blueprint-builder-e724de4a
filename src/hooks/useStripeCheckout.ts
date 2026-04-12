import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);

  const openCheckout = async (options: {
    priceId: string;
    successUrl?: string;
    cancelUrl?: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: options.priceId,
          successUrl: options.successUrl || `${window.location.origin}/pricing?checkout=success`,
          cancelUrl: options.cancelUrl || `${window.location.origin}/pricing`,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading };
}
