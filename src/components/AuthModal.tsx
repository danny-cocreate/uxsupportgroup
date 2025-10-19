import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [magicLink, setMagicLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-magic-link', {
        body: { email: email.trim().toLowerCase() }
      });

      if (error) throw error;

      toast.success(data.message || "Magic link sent! Check your email.");
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending magic link:', error);
      toast.error("Failed to send magic link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setMagicLink('');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) {
        handleReset();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1F2937]">
            Log In or Create Profile
          </DialogTitle>
          <DialogDescription className="text-[#6B7280]">
            Enter your email to receive a magic link for secure authentication.
          </DialogDescription>
        </DialogHeader>

        {!magicLink ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-[#1F2937]">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 border-[#E5E7EB] focus:border-[#8B5CF6]"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Magic Link
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium mb-2">
                ✅ Magic link generated (Development Mode)
              </p>
              <p className="text-xs text-green-700 mb-3">
                Click the link below to authenticate:
              </p>
              <a
                href={magicLink}
                className="text-sm text-[#8B5CF6] hover:text-[#7C3AED] underline break-all"
              >
                {magicLink}
              </a>
            </div>
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full"
            >
              Try Different Email
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
