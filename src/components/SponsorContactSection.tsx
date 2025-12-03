import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SponsorContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    package: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check URL params and listen for package selection
  useEffect(() => {
    // Check URL params on mount
    const urlParams = new URLSearchParams(window.location.search);
    const packageParam = urlParams.get('package');
    if (packageParam) {
      setFormData(prev => ({
        ...prev,
        package: packageParam
      }));
    }

    // Listen for package selection events
    const handlePackageSelected = (event: CustomEvent) => {
      setFormData(prev => ({
        ...prev,
        package: event.detail
      }));
    };
    window.addEventListener('packageSelected', handlePackageSelected as EventListener);
    return () => {
      window.removeEventListener('packageSelected', handlePackageSelected as EventListener);
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (formData.message.length < 10) {
      toast({
        title: "Message too short",
        description: "Please provide more details about your goals (at least 10 characters)",
        variant: "destructive"
      });
      return;
    }
    if (formData.message.length > 2000) {
      toast({
        title: "Message too long",
        description: "Please keep your message under 2000 characters",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('send-sponsorship-inquiry', {
        body: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          package_interest: formData.package,
          message: formData.message
        }
      });
      if (error) throw error;
      toast({
        title: "Inquiry Submitted!",
        description: "Thank you! We've received your inquiry and will be in touch within 24 hours."
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        company: '',
        package: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again or email us directly at info@uxsupportgroup.com",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0 gradient-hero opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get <span className="text-gradient">Started</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-background">
                  Name *
                </Label>
                <Input 
                  id="name" 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  className="bg-background/10 border border-background/30 text-background placeholder:text-background/50 focus-visible:ring-background/50" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-background">
                  Email *
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  className="bg-background/10 border border-background/30 text-background placeholder:text-background/50 focus-visible:ring-background/50" 
                />
              </div>
            </div>

            {/* Company and Package Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium text-background">
                  Company *
                </Label>
                <Input 
                  id="company" 
                  type="text" 
                  required 
                  value={formData.company} 
                  onChange={e => setFormData({ ...formData, company: e.target.value })} 
                  className="bg-background/10 border border-background/30 text-background placeholder:text-background/50 focus-visible:ring-background/50" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="package" className="text-sm font-medium text-background">
                  Package Interest *
                </Label>
                <Select 
                  required 
                  value={formData.package} 
                  onValueChange={value => setFormData({ ...formData, package: value })}
                >
                  <SelectTrigger id="package" className="bg-background/10 border border-background/30 text-background focus:ring-background/50">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="Quarterly Partnership - $5,000">Quarterly Partnership - $5,000</SelectItem>
                    <SelectItem value="Custom Community Partnership">Custom Community Partnership</SelectItem>
                    <SelectItem value="Standard (Free) Sponsor">Standard (Free) Sponsor</SelectItem>
                    <SelectItem value="Virtual Booth Add-On - $400">Virtual Booth Add-On - $400</SelectItem>
                    <SelectItem value="Custom Summit Partnership">Custom Summit Partnership</SelectItem>
                    <SelectItem value="Both Community + Summit">Both Community + Summit</SelectItem>
                    <SelectItem value="Just Exploring">Just Exploring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-background">
                Tell us about your goals *
              </Label>
              <Textarea 
                id="message" 
                required 
                rows={5} 
                placeholder="What are you hoping to achieve?" 
                value={formData.message} 
                onChange={e => setFormData({ ...formData, message: e.target.value })} 
                className="bg-background/10 border border-background/30 text-background placeholder:text-background/50 focus-visible:ring-background/50 resize-none" 
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full h-14 text-lg font-semibold bg-background text-foreground hover:bg-background/90 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Inquiry
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center mt-8 text-background/70">
          Questions? Email us at{' '}
          <a href="mailto:info@uxsupportgroup.com" className="underline hover:text-background">
            info@uxsupportgroup.com
          </a>
        </p>
      </div>
    </section>
  );
};

export default SponsorContactSection;
