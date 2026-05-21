import DannyS from "@/assets/Summit2026-DannyS.png";
import SuyenL from "@/assets/Summit2026-SuyenL.png";
import SilviaB from "@/assets/Summit2026-SilviaB.png";
import VolkanU from "@/assets/Summit2026-VolkanU.png";
import RenataR from "@/assets/Summit2026-RenataR.png";
import AlexisB from "@/assets/Summit2026-AlexisB.png";
import CoreyM from "@/assets/CoreyM-2.png";
import EstherGJ from "@/assets/Summit2026-EstherGJ.png";
import type { SummitFacilitatorModalSpeaker } from "@/components/sketchy/Summit2026FacilitatorModal";
// Imports below are unused while session info is hidden pre-event; re-add when restoring sessions
// in buildSummitFacilitatorModalSpeaker:
//   import {
//     DAY1_DATE_LABEL,
//     DAY2_DATE_LABEL,
//     SUMMIT_TIME_SUFFIX,
//     getPrimaryFacilitatorSessions,
//   } from "@/data/summit2026Agenda";

/** Agenda-aligned order: Day 1 appearance, then Day 2 (see Summit2026V1 agenda). */
export type Summit2026FacilitatorEntry = {
  name: string;
  title: string;
  company: string | null;
  /** Bio paragraphs shown in the modal. */
  bioParagraphs: string[];
  linkedin: string;
  /** Omit for placeholder avatar (initials). */
  image?: string;
  /** AI tools the facilitator currently uses. */
  favAITools: string[];
  /** AI tools the facilitator wants to try next. */
  tryNextTools: string[];
  /** If true, render a "Keynote Speaker" callout on the card and modal. */
  keynote?: boolean;
  /** Session titles to omit from this facilitator's card/modal (e.g. their keynote). */
  excludeSessionTitles?: string[];
};

export function formatSummitFacilitatorRoleLine(title: string, company: string | null): string {
  if (company) return `${title} @ ${company}`.toUpperCase();
  return title.toUpperCase();
}

