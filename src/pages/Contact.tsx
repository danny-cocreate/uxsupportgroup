import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2, Mail, Phone, MapPin } from "lucide-react";
import { useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (formData.message.length < 10) {
      toast({
        title: "Message too short",
        description: "Please provide more details (at least 10 characters)",
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
      } = await supabase.functions.invoke('send-contact-inquiry', {
        body: {
          name: formData.name,
          email: formData.email,
          message: formData.message
        }
      });
      if (error) throw error;
      toast({
        title: "Message Sent!",
        description: "Thank you! We've received your message and will get back to you soon."
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
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
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a question or want to learn more? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <Card className="p-8 md:p-12 shadow-xl">
                <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-bold uppercase">
                      Name *
                    </Label>
                    <Input id="name" type="text" required value={formData.name} onChange={e => setFormData({
                    ...formData,
                    name: e.target.value
                  })} className="border-2" placeholder="Your name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-bold uppercase">
                      Email *
                    </Label>
                    <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({
                    ...formData,
                    email: e.target.value
                  })} className="border-2" placeholder="your@email.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-bold uppercase">
                      Message *
                    </Label>
                    <Textarea id="message" required rows={6} placeholder="Tell us what's on your mind..." value={formData.message} onChange={e => setFormData({
                    ...formData,
                    message: e.target.value
                  })} className="border-2 resize-none" />
                    
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all group uppercase">
                    {isSubmitting ? <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </> : <>
                        Send Message
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </>}
                  </Button>
                </form>
              </Card>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                  <p className="text-muted-foreground mb-8">
                    We're here to help and answer any questions you might have. Reach out to us and we'll respond as soon as we can.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Email</h3>
                      <a href="mailto:info@uxsupportgroup.com" className="text-muted-foreground hover:text-primary transition-colors">
                        info@uxsupportgroup.com
                      </a>
                    </div>
                  </div>

                  
                </div>

                <Card className="p-6 bg-primary/5 border-primary/20">
                  <h3 className="font-bold mb-3">Looking for Sponsorship or Partnership?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you're interested in sponsorship opportunities or partnerships, please visit our dedicated pages:
                  </p>
                  <div className="space-y-2">
                    <a href="/sponsor" className="block text-sm font-semibold text-primary hover:underline">
                      → Sponsorship Opportunities
                    </a>
                    <a href="/partner" className="block text-sm font-semibold text-primary hover:underline">
                      → Partnership Inquiries
                    </a>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default Contact;