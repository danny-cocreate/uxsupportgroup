import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AgendaSection = () => {
  const sessions = [
    { time: "9:00 AM", title: "Welcome & AI-Profile Creation", facilitator: "Suyen", desc: "Attendees build profiles (LinkedIn import/guided Q&A); submit goals/questions" },
    { time: "9:30 AM", title: "Keynote: The Future of AI & UX", facilitator: "Danny/Ian", desc: "Inspirational opening, live poll on AI priorities" },
    { time: "10:00 AM", title: "Express Yourself with AI", facilitator: "Silvia", desc: "Hands-on: Create a song with Suno; add artifact to profile" },
    { time: "10:45 AM", title: "Live Design Challenge: AI in Action", facilitator: "3–5 designers", desc: "Designers tackle surprise prompt live using AI tools; audience Q&A and voting" },
    { time: "11:30 AM", title: "UX to Strategy—Business with AI", facilitator: "Alexis", desc: "Interactive: Use AI to analyze a product, draft a strategic business case" },
    { time: "12:15 PM", title: "Lunch & Community Gallery Tour", facilitator: "Open/Self-Guided", desc: "45-min lunch + gallery walk exploring attendee artifacts" },
    { time: "1:00 PM", title: "Agentic UX—Build Your Own Agent", facilitator: "Danny", desc: "Step-by-step creation of a personal AI agent" },
    { time: "1:45 PM", title: "Learning to Learn with AI", facilitator: "Volkan", desc: "Skill-building: AI research and learning strategies" },
    { time: "2:30 PM", title: "Community AMA: Solve the Wall", facilitator: "Suyen", desc: "Apply new research/action skills; collaborative Q&A" },
    { time: "3:15 PM", title: "Teach-Back Challenge: Learn & Share", facilitator: "Suyen", desc: "Attendees teach back what they've learned using AI tools" },
    { time: "4:00 PM", title: "Break the AI—Chaos Challenge", facilitator: "Mirrie", desc: "Teams compete to create wild/absurd AI outputs; audience voting" },
    { time: "4:45 PM", title: "AI Learning & Development Roadmap", facilitator: "Renata", desc: "Reflective: Build a 6-month personal L&D/action plan with AI" },
    { time: "5:30 PM", title: "AI-Powered Networking Finale", facilitator: "Suyen", desc: "Matchmaking based on artifacts, interests, questions" },
    { time: "6:00 PM", title: "Closing & Next Steps", facilitator: "Suyen", desc: "Recap, announce winners, community wrap-up, future plans" },
  ];

  return (
    <section className="py-24 bg-gradient-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Agenda <span className="text-gradient">at a Glance</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Workshops, co-creation labs, and surprise sessions focused on 
              practical skill-building and networking
            </p>
          </div>
          
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-xl">
            <Accordion type="single" collapsible className="space-y-4">
              {sessions.map((session, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-accent/50">
                    <div className="flex items-center gap-4 text-left">
                      <span className="text-primary font-bold text-lg shrink-0">
                        {session.time}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{session.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Facilitated by {session.facilitator}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-muted-foreground pl-24">
                      {session.desc}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;