export const SUMMIT_2026_FACILITATORS: Summit2026FacilitatorEntry[] = [
  {
    name: "Suyen Stevenson",
    title: "UX Designer, AI Practitioner, Hackathon Junkie",
    company: null,
    bioParagraphs: [
      "Creative and analytical designer with a strong track record in UX design, digital product development, and product ops. Conference moderator skilled at engaging audiences and facilitating meaningful discussions. Brings over a decade of experience in visual design.",
      "Former: Revlon, LLNS, AFCEA Ace, First Responders Childrens Foundation, TASH.",
    ],
    linkedin: "https://www.linkedin.com/in/suyenlyn/",
    image: SuyenL,
    favAITools: ["Claude", "Gemini", "NotebookLM"],
    tryNextTools: ["Claude Design"],
  },
  {
    name: "Danny Setiawan",
    title: "Founder UXSG, Co-Create Consulting",
    company: null,
    bioParagraphs: [
      "Danny is a UX leader and AI educator who has shipped product innovation for global brands including Yahoo!, The Economist, Disney, Sony, and Men's Warehouse. He founded UX Support Group, a community of 8,800+ designers across the world building the future of human-centered AI.",
      "Through Co-Create Consulting, he partners with product and design teams to translate emerging AI capabilities into practical, ethical workflows — coaching designers from \"AI-curious\" to \"AI-fluent\" through hands-on labs, agent design, and structured critique.",
    ],
    linkedin: "https://www.linkedin.com/in/dnystwn/",
    image: DannyS,
    favAITools: ["Claude Cowork", "Cursor"],
    tryNextTools: ["Claude Design"],
    keynote: true,
    excludeSessionTitles: ["Keynote: Designer's New Mandate"],
  },
  {
    name: "Silvia Balu",
    title: "UX Designer shaping human-centered AI experiences | Community Lead",
    company: null,
    bioParagraphs: [
      "Designing AI experiences people can understand and trust.",
      "I work at the intersection of UX, psychology, and AI, helping teams design systems that are transparent, usable, and in human control.",
      "Community Lead at IxDF and UX Support Group, bringing together designers shaping the future of AI.",
    ],
    linkedin: "https://www.linkedin.com/in/silviabalu/",
    image: SilviaB,
    favAITools: [
      "ChatGPT",
      "Lovable",
      "Suno",
      "Bolt",
      "Replit",
      "Descript",
      "Gamma",
      "Eleven Labs",
    ],
    tryNextTools: ["Granola"],
  },
  {
    name: "Esther Greenfield-Jakar",
    title: "Product Design Lead & AI Generalist",
    company: null,
    bioParagraphs: [
      "Esther Greenfield Jakar is a multidisciplinary Product Designer and AI Generalist with over 10 years of experience leading cross-functional teams and using AI to improve workflows. Esther builds intuitive end-to-end digital experiences for startups, nonprofits, and complex SaaS platforms.",
      "She is recognized for her ability to streamline decision-making and unlock new possibilities in product development through agentic workflows that transform raw input into diverse, high-fidelity materials and knowledge.",
    ],
    linkedin: "https://www.linkedin.com/in/esther-g-j/",
    image: EstherGJ,
    favAITools: ["Gemini", "ChatGPT", "Claude"],
    tryNextTools: ["Opal"],
  },
  {
    name: "Corey Malone",
    title: "Sr Product Designer, Fintech/Enterprise",
    company: null,
    bioParagraphs: [
      "I'm a Senior Product Designer working at the intersection of AI systems and human experience. I've been coding since I was 12, which wired me early for algorithmic thinking, and that foundation is what drew me to agentic AI design.",
      "With 9 years of experience across fintech and enterprise tools, I've spent my career in complex systems — and AI is the most complex system I've ever designed for. Right now I'm designing agentic experiences using an end-to-end AI-integrated process: from product strategy and AI capability scoping to UX design. For example, I recently redesigned an enterprise multi-channel marketing experience that hit 90% task completion and an 8.5/10 user rating.",
      "While product teams are often focused on what to build, I'm equally focused on what not to build — and with AI, that instinct has never mattered more.",
    ],
    linkedin: "https://www.linkedin.com/in/coreymalone/",
    image: CoreyM,
    favAITools: ["Claude Code", "Perplexity", "Subframe", "Figma Make"],
    tryNextTools: ["Claude Design"],
  },
  {
    name: "Volkan Unsal",
    title: "Senior Software Engineer @ Scale AI",
    company: null,
    bioParagraphs: [
      "Expert in cloud technology, civic tech, and startup development.",
      "Former: Senior Front End Engineer, Amazon Web Services (AWS); Co-Founder, Citiesense; Code for America.",
    ],
    linkedin: "https://www.linkedin.com/in/volkanunsal/",
    image: VolkanU,
    favAITools: ["Claude Code"],
    tryNextTools: ["Claude Design"],
  },
  {
    name: "Renata Rocha",
    title: "Senior UX Designer",
    company: null,
    bioParagraphs: [
      "UX and product design leader specializing in digital financial services and e-commerce. Renata drives design for Amazon's payments platform and has led teams at JPMorgan Chase, impacting customer experience for millions.",
      "She has delivered over 600 websites, shaped major initiatives for Fortune 500s and Globo affiliates, and helped train the next generation of designers in academia.",
    ],
    linkedin: "https://www.linkedin.com/in/rerocha/",
    image: RenataR,
    favAITools: ["Claude", "Perplexity"],
    tryNextTools: ["Claude Design"],
  },
  {
    name: "Alexis Brochu",
    title: "Principal, AI Product Strategist",
    company: "Alexis Design",
    bioParagraphs: [
      "Alexis Brochu is a UX Product Manager and AI Enablement Specialist with 20+ years of experience, PMP and Prosci CMP certified. She chairs Strategic AI Enablement for the New Hampshire Tech Alliance AI Task Force, co-hosts UXSG's weekly AIxUX meetup, and of course, she loves teaching designers how they can automate their processes.",
    ],
    linkedin: "https://www.linkedin.com/in/alexisbrochu/",
    image: AlexisB,
    favAITools: [
      "Claude (Cowork, Code, Design)",
      "Figma",
      "FigJam",
      "Google NotebookLM",
      "Gemini",
      "Notion",
    ],
    tryNextTools: ["Open Claw"],
  },
  {
    name: "Maria Teresa (MT) Ramos",
    title: "UX Strategist, Systems Thinker, Problem Archaeologist",
    company: null,
    bioParagraphs: [
      "Staff product designer and founder of Mater Design and Technology, a boutique AI-native design and technology consultancy. Fifteen years of product design leadership across healthcare, financial services, insurance, and government. Thinks in systems, prototypes in code, and writes about turning messy enterprise workflows into products people actually want to use. Obsessed with finding the real problem before solving the wrong one well.",
      "Former: S&P Global, New York Life Insurance, Conductor, Muck Rack, StrataPT.",
    ],
    linkedin: "https://www.linkedin.com/in/mtramos/",
    favAITools: ["Claude", "Perplexity", "NotebookLM"],
    tryNextTools: ["Unicorn Studio"],
  },
];

/**
 * Build the modal speaker object for a facilitator by combining their static
 * profile with agenda-derived sessions.
 */
export function buildSummitFacilitatorModalSpeaker(
  facilitator: Summit2026FacilitatorEntry,
): SummitFacilitatorModalSpeaker {
  // Workshop/session info intentionally hidden pre-event. To restore, swap `sessions` for:
  //   getPrimaryFacilitatorSessions(facilitator.name, facilitator.excludeSessionTitles).map((s) => ({
  //     day: s.dayLabel === "Day 1" ? DAY1_DATE_LABEL : DAY2_DATE_LABEL,
  //     time: `${s.time} ${SUMMIT_TIME_SUFFIX}`,
  //     title: s.title,
  //   }))
  const sessions: SummitFacilitatorModalSpeaker["sessions"] = [];
  return {
    name: facilitator.name,
    tagline: formatSummitFacilitatorRoleLine(facilitator.title, facilitator.company),
    bio: facilitator.bioParagraphs,
    photo: facilitator.image,
    linkedinUrl: facilitator.linkedin,
    sessions,
    favAITools: facilitator.favAITools,
    tryNextTools: facilitator.tryNextTools,
    keynote: facilitator.keynote,
  };
}
