import UpcomingEvents from "@/components/UpcomingEvents";
import { Check, Zap, Lock, Ticket } from "lucide-react";
import miroBoard from "@/assets/miro-collaboration.png";

/* V6 — PLAYFUL / EXPERIMENTAL: Syne bold, color blocks, slight tilt, rounded blobs, sticky-note feel. Human creativity = playful & bold. */

const STATS = [
  { value: "9,000+", label: "Members" },
  { value: "250+", label: "Events / year" },
  { value: "8+", label: "Years strong" },
];

const IndexV6 = () => (
  <main id="main">
        {/* Hero — stacked color blocks, headline in teal blob */}
        <section className="relative px-4 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="bg-[#61C4D8] rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 lg:p-16 transform md:-rotate-1 shadow-xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#090907] leading-tight mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                  The Future of UX is Human.
                </h1>
                <p className="text-2xl md:text-3xl font-bold text-[#090907]/80" style={{ fontFamily: "'Syne', sans-serif" }}>
                  We're here to prove it.
                </p>
              </div>
              <div className="absolute -top-4 -right-4 md:top-8 md:right-8 w-24 h-24 md:w-32 md:h-32 bg-[#FCDD2A] rounded-full opacity-90 transform rotate-12" aria-hidden />
              <div className="absolute -bottom-2 left-8 md:left-16 w-16 h-16 md:w-20 md:h-20 bg-[#A291B9] rounded-full opacity-80 transform -rotate-6" aria-hidden />
            </div>
            <p className="text-[#090907]/80 text-lg mt-10 max-w-xl">
              Don't let AI define you. Define it. Join <strong className="text-[#090907]">9,000+ designers</strong> building the future—together.
            </p>
            <div className="flex flex-wrap gap-6 mt-10">
              {STATS.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl px-6 py-4 shadow-md border-2 border-[#090907]/5">
                  <div className="text-2xl md:text-3xl font-bold text-[#090907]">{s.value}</div>
                  <div className="text-sm font-medium text-[#090907]/60">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-10">
              <a href="https://www.skool.com/ux-support-group-6932/about" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-[#090907] text-white font-bold px-8 py-4 rounded-2xl hover:bg-[#090907]/90 transition-colors shadow-lg">
                Join Accelerator
              </a>
              <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-[#A291B9] text-white font-bold px-8 py-4 rounded-2xl hover:bg-[#A291B9]/90 transition-colors shadow-lg">
                Browse Events
              </a>
            </div>
          </div>
        </section>

        {/* Two Ways — two big tilted cards */}
        <section className="py-20 md:py-28 bg-[#f0edf5]">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#090907] mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              Two Ways to Grow
            </h2>
            <p className="text-[#090907]/70 text-lg mb-16">
              Choose the environment that matches your current goal.
            </p>
            <div className="grid md:grid-cols-2 gap-10 md:gap-12">
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border-4 border-[#61C4D8]/30 transform hover:rotate-1 transition-transform">
                <div className="inline-block bg-[#61C4D8]/20 text-[#090907] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full mb-6">
                  Open to all
                </div>
                <h3 className="text-2xl font-bold text-[#090907] mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>The Sandbox</h3>
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
                <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer" className="inline-block w-full text-center bg-[#61C4D8] text-white font-bold py-4 rounded-2xl hover:bg-[#52b0c2] transition-colors">
                  Browse Events
                </a>
              </div>
              <div className="bg-[#A291B9] rounded-3xl p-8 md:p-10 shadow-xl border-4 border-[#090907]/10 transform hover:-rotate-1 transition-transform text-white">
                <div className="inline-block bg-[#FCDD2A] text-[#090907] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full mb-6">
                  Members only
                </div>
                <h3 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>The Accelerator</h3>
                <p className="text-white/90 italic mb-6">"I want to stop watching and start leading."</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex gap-3">
                    <Zap className="w-5 h-5 text-[#FCDD2A] flex-shrink-0 mt-0.5" />
                    <span className="text-white/95"><strong>For the Builders:</strong> 20+ monthly labs, masterminds, and implementation sprints.</span>
                  </li>
                  <li className="flex gap-3">
                    <Zap className="w-5 h-5 text-[#FCDD2A] flex-shrink-0 mt-0.5" />
                    <span className="text-white/95"><strong>The Leadership Track:</strong> Don't just attend—facilitate them.</span>
                  </li>
                  <li className="flex gap-3">
                    <Lock className="w-5 h-5 text-[#FCDD2A] flex-shrink-0 mt-0.5" />
                    <span className="text-white/95"><strong>Membership Commitment:</strong> For professionals with skin in the game.</span>
                  </li>
                </ul>
                <a href="https://www.skool.com/ux-support-group-6932/about" target="_blank" rel="noopener noreferrer" className="inline-block w-full text-center bg-[#FCDD2A] text-[#090907] font-bold py-4 rounded-2xl hover:bg-[#e6c726] transition-colors">
                  Join Accelerator
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy — mauve band + image with sticky-note style list */}
        <section className="py-20 md:py-28 bg-[#A291B9]/20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#090907] mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
                  We Are Not a Lecture Hall.
                </h2>
                <p className="text-[#090907]/80 text-lg mb-10">
                  Most communities are places to passively consume content. <strong className="text-[#090907]">UXSG is a workspace.</strong>
                </p>
                <div className="space-y-4">
                  {[
                    { title: "Human-First, AI-Empowered", body: "Human Ingenuity + AI > AI alone. We use tools to amplify empathy, not replace it." },
                    { title: "Active Construction", body: "We open our laptops and build it. Every session ends with output." },
                    { title: "Community Intelligence", body: "The breakthroughs come from you. We are smarter together." },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-lg border-2 border-[#090907]/5 transform hover:rotate-0.5 transition-transform">
                      <h4 className="font-bold text-[#090907] mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{item.title}</h4>
                      <p className="text-[#090907]/75 text-sm">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2">
                  <img src={miroBoard} alt="UXSG community collaboration board" className="w-full aspect-video object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#FCDD2A] rounded-2xl transform -rotate-6 opacity-90" aria-hidden />
              </div>
            </div>
          </div>
        </section>

        <UpcomingEvents />
      </main>
);

export default IndexV6;
