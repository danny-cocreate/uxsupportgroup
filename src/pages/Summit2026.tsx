import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import heroBg from "@/assets/liquid-data-bust.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Summit2026 = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName || trimmedName.length > 100) {
      toast({
        title: "Name required",
        description: "Please enter your name (max 100 characters).",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || trimmedEmail.length > 255 || !emailRegex.test(trimmedEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("join-summit-waitlist", {
        body: {
          name: trimmedName,
          email: trimmedEmail,
        },
      });

      if (error || !data?.success) {
        console.error("[WAITLIST] Error response", error || data);
        throw new Error(
          (data && (data as any).error) || "Failed to join waitlist. Please try again."
        );
      }

      toast({
        title: "You're on the waitlist!",
        description:
          "Thank you. We'll email you as soon as AIxUX Summit 2026 dates and tickets are announced.",
      });

      setFormData({ name: "", email: "" });
    } catch (err: any) {
      console.error("[WAITLIST] Submission error", err);
      toast({
        title: "Submission failed",
        description:
          err?.message || "Something went wrong. Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
        {/* Hero / holding section */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          <img
            src={heroBg}
            alt="Abstract visualization for AIxUX Summit 2026"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/85" />

          <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

          <div className="container relative z-10 mx-auto px-4 pt-6 pb-20">
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                AI<span className="text-gradient">x</span>UX Summit 2026
              </h1>
              <p className="text-xl text-foreground/80 mb-4 max-w-2xl">
                We&rsquo;re designing the next AIxUX Summit right now. Limited
                seats, deep hands-on formats, and a community of builders who
                care about both AI and human experience.
              </p>
              <p className="text-md text-foreground/70 mb-8 max-w-2xl">
                Join the waitlist to be the first to hear about dates, speakers,
                and early access tickets.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="waitlist-name">Name</Label>
                  <Input
                    id="waitlist-name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waitlist-email">Email</Label>
                  <Input
                    id="waitlist-email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    disabled={isSubmitting}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full md:w-auto text-lg px-8 py-6 bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Joining waitlist...
                    </>
                  ) : (
                    <>Join the waitlist</>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Simple info section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-4">
                What to expect at AIxUX Summit 2026
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                We&rsquo;re keeping the same DNA as the inaugural summit:
                laptops open, tools in hand, and formats designed for real
                practice instead of passive watching.
              </p>
              <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
                <li>Hands-on labs where you build real AI x UX artifacts</li>
                <li>Facilitated sessions led by experienced practitioners</li>
                <li>
                  A curated group of designers, product builders, and leaders
                </li>
                <li>Space to reflect on ethics, craft, and long-term impact</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
  );
};

export default Summit2026;
