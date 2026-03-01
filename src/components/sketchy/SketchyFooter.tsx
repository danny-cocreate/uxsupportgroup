import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { HandDrawnRect } from "./HandDrawnRect";

const emailSchema = z.object({ email: z.string().email("Please enter a valid email address") });

export const SketchyFooter = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(emailSchema),
  });
  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    try {
      const { error } = await supabase.from("email_subscriptions").insert([{ email: data.email }]);
      if (error) {
        if (error.code === "23505") toast({ title: "Already subscribed", description: "This email is already subscribed." });
        else throw error;
      } else {
        setShowConfirmation(true);
        reset();
      }
    } catch {
      toast({ title: "Error", description: "Failed to subscribe.", variant: "destructive" });
    }
  };
  return (
    <footer className="paper-bg border-t border-uxsg-ink/15 py-10 font-body">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="text-sm text-uxsg-ink/60">
            <p className="mb-2">UXSG | &copy; 2025 UX Support Group. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <Link to="/about" className="hover:text-uxsg-ink transition-colors">About</Link>
              <Link to="/contact" className="hover:text-uxsg-ink transition-colors">Contact</Link>
              <Link to="/membership" className="hover:text-uxsg-ink transition-colors">Membership</Link>
              <Link to="/sponsor" className="hover:text-uxsg-ink transition-colors">Sponsor</Link>
              <Link to="/partner" className="hover:text-uxsg-ink transition-colors">Partner</Link>
              <Link to="/media-kit" className="hover:text-uxsg-ink transition-colors">Media Kit</Link>
              <Link to="/summit" className="hover:text-uxsg-ink transition-colors">Summit 2026</Link>
              <Link to="/summit-2025" className="hover:text-uxsg-ink transition-colors">Summit 2025</Link>
              <Link to="/privacy" className="hover:text-uxsg-ink transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-uxsg-ink transition-colors">Terms of Service</Link>
              <Link to="/code-of-conduct" className="hover:text-uxsg-ink transition-colors">Code of Conduct</Link>
            </div>
          </div>
          <div className="w-full md:w-auto md:min-w-[340px]">
            <p className="text-sm font-bold text-uxsg-ink mb-2">Stay Updated! Join the resistance.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
              <div className="flex-1 relative">
                <label htmlFor="sketchy-footer-email" className="sr-only">Your email</label>
                <HandDrawnRect fill="white" strokeWidth={1.5} />
                <Input
                  id="sketchy-footer-email"
                  type="email"
                  placeholder="Your email"
                  {...register("email")}
                  className="relative z-10 bg-transparent border-0 text-uxsg-ink placeholder:text-uxsg-ink/50 h-9 shadow-none focus-visible:ring-0"
                />
                {!!errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
              </div>
              <button type="submit" className="relative shrink-0 w-10 h-9 flex items-center justify-center" aria-label="Subscribe">
                <HandDrawnRect fill="var(--uxsg-ink)" stroke="var(--uxsg-ink)" strokeWidth={1.5} />
                <Mail className="w-4 h-4 text-white relative z-10" />
              </button>
            </form>
          </div>
        </div>
      </div>
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Successfully subscribed!</DialogTitle>
            <DialogDescription>You&rsquo;ll receive the latest updates on future events and AI x UX insights.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default SketchyFooter;
