import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AgendaSection = () => {
  const sessions = [
    { time: "9:00 AM", title: "Welcome & AI-Profile Creation", facilitator: "Suyen Stevenson", desc: "Attendees build profiles (LinkedIn import/guided Q&A); submit goals/questions" },
    { time: "9:15 AM", title: "Keynote: The Future of AI & UX", facilitator: "Danny Setiawan", desc: "Inspirational opening, live poll on AI priorities" },
    { time: "10:00 AM", title: "Express Yourself with AI", facilitator: "Silvia Balu", desc: "Hands-on: Create a song with Suno; add artifact to profile" },
    { time: "10:45 AM", title: "Live Design Challenge: AI in Action", facilitator: "3–5 designers", desc: "Designers tackle surprise prompt live using AI tools; audience Q&A and voting" },
    { time: "11:45 AM", title: "Why Executives Don't Care About Your Design Work (And How to Fix It)", facilitator: "Alexis Brochu", desc: "Your design is excellent. Your stakeholders are confused. Learn the \"So What?\" Chain—a questioning technique that reveals whether your work truly connects to business outcomes or just stops at user satisfaction. Through hands-on practice, you'll learn to answer the question every executive is silently asking: \"Why should I fund this?\"" },
    { time: "12:45 PM", title: "Lunch & Sponsor Demos", facilitator: "Danny Setiawan", desc: "45-min lunch break with optional sponsor demo sessions—explore AI tools and products from our featured partners" },
    { time: "1:30 PM", title: "Learning to Learn with AI", facilitator: "Volkan Unsal", desc: "Skill-building: AI research and learning strategies" },
    { time: "2:30 PM", title: "Community AMA & Teach-Back Collaborative Challenge", facilitator: "Suyen Stevenson", desc: "Collaborative Q&A and teach-back challenge where attendees apply new research/action skills and teach back what they've learned using AI tools" },
    { time: "3:30 PM", title: "AI Learning & Development Roadmap", facilitator: "Renata Rocha", desc: "Reflective: Build a 6-month personal L&D/action plan with AI" },
    { time: "4:30 PM", title: "AI-Powered Networking", facilitator: "Caitlyn Brady", desc: "Matchmaking based on artifacts, interests, questions" },
    { time: "5:00 PM", title: "Break the AI—Chaos Challenge", facilitator: "Carissa Sinclair", desc: "Teams compete to create wild/absurd AI outputs; audience voting" },
    { time: "5:45 PM", title: "Closing & Next Steps", facilitator: "Suyen Stevenson", desc: "Recap, announce winners, community wrap-up, future plans" },
  ];

  return (
    <section className="py-24 bg-gradient-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Agenda</span> at a Glance
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
                  className="border border-border rounded-xl overflow-hidden hover:border-primary hover:shadow-[0_0_20px_rgba(251,146,60,0.4)] transition-all duration-300"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-4 text-left">
                      <span className="text-foreground font-bold text-lg shrink-0">
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
