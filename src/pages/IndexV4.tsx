import UpcomingEvents from "@/components/UpcomingEvents";
import { Button } from "@/components/ui/button";
import { Check, Zap, Lock, Ticket } from "lucide-react";
import miroBoard from "@/assets/miro-collaboration.png";

/* V4 — BRUTALIST: Bebas Neue, stark black/white/yellow blocks, full-bleed sections, massive type, raw. Human creativity = bold, unapologetic. */

const STATS = [
  { value: "9,000+", label: "Members" },
  { value: "250+", label: "Events Per Year" },
  { value: "8+", label: "Years Strong" },
];

const IndexV4 = () => (
  <main id="main">
        {/* Hero — full viewport black, yellow accent */}
        <section className="min-h-[90vh] flex flex-col justify-center bg-[#090907] px-4 py-20 md:py-32">
          <div className="max-w-5xl mx-auto w-full">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white uppercase leading-[0.95] mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              The Future of UX<br />is Human.
            </h1>
            <p className="text-2xl md:text-3xl font-normal text-[#FCDD2A] uppercase tracking-widest mb-12" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              We're here to prove it.
            </p>
            <p className="text-white/80 text-lg max-w-xl mb-14 font-sans">
              Don't let AI define you. Define it. Join <strong className="text-white">9,000+ designers</strong> building the future—together.
            </p>
            <div className="flex flex-wrap gap-12 mb-14">
              {STATS.map((s, i) => (
                <div key={i}>
                  <div className="text-5xl md:text-6xl font-normal text-[#FCDD2A]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{s.value}</div>
                  <div className="text-sm text-white/60 uppercase tracking-widest mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://www.skool.com/ux-support-group-6932/about" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-[#FCDD2A] text-[#090907] font-bold px-10 py-4 text-lg uppercase tracking-widest hover:bg-[#e6c726] transition-colors">
                Join Accelerator
              </a>
              <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center border-2 border-white text-white font-bold px-10 py-4 text-lg uppercase tracking-widest hover:bg-white hover:text-[#090907] transition-colors">
                Browse Events
              </a>
            </div>
          </div>
        </section>

        {/* Two Ways — full-width yellow band then two stark columns */}
        <section className="bg-[#FCDD2A] py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-normal text-[#090907] uppercase tracking-tight mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Two Ways to Grow
            </h2>
            <p className="text-[#090907]/80 text-lg mb-16 max-w-xl">
              Choose the environment that matches your current goal.
            </p>
            <div className="grid md:grid-cols-2 gap-0 md:gap-8">
              <div className="bg-white p-8 md:p-10 border-4 border-[#090907]">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl md:text-3xl font-normal text-[#090907] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>The Sandbox</h3>
                  <span className="text-xs font-bold text-[#61C4D8] bg-[#61C4D8]/20 px-3 py-1 uppercase tracking-widest">Open to all</span>
                </div>
                <p className="text-[#090907]/80 italic mb-6">"I want to explore, play, and see what's possible."</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex gap-3">
                    <Check className="w-5 h-5 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                    <span className="text-[#090907]/90"><strong>For the Curious:</strong> Low-stakes sessions to test new tools and bold ideas.</span>
                  </li>
                  <li className="flex gap-3">
                    <Check className="w-5 h-5 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                    <span className="text-[#090907]/90"><strong>Permission to Play:</strong> Ask "what if?" without fear of failure.</span>
                  </li>
                  <li className="flex gap-3">
                    <Ticket className="w-5 h-5 text-[#61C4D8] flex-shrink-0 mt-0.5" />
                    <span className="text-[#090907]/90"><strong>Pay Per Event:</strong> A small ticket price ensures everyone is present and engaged.</span>
                  </li>
                </ul>
                <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer" className="inline-block w-full text-center bg-[#090907] text-white font-bold py-4 uppercase tracking-widest hover:bg-[#090907]/90 transition-colors">
                  Browse Events
                </a>
              </div>
              <div className="bg-[#090907] text-white p-8 md:p-10 border-4 border-[#090907] mt-6 md:mt-0">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl md:text-3xl font-normal uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>The Accelerator</h3>
                  <span className="text-xs font-bold text-[#090907] bg-[#FCDD2A] px-3 py-1 uppercase tracking-widest">Members only</span>
                </div>
                <p className="text-white/80 italic mb-6">"I want to stop watching and start leading."</p>
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
                <a href="https://www.skool.com/ux-support-group-6932/about" target="_blank" rel="noopener noreferrer" className="inline-block w-full text-center bg-[#FCDD2A] text-[#090907] font-bold py-4 uppercase tracking-widest hover:bg-[#e6c726] transition-colors">
                  Join Accelerator
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy — white with big numbers, image full-bleed right */}
        <section className="bg-white py-20 md:py-28 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
              <div>
                <h2 className="text-4xl md:text-6xl font-normal text-[#090907] uppercase tracking-tight mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  We Are Not a Lecture Hall.
                </h2>
                <p className="text-lg text-[#090907]/80 mb-10">
                  Most communities are places to passively consume content. You watch a webinar, take notes, and go back to work.
                  <br /><br />
                  <strong className="text-[#090907]">UXSG is a workspace.</strong>
                </p>
                <div className="space-y-8">
                  {[
                    { num: "01", title: "Human-First, AI-Empowered", body: "Human Ingenuity + AI > AI alone. We use tools to amplify empathy, not replace it." },
                    { num: "02", title: "Active Construction", body: "We open our laptops and build it. Every session ends with output." },
                    { num: "03", title: "Community Intelligence", body: "The breakthroughs come from you. We are smarter together." },
                  ].map((item) => (
                    <div key={item.num} className="flex gap-6">
                      <span className="text-3xl md:text-4xl font-normal text-[#61C4D8]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{item.num}</span>
                      <div>
                        <h4 className="text-lg font-bold text-[#090907] mb-1 uppercase tracking-wide">{item.title}</h4>
                        <p className="text-[#090907]/75 text-sm">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative md:-mr-20">
                <div className="aspect-video md:aspect-auto md:h-full min-h-[280px] border-4 border-[#090907] overflow-hidden">
                  <img src={miroBoard} alt="UXSG community collaboration board" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <UpcomingEvents />
      </main>
);

export default IndexV4;
