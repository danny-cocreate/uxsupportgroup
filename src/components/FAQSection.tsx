import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "What time zone was the event?",
      answer: "All sessions were scheduled in Eastern Standard Time (EST/New York)."
    },
    {
      question: "What platform was the summit on?",
      answer: "The summit was hosted on Zoom. Attendees received their unique Zoom link and a quick-start guide via email before the event."
    },
    {
      question: "What AI tools were used?",
      answer: "We worked with a variety of AI tools including Suno, ChatGPT, Midjourney, and others. The workshops were designed for all skill levels."
    },
    {
      question: "Are recordings available?",
      answer: "Key sessions were recorded and made available exclusively to attendees. If you attended and need access, please contact us."
    }
  ];

  return (
    <section className="py-24 bg-gradient-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Got <span className="text-gradient">Questions?</span>
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`faq-${index}`} 
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline text-left">
                  <span className="font-bold text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;