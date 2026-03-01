import UpcomingEvents from "@/components/UpcomingEvents";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap, Lock, Ticket } from "lucide-react";
import miroBoard from "@/assets/miro-collaboration.png";

/* Variant 2 — Warm studio: Domine serif, cream + yellow (#FCDD2A) & mauve (#A291B9) from logo, rounded organic shapes. */

const STATS = [
  { value: "9,000+", label: "Members" },
  { value: "250+", label: "Events Per Year" },
  { value: "8+ Years", label: "Strong" },
];

const IndexV2 = () => (
  <main id="main">
        <section className="relative min-h-[75vh] flex items-center px-4 py-20 bg-[#fdf8f0]">
          <div className="container mx-auto max-w-5xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#2d2a26] leading-tight mb-6" style={{ fontFamily: "'Domine', serif" }}>
              The Future of UX is Human.<br />
              <span className="text-[#A291B9]">We're Here to Prove It.</span>
            </h1>
            <p className="text-lg text-[#5c5854] mb-10 max-w-2xl mx-auto">
              Don't let AI define you. Define it. Join <strong className="text-[#2d2a26]">9,000+ designers</strong> building the future—together.
            </p>
            <div className="inline-flex flex-wrap justify-center gap-6 mb-12 py-6 px-8 rounded-3xl bg-white/80 border border-[#A291B9]/20 shadow-sm">
              {STATS.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#A291B9]">{s.value}</div>
                  <div className="text-sm font-medium text-[#5c5854]">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-[#FCDD2A] text-[#2d2a26] hover:bg-[#e6c726] rounded-2xl text-base px-8 font-medium" asChild>
                <a href="https://www.skool.com/ux-support-group-6932/about" target="_blank" rel="noopener noreferrer">
                  Join Accelerator
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-[#A291B9]/40 text-[#2d2a26] hover:bg-[#A291B9]/10 rounded-2xl" asChild>
                <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">
                  Browse Events
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#f5efe6]">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-semibold text-[#2d2a26] mb-2 text-center" style={{ fontFamily: "'Domine', serif" }}>
              Two Ways to Grow
            </h2>
            <p className="text-lg text-[#5c5854] text-center mb-14">
              Choose the environment that matches your current goal.
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="rounded-3xl border-0 shadow-lg overflow-hidden bg-white">
                <div className="h-2 w-full bg-[#61C4D8]/30 rounded-t-3xl" />
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-semibold text-[#2d2a26]" style={{ fontFamily: "'Domine', serif" }}>The Sandbox</h3>
                    <span className="text-xs font-bold text-[#61C4D8] bg-[#61C4D8]/15 px-3 py-1.5 rounded-full">OPEN TO ALL</span>
                  </div>
                  <p className="text-[#5c5854] italic mb-6">"I want to explore, play, and see what's possible."</p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3">
                      <Check className="w-5 h-5 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                      <span className="text-[#5c5854]"><strong className="text-[#2d2a26]">For the Curious:</strong> Low-stakes sessions to test new tools and bold ideas.</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="w-5 h-5 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                      <span className="text-[#5c5854]"><strong className="text-[#2d2a26]">Permission to Play:</strong> Ask "what if?" without fear of failure.</span>
                    </li>
                    <li className="flex gap-3">
                      <Ticket className="w-5 h-5 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                      <span className="text-[#5c5854]"><strong className="text-[#2d2a26]">Pay Per Event:</strong> A small ticket price ensures everyone is present and engaged.</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full rounded-2xl border-[#A291B9]/40" asChild>
                    <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">Browse Events</a>
                  </Button>
                </div>
              </Card>
              <Card className="rounded-3xl border-0 shadow-xl overflow-hidden bg-[#A291B9] text-white md:-translate-y-2">
                <div className="h-2 w-full bg-[#FCDD2A] rounded-t-3xl" />
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-semibold" style={{ fontFamily: "'Domine', serif" }}>The Accelerator</h3>
                    <span className="text-xs font-bold text-[#2d2a26] bg-[#FCDD2A] px-3 py-1.5 rounded-full">MEMBERS ONLY</span>
                  </div>
                  <p className="text-white/90 italic mb-6">"I want to stop watching and start leading."</p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3">
                      <Zap className="w-5 h-5 text-[#FCDD2A] flex-shrink-0 mt-0.5" />
                      <span className="text-white/90"><strong>For the Builders:</strong> 20+ monthly labs, masterminds, and implementation sprints.</span>
                    </li>
                    <li className="flex gap-3">
                      <Zap className="w-5 h-5 text-[#FCDD2A] flex-shrink-0 mt-0.5" />
                      <span className="text-white/90"><strong>The Leadership Track:</strong> Don't just attend sessions—facilitate them.</span>
                    </li>
                    <li className="flex gap-3">
                      <Lock className="w-5 h-5 text-[#FCDD2A] flex-shrink-0 mt-0.5" />
                      <span className="text-white/90"><strong>Membership Commitment:</strong> For professionals with skin in the game.</span>
                    </li>
                  </ul>
                  <Button className="w-full rounded-2xl bg-[#FCDD2A] text-[#2d2a26] hover:bg-[#e6c726]" asChild>
                    <a href="https://www.skool.com/ux-support-group-6932/about" target="_blank" rel="noopener noreferrer">Join Accelerator</a>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#fdf8f0]">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-semibold text-[#2d2a26] mb-6" style={{ fontFamily: "'Domine', serif" }}>
                  We Are Not a Lecture Hall.
                </h2>
                <p className="text-lg text-[#5c5854] mb-8">
                  Most communities are places to passively consume content. You watch a webinar, take notes, and go back to work.
                  <br /><br />
                  <strong className="text-[#2d2a26]">UXSG is a workspace.</strong>
                </p>
                <div className="space-y-6">
                  {[
                    { num: "1", title: "Human-First, AI-Empowered", body: "We operate on a simple equation: Human Ingenuity + AI > AI alone. We use tools to amplify empathy, not replace it." },
                    { num: "2", title: "Active Construction", body: "We don't just talk about the future; we open our laptops and build it. Every session ends with output." },
                    { num: "3", title: "Community Intelligence", body: "Our formats are designed by veterans, but the breakthroughs come from you. We are smarter together." },
                  ].map((item) => (
                    <div key={item.num} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#A291B9]/20 flex items-center justify-center text-[#A291B9] font-bold text-lg">
                        {item.num}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2d2a26] mb-1">{item.title}</h4>
                        <p className="text-[#5c5854] text-sm">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-3 bg-[#A291B9]/10 rounded-3xl transform rotate-1" />
                <div className="relative rounded-2xl overflow-hidden border border-[#A291B9]/20 shadow-xl aspect-video">
                  <img src={miroBoard} alt="UXSG community collaboration board" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <UpcomingEvents />
      </main>
);

export default IndexV2;
