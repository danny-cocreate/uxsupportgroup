// @ts-nocheck
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import uxsgLogo from "@/assets/uxsg-logo-dark-bg.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});
const Footer = ({ variant }: { variant?: 'default' | 'sketchy' }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm({
    resolver: zodResolver(emailSchema)
  });
  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    try {
      const {
        error
      } = await supabase.from('email_subscriptions').insert([{
        email: data.email
      }]);
      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our updates."
          });
        } else {
          throw error;
        }
      } else {
        setShowConfirmation(true);
        reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive"
      });
    }
  };
  return <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            
            <ul className="space-y-2 text-background/80">
              <li><Link to="/summit-2025" className="hover:text-primary transition-colors">AIxUX Summit 2025</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/sponsor" className="hover:text-primary transition-colors">Become a Sponsor</Link></li>
              <li><Link to="/partner" className="hover:text-primary transition-colors">Partner Inquiry</Link></li>
              <li><Link to="/media-kit" className="hover:text-primary transition-colors">Media Kit</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-4">{variant === 'sketchy' ? 'Stay Updated! Join the resistance.' : 'Stay Updated'}</h4>
            {variant !== 'sketchy' && (
              <p className="text-background/80 mb-4">
                Get the latest updates on future events and AI x UX insights
              </p>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="footer-email" className="sr-only">Your email</label>
                <Input
                  id="footer-email"
                  type="email"
                  placeholder="Your email"
                  {...register("email")}
                  className={
                    variant === 'sketchy'
                      ? "bg-white border-2 border-[#090907] text-[#090907] placeholder:text-[#090907]/60 rounded-md shadow-[1px_1px_0_0_#090907]"
                      : "bg-background/10 border-background/20 text-background placeholder:text-background/60"
                  }
                />
                {!!errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message as string}</p>}
              </div>
              <Button
                type="submit"
                variant={variant === 'sketchy' ? 'default' : 'ghost'}
                className={variant === 'sketchy' ? "shrink-0 bg-[#090907] text-white hover:bg-[#090907]/90 border-2 border-[#090907] shadow-[1px_1px_0_0_rgba(255,255,255,0.2)]" : "shrink-0 border border-white hover:border-white/80"}
                aria-label="Subscribe to newsletter"
              >
                {variant === 'sketchy' ? (
                  <Mail className="w-4 h-4" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-background/60 text-sm">
          <div className="flex items-center gap-4">
            <img src={uxsgLogo} alt="UXSG" className="h-14 w-auto" />
            <p>© 2025 UX Support Group. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/code-of-conduct" className="hover:text-primary transition-colors">Summit Code of Conduct</Link>
          </div>
        </div>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Successfully subscribed!</DialogTitle>
            <DialogDescription>
              Thank you for subscribing to our newsletter. You'll receive the latest updates on future events and AI x UX insights.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </footer>;
};
export default Footer;