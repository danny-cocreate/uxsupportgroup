import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const FAQSection = () => {
  const faqs = [{
    question: "What's included with my ticket?",
    answer: "All tickets include full-day access to workshops, community gallery, profile highlight, and digital resources. VIP tickets include additional perks and exclusive lounge access."
  }, {
    question: "Is there a refund policy?",
    answer: "Yes, we offer full refunds up to 30 days before the event. Between 30-14 days, we offer 50% refunds. No refunds within 14 days of the event, but tickets are transferable to another attendee."
  }, {
    question: "Will there be a virtual or hybrid option?",
    answer: "This inaugural summit is designed as an in-person experience to maximize networking and collaboration. However, we're exploring hybrid options for future events based on attendee feedback."
  }, {
    question: "What's the dress code?",
    answer: "Smart casual. Come comfortable and ready to create! We're all about authentic connections and creative energy."
  }, {
    question: "What AI tools will we use?",
    answer: "We'll be working with a variety of AI tools including Suno, ChatGPT, Midjourney, and others. No prior AI experience required—our workshops are designed for all skill levels."
  }, {
    question: "Can I bring a guest?",
    answer: "Each attendee needs their own ticket as our capacity is limited to 60 people. However, we encourage teams to attend together—group discounts available for 3+ tickets."
  }, {
    question: "What should I bring?",
    answer: "Just bring yourself, your laptop, and an open mind! We'll provide everything else including notebooks, charging stations, and workshop materials."
  }, {
    question: "Will there be recordings?",
    answer: "Key sessions will be recorded and made available to attendees only. However, the real magic happens in live participation and networking!"
  }, {
    question: "How do I get to the venue?",
    answer: "Detailed venue information and directions will be sent to all ticket holders 2 weeks before the event. The venue is centrally located in NYC with easy access to public transportation."
  }];
  return <section className="py-24 bg-gradient-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Got <span className="text-gradient">Questions?</span>
            </h2>
            
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => <AccordionItem key={index} value={`faq-${index}`} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
                <AccordionTrigger className="px-6 py-4 hover:no-underline text-left">
                  <span className="font-bold text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </div>
    </section>;
};
export default FAQSection;