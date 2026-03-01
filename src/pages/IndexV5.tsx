import UpcomingEvents from "@/components/UpcomingEvents";
import { Check, Zap, Lock, Ticket } from "lucide-react";
import miroBoard from "@/assets/miro-collaboration.png";

/* V5 — EDITORIAL MAXIMALIST: Playfair Display, magazine spread, pull quotes, overlap, asymmetric. Human creativity = editorial bold. */

const STATS = [
  { value: "9,000+", label: "Members" },
  { value: "250+", label: "Events Per Year" },
  { value: "8+ Years", label: "Strong" },
];

const IndexV5 = () => (
  <main id="main">
        {/* Hero — split: large italic pull quote left, stats + CTA right overlapping */}
        <section className="relative min-h-[85vh] flex items-center px-4 py-24 md:py-32 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-12 md:gap-16 items-end">
            <div className="md:col-span-7">
              <p className="text-4xl md:text-5xl lg:text-6xl text-[#090907] leading-[1.2] mb-4 italic">
                The Future of UX is Human.
              </p>
              <p className="text-2xl md:text-3xl text-[#A291B9] italic">
                We're here to prove it.
              </p>
            </div>
            <div className="md:col-span-5 md:pl-8">
              <p className="text-[#090907]/80 text-lg mb-8 max-w-md">
                Don't let AI define you. Define it. Join <strong className="text-[#090907]">9,000+ designers</strong> building the future—together.
              </p>
              <div className="flex gap-8 mb-10">
                {STATS.map((s, i) => (
                  <div key={i}>
                    <div className="text-3xl md:text-4xl font-semibold text-[#090907]">{s.value}</div>
                    <div className="text-sm text-[#090907]/60">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://www.skool.com/ux-support-group-6932/about" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-[#090907] text-white px-8 py-4 text-base font-medium hover:bg-[#090907]/90 transition-colors">
                  Join Accelerator
                </a>
                <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center border border-[#090907] text-[#090907] px-8 py-4 text-base hover:bg-[#090907]/5 transition-colors">
                  Browse Events
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Two Ways — asymmetric: one card large, one offset and overlapping */}
        <section className="py-24 md:py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#090907] mb-2">Two Ways to Grow</h2>
            <p className="text-[#090907]/70 text-lg mb-16 max-w-xl">
              Choose the environment that matches your current goal.
            </p>
            <div className="relative">
              <div className="grid md:grid-cols-12 gap-8">
                <div className="md:col-span-7 bg-[#faf8f5] p-10 md:p-12 border border-[#090907]/10 relative z-10">
                  <span className="text-xs font-bold text-[#61C4D8] uppercase tracking-widest">Open to all</span>
                  <h3 className="text-2xl md:text-3xl font-semibold text-[#090907] mt-2 mb-4">The Sandbox</h3>
                  <p className="text-[#090907]/80 italic mb-6">"I want to explore, play, and see what's possible."</p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3">
                      <Check className="w-5 h-5 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                      <span className="text-[#090907]/85"><strong>For the Curious:</strong> Low-stakes sessions to test new tools and bold ideas.</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="w-5 h-5 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                      <span className="text-[#090907]/85"><strong>Permission to Play:</strong> Ask "what if?" without fear of failure.</span>
                    </li>
                    <li className="flex gap-3">
                      <Ticket className="w-5 h-5 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                      <span className="text-[#090907]/85"><strong>Pay Per Event:</strong> A small ticket price ensures everyone is present and engaged.</span>
                    </li>
                  </ul>
                  <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer" className="inline-block text-[#090907] font-medium border-b-2 border-[#090907] pb-1 hover:opacity-80">
                    Browse Events →
                  </a>
                </div>
                <div className="md:col-span-5 md:-mt-16 md:mb-16 relative z-0">
                  <div className="bg-[#090907] text-white p-10 md:p-12 shadow-2xl border border-[#090907]">
                    <span className="text-xs font-bold text-[#FCDD2A] uppercase tracking-widest">Members only</span>
                    <h3 className="text-2xl md:text-3xl font-semibold mt-2 mb-4">The Accelerator</h3>
                    <p className="text-white/80 italic mb-6">"I want to stop watching and start leading."</p>
                    <ul className="space-y-4 mb-8">
                      <li className="flex gap-3">
                        <Zap className="w-5 h-5 text-[#FCDD2A] flex-shrink-0 mt-0.5" />
                        <span className="text-white/90"><strong>For the Builders:</strong> 20+ monthly labs, masterminds, and implementation sprints.</span>
                      </li>
                      <li className="flex gap-3">
                        <Zap className="w-5 h-5 text-[#FCDD2A] flex-shrink-0 mt-0.5" />
                        <span className="text-white/90"><strong>The Leadership Track:</strong> Don't just attend—facilitate.</span>
                      </li>
                      <li className="flex gap-3">
                        <Lock className="w-5 h-5 text-[#FCDD2A] flex-shrink-0 mt-0.5" />
                        <span className="text-white/90"><strong>Membership Commitment:</strong> For professionals with skin in the game.</span>
                      </li>
                    </ul>
                    <a href="https://www.skool.com/ux-support-group-6932/about" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#FCDD2A] text-[#090907] font-semibold px-8 py-3 hover:bg-[#e6c726] transition-colors">
                      Join Accelerator
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy — full-bleed image with text overlay + list beside */}
        <section className="relative bg-[#090907] min-h-[70vh] md:min-h-0">
          <div className="grid md:grid-cols-2 min-h-[600px]">
            <div className="relative order-2 md:order-1">
              <img src={miroBoard} alt="UXSG community collaboration board" className="absolute inset-0 w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-[#090907]/40" />
            </div>
            <div className="flex flex-col justify-center p-10 md:p-16 order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">We Are Not a Lecture Hall.</h2>
              <p className="text-white/90 text-lg mb-8">
                Most communities are places to passively consume content. <strong className="text-white">UXSG is a workspace.</strong>
              </p>
              <div className="space-y-6">
                {[
                  { title: "Human-First, AI-Empowered", body: "Human Ingenuity + AI > AI alone. We use tools to amplify empathy, not replace it." },
                  { title: "Active Construction", body: "We open our laptops and build it. Every session ends with output." },
                  { title: "Community Intelligence", body: "The breakthroughs come from you. We are smarter together." },
                ].map((item, i) => (
                  <div key={i} className="border-l-4 border-[#FCDD2A] pl-4">
                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-white/80 text-sm">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <UpcomingEvents />
      </main>
);

export default IndexV5;
