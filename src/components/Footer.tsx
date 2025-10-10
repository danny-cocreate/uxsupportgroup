import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Twitter, Linkedin, Instagram } from "lucide-react";
import uxsgLogo from "@/assets/uxsg-logo-dark-bg.png";
const Footer = () => {
  return <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-3xl font-bold mb-4">AIxUX Summit</h3>
            <p className="text-background/80 mb-4">The anti-conference for UX professionals</p>
            <div className="mb-4">
              <p className="text-background/60 text-xs mb-2">Organized by</p>
              <img src={uxsgLogo} alt="UXSG" className="h-12 w-auto" />
            </div>
            
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Agenda</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tickets</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-4">Partners</h4>
            <ul className="space-y-2 text-background/80">
              <li><a href="/sponsor" className="hover:text-primary transition-colors">Become a Sponsor</a></li>
              <li><a href="/partner" className="hover:text-primary transition-colors">Partner Inquiry</a></li>
              <li><a href="/media-kit" className="hover:text-primary transition-colors">Media Kit</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-4">Stay Updated</h4>
            <p className="text-background/80 mb-4">
              Get the latest updates on future events and AI x UX insights
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your email" className="bg-background/10 border-background/20 text-background placeholder:text-background/60" />
              <Button variant="ghost" className="shrink-0 border border-white hover:border-white/80">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-background/60 text-sm">
          <p>© 2025 AIxUX Summit. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Code of Conduct</a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;