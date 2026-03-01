import UpcomingEvents from "@/components/UpcomingEvents";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap, Lock, Ticket } from "lucide-react";
import miroBoard from "@/assets/miro-collaboration.png";

/* Variant 3 — Confident minimal: Sora, high contrast black (#090907) + white, teal (#61C4D8) accent. Sharp grid, one primary CTA. */

const STATS = [
  { value: "9,000+", label: "Members" },
  { value: "250+", label: "Events Per Year" },
  { value: "8+ Years", label: "Strong" },
];

const IndexV3 = () => (
  <main id="main">
        <section className="relative min-h-[80vh] flex items-center border-b border-[#090907]/10 bg-white">
          <div className="container mx-auto max-w-6xl px-4 py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#090907] leading-[1.1] tracking-tight mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
                The Future of UX is Human.
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#61C4D8] mb-8">
                We're Here to Prove It.
              </h2>
              <p className="text-lg text-[#090907]/70 mb-10 max-w-xl">
                Don't let AI define you. Define it. Join <strong className="text-[#090907]">9,000+ designers</strong> building the future—together.
              </p>
              <div className="grid grid-cols-3 gap-8 mb-12">
                {STATS.map((s, i) => (
                  <div key={i}>
                    <div className="text-3xl md:text-4xl font-bold text-[#090907]">{s.value}</div>
                    <div className="text-sm font-medium text-[#090907]/60 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-[#090907] text-white hover:bg-[#090907]/90 rounded-md font-semibold" asChild>
                  <a href="https://www.skool.com/ux-support-group-6932/about" target="_blank" rel="noopener noreferrer">
                    Join Accelerator
                  </a>
                </Button>
                <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[#61C4D8] font-medium hover:underline">
                  Browse Events →
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#f8f8f8] border-b border-[#090907]/08">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-[#090907] mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
              Two Ways to Grow
            </h2>
            <p className="text-[#090907]/60 mb-14">
              Choose the environment that matches your current goal.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-md border border-[#090907]/10 bg-white shadow-none overflow-hidden">
                <div className="h-1 w-24 bg-[#61C4D8]" />
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-[#090907]" style={{ fontFamily: "'Sora', sans-serif" }}>The Sandbox</h3>
                    <span className="text-[10px] font-bold text-[#090907]/60 uppercase tracking-widest">Open to all</span>
                  </div>
                  <p className="text-sm text-[#090907]/70 italic mb-6">"I want to explore, play, and see what's possible."</p>
                  <ul className="space-y-3 mb-8 text-sm">
                    <li className="flex gap-3">
                      <Check className="w-4 h-4 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                      <span className="text-[#090907]/80"><strong className="text-[#090907]">For the Curious:</strong> Low-stakes sessions to test new tools and bold ideas.</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="w-4 h-4 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                      <span className="text-[#090907]/80"><strong className="text-[#090907]">Permission to Play:</strong> Ask "what if?" without fear of failure.</span>
                    </li>
                    <li className="flex gap-3">
                      <Ticket className="w-4 h-4 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                      <span className="text-[#090907]/80"><strong className="text-[#090907]">Pay Per Event:</strong> A small ticket price ensures everyone is present and engaged.</span>
                    </li>
                  </ul>
                  <Button variant="outline" size="sm" className="w-full rounded-md border-[#090907]/20" asChild>
                    <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">Browse Events</a>
                  </Button>
                </div>
              </Card>
              <Card className="rounded-md border-2 border-[#090907] bg-[#090907] text-white shadow-none overflow-hidden">
                <div className="h-1 w-24 bg-[#61C4D8]" />
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>The Accelerator</h3>
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Members only</span>
                  </div>
                  <p className="text-sm text-white/80 italic mb-6">"I want to stop watching and start leading."</p>
                  <ul className="space-y-3 mb-8 text-sm">
                    <li className="flex gap-3">
                      <Zap className="w-4 h-4 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                      <span className="text-white/85"><strong>For the Builders:</strong> 20+ monthly labs, masterminds, and implementation sprints.</span>
                    </li>
                    <li className="flex gap-3">
                      <Zap className="w-4 h-4 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                      <span className="text-white/85"><strong>The Leadership Track:</strong> Don't just attend sessions—facilitate them.</span>
                    </li>
                    <li className="flex gap-3">
                      <Lock className="w-4 h-4 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                      <span className="text-white/85"><strong>Membership Commitment:</strong> For professionals with skin in the game.</span>
                    </li>
                  </ul>
                  <Button size="sm" className="w-full rounded-md bg-white text-[#090907] hover:bg-white/90" asChild>
                    <a href="https://www.skool.com/ux-support-group-6932/about" target="_blank" rel="noopener noreferrer">Join Accelerator</a>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#090907] mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
                  We Are Not a Lecture Hall.
                </h2>
                <p className="text-[#090907]/70 mb-8">
                  Most communities are places to passively consume content. You watch a webinar, take notes, and go back to work.
                  <br /><br />
                  <strong className="text-[#090907]">UXSG is a workspace.</strong>
                </p>
                <div className="space-y-6">
                  {[
                    { title: "Human-First, AI-Empowered", body: "We operate on a simple equation: Human Ingenuity + AI > AI alone. We use tools to amplify empathy, not replace it." },
                    { title: "Active Construction", body: "We don't just talk about the future; we open our laptops and build it. Every session ends with output." },
                    { title: "Community Intelligence", body: "Our formats are designed by veterans, but the breakthroughs come from you. We are smarter together." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 border-l-2 border-[#61C4D8] pl-4">
                      <div>
                        <h4 className="font-bold text-[#090907] mb-1 text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>{item.title}</h4>
                        <p className="text-[#090907]/70 text-sm">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md overflow-hidden border border-[#090907]/10 aspect-video">
                <img src={miroBoard} alt="UXSG community collaboration board" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <UpcomingEvents />
      </main>
);

export default IndexV3;
