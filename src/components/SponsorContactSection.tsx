import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { useState, FormEvent } from "react";

const SponsorContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    package: '',
    message: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Package Interest: ${formData.package}

Message:
${formData.message}
    `.trim();
    
    const subject = 'UXSG Sponsorship Inquiry - ' + formData.package;
    const to = 'info@uxsupportgroup.com';
    const cc = 'dnystwn@gmail.com';
    const mailtoLink = `mailto:${to}?cc=${cc}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    window.location.href = mailtoLink;
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0 gradient-hero opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get <span className="text-gradient">Started</span>
          </h2>
          <p className="text-xl text-background/70 max-w-2xl mx-auto">
            15-minute discovery call to discuss your goals
          </p>
        </div>

        <Card className="max-w-3xl mx-auto p-8 md:p-12 bg-background text-foreground border-2 border-background/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold uppercase">
                  Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-2"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold uppercase">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-2"
                />
              </div>
            </div>

            {/* Company and Package Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-bold uppercase">
                  Company *
                </Label>
                <Input
                  id="company"
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="border-2"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="package" className="text-sm font-bold uppercase">
                  Package Interest *
                </Label>
                <Select
                  required
                  value={formData.package}
                  onValueChange={(value) => setFormData({ ...formData, package: value })}
                >
                  <SelectTrigger id="package" className="border-2">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="uppercase font-bold">Community</SelectLabel>
                      <SelectItem value="Quarterly Partnership - $5,000">Quarterly Partnership - $5,000</SelectItem>
                      <SelectItem value="Annual Partnership - $17,000">Annual Partnership - $17,000</SelectItem>
                      <SelectItem value="Custom Partnership">Custom Partnership</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="uppercase font-bold">Summit</SelectLabel>
                      <SelectItem value="Summit Bronze - $2,500">Summit Bronze - $2,500</SelectItem>
                      <SelectItem value="Summit Silver - $3,500">Summit Silver - $3,500</SelectItem>
                      <SelectItem value="Summit Gold - $5,500">Summit Gold - $5,500</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="uppercase font-bold">Other</SelectLabel>
                      <SelectItem value="Both Community + Summit">Both Community + Summit</SelectItem>
                      <SelectItem value="Just Exploring">Just Exploring</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-bold uppercase">
                Tell us about your goals *
              </Label>
              <Textarea
                id="message"
                required
                rows={5}
                placeholder="What are you hoping to achieve?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="border-2 resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group uppercase"
            >
              Submit Inquiry
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </Card>

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

