import UpcomingEvents from "@/components/UpcomingEvents";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap, Lock, Ticket } from "lucide-react";
import miroBoard from "@/assets/miro-collaboration.png";

/* Variant 1 — Editorial: Literata serif, teal accent (#61C4D8), asymmetric layout. Logo palette: #61C4D8, #A291B9, #FCDD2A, #090907 */

const STATS = [
  { value: "9,000+", label: "Members" },
  { value: "250+", label: "Events Per Year" },
  { value: "8+ Years", label: "Strong" },
];

const IndexV1 = () => (
  <main id="main">
        <section className="relative min-h-[75vh] flex items-center bg-[#faf9f7] px-4 py-20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#090907] leading-[1.15] mb-6" style={{ fontFamily: "'Literata', serif" }}>
                  The Future of UX is Human. We're Here to Prove It.
                </h1>
                <p className="text-lg text-[#4a4947] mb-8 max-w-xl">
                  Don't let AI define you. Define it. Join <strong className="text-[#090907]">9,000+ designers</strong> building the future—together.
                </p>
                <div className="flex flex-wrap gap-4 mb-10">
                  {STATS.map((s, i) => (
                    <div key={i} className="pr-8 border-r border-[#090907]/10 last:border-0 last:pr-0">
                      <div className="text-2xl font-semibold text-[#090907]">{s.value}</div>
                      <div className="text-sm text-[#6b6a68]">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-[#61C4D8] text-white hover:bg-[#52b0c2] border-0 text-base px-8 rounded-sm" asChild>
                    <a href="https://www.skool.com/ux-support-group-6932/about" target="_blank" rel="noopener noreferrer">
                      Join Accelerator
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-[#090907]/20 text-[#090907] hover:bg-[#090907]/5 rounded-sm" asChild>
                    <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">
                      Browse Events
                    </a>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block aspect-square max-w-md ml-auto bg-[#e8e6e3] rounded-sm" aria-hidden />
            </div>
          </div>
        </section>

        <section className="py-20 bg-white border-t border-[#090907]/08">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-semibold text-[#090907] mb-2 text-center" style={{ fontFamily: "'Literata', serif" }}>
              Two Ways to Grow
            </h2>
            <p className="text-lg text-[#6b6a68] text-center mb-14">
              Choose the environment that matches your current goal.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border border-[#090907]/10 rounded-sm shadow-none overflow-hidden">
                <div className="h-1 w-full bg-[#61C4D8]" />
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-semibold text-[#090907]" style={{ fontFamily: "'Literata', serif" }}>The Sandbox</h3>
                    <span className="text-xs font-semibold text-[#61C4D8] uppercase tracking-wide">Open to all</span>
                  </div>
                  <p className="text-[#6b6a68] italic mb-6">"I want to explore, play, and see what's possible."</p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3">
                      <Check className="w-5 h-5 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                      <span className="text-[#4a4947]"><strong className="text-[#090907]">For the Curious:</strong> Low-stakes sessions to test new tools and bold ideas.</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="w-5 h-5 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                      <span className="text-[#4a4947]"><strong className="text-[#090907]">Permission to Play:</strong> Ask "what if?" without fear of failure.</span>
                    </li>
                    <li className="flex gap-3">
                      <Ticket className="w-5 h-5 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                      <span className="text-[#4a4947]"><strong className="text-[#090907]">Pay Per Event:</strong> A small ticket price ensures everyone is present and engaged.</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full rounded-sm border-[#090907]/20" asChild>
                    <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">Browse Events</a>
                  </Button>
                </div>
              </Card>
              <Card className="border border-[#090907] rounded-sm shadow-none overflow-hidden bg-[#090907] text-white">
                <div className="h-1 w-full bg-[#FCDD2A]" />
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-semibold" style={{ fontFamily: "'Literata', serif" }}>The Accelerator</h3>
                    <span className="text-xs font-semibold text-[#FCDD2A] uppercase tracking-wide">Members only</span>
                  </div>
                  <p className="text-white/80 italic mb-6">"I want to stop watching and start leading."</p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3">
                      <Zap className="w-5 h-5 text-[#FCDD2A] flex-shrink-0 mt-0.5" />
                      <span className="text-white/85"><strong>For the Builders:</strong> 20+ monthly labs, masterminds, and implementation sprints.</span>
                    </li>
                    <li className="flex gap-3">
                      <Zap className="w-5 h-5 text-[#FCDD2A] flex-shrink-0 mt-0.5" />
                      <span className="text-white/85"><strong>The Leadership Track:</strong> Don't just attend sessions—facilitate them.</span>
                    </li>
                    <li className="flex gap-3">
                      <Lock className="w-5 h-5 text-[#FCDD2A] flex-shrink-0 mt-0.5" />
                      <span className="text-white/85"><strong>Membership Commitment:</strong> For professionals with skin in the game.</span>
                    </li>
                  </ul>
                  <Button className="w-full rounded-sm bg-white text-[#090907] hover:bg-white/90" asChild>
                    <a href="https://www.skool.com/ux-support-group-6932/about" target="_blank" rel="noopener noreferrer">Join Accelerator</a>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#faf9f7]">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-semibold text-[#090907] mb-6" style={{ fontFamily: "'Literata', serif" }}>
                  We Are Not a Lecture Hall.
                </h2>
                <p className="text-lg text-[#4a4947] mb-8">
                  Most communities are places to passively consume content. You watch a webinar, take notes, and go back to work.
                  <br /><br />
                  <strong className="text-[#090907]">UXSG is a workspace.</strong>
                </p>
                <div className="space-y-6">
                  {[
                    { num: "1", title: "Human-First, AI-Empowered", body: "We operate on a simple equation: Human Ingenuity + AI > AI alone. We use tools to amplify empathy, not replace it." },
                    { num: "2", title: "Active Construction", body: "We don't just talk about the future; we open our laptops and build it. Every session ends with output." },
                    { num: "3", title: "Community Intelligence", body: "Our formats are designed by veterans, but the breakthroughs come from you. We are smarter together." },
                  ].map((item) => (
                    <div key={item.num} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-[#61C4D8]/15 flex items-center justify-center text-[#61C4D8] font-semibold">
                        {item.num}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#090907] mb-1">{item.title}</h4>
                        <p className="text-[#4a4947] text-sm">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="rounded-sm overflow-hidden border border-[#090907]/10 shadow-lg aspect-video">
                  <img src={miroBoard} alt="UXSG community collaboration board" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <UpcomingEvents />
      </main>
);

export default IndexV1;
