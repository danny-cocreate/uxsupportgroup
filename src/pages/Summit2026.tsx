import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, Calendar, Clock, Users, Mail } from "lucide-react";

const Summit2026 = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to join the waitlist.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Brevo API configuration
    const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
    const BREVO_LIST_ID = 8;
    const BREVO_API_URL = "https://api.brevo.com/v3/contacts";

    // Validate API key
    if (!BREVO_API_KEY || BREVO_API_KEY === "your-brevo-api-key-here") {
      toast({
        title: "Configuration Error",
        description: "Brevo API is not configured. Please contact the administrator.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY
        },
        body: JSON.stringify({
          email: email,
          listIds: [BREVO_LIST_ID],
          updateEnabled: true // Allows updating existing contacts
        })
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail("");
        toast({
          title: "You're on the list!",
          description: "We'll notify you when registration opens for AIxUX Virtual Summit 2026."
        });
      } else if (response.status === 400) {
        const errorData = await response.json();
        if (errorData.code === "duplicate_parameter") {
          // Email already exists - treat as success
          setIsSubscribed(true);
          setEmail("");
          toast({
            title: "You're on the list!",
            description: "This email is already registered. We'll notify you when registration opens."
          });
        } else {
          throw new Error(errorData.message || "Failed to join waitlist");
        }
      } else {
        throw new Error("Failed to join waitlist");
      }
    } catch (error) {
      console.error("Waitlist signup error:", error);
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          
          <div className="container relative z-10 mx-auto px-4 py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Coming Soon
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6">
                AI<span className="text-gradient">x</span>UX Virtual Summit
              </h1>
              
              <h2 className="text-2xl md:text-3xl text-foreground mb-8 font-semibold">
                2026
              </h2>
              
              <div className="flex flex-wrap gap-6 mb-10">
                <div className="flex items-center gap-2 text-foreground/80">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg">June 18-19, 2026</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/80">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg">2 Half-Days</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/80">
                  <Users className="w-5 h-5" />
                  <span className="text-lg">Fully Virtual</span>
                </div>
              </div>
              
              <p className="text-lg text-foreground/80 mb-10 max-w-2xl">
                The intersection of AI and UX is evolving fast. Join us June 18-19, 2026 for two days of hands-on sessions, expert speakers, and real tools you can use.
              </p>
              
              {/* Waitlist Form */}
              {!isSubscribed ? (
                <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <div className="flex-1">
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isSubmitting}
                    className="h-12 px-6 bg-foreground text-background hover:bg-foreground/90"
                  >
                    {isSubmitting ? "Joining..." : "Join Waitlist"}
                    {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4" />}
                  </Button>
                </form>
              ) : (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg max-w-md">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">You're on the list!</span>
                </div>
              )}
              
              <p className="text-sm text-foreground/60 mt-4">
                Be the first to know when registration opens. No spam, ever.
              </p>
            </div>
          </div>
        </section>

        {/* Work in Progress Banner */}
        <section className="py-8 bg-muted/50 border-y">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              <span className="font-semibold">🚧 Work in Progress</span> — More details coming soon. Speakers, pricing, and agenda will be announced in early 2026.
            </p>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                What to <span className="text-gradient">Expect</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="text-xl font-bold mb-3">Hands-on Sessions</h3>
                  <p className="text-muted-foreground">
                    Build actual prototypes and tools you can use Monday morning. Real challenges, not hypotheticals.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="text-xl font-bold mb-3">Expert Speakers</h3>
                  <p className="text-muted-foreground">
                    Learn from industry leaders who are shaping the future of AI and UX.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="text-xl font-bold mb-3">Real Tools</h3>
                  <p className="text-muted-foreground">
                    Discover practical tools and techniques you can immediately apply to your work.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="text-xl font-bold mb-3">Networking</h3>
                  <p className="text-muted-foreground">
                    Connect with like-minded professionals and build lasting relationships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Summit2026;
