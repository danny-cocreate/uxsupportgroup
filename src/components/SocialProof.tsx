import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import SuyenL from "@/assets/SuyenL-2.jpeg";
import SilviaB from "@/assets/SilviaB-2.jpeg";
import AlexisB from "@/assets/AlexisB-2.png";
import VolkanU from "@/assets/VolkanU-2.jpeg";
import RenataR from "@/assets/RenataR-2.jpeg";
import DannyS from "@/assets/DannyS-2.jpeg";
import HayleyD from "@/assets/HayleyD-option2.png";
import FarooqK from "@/assets/FarooqK-3.jpg";
import FarahK from "@/assets/FarahK-2.jpeg";
import YatongW from "@/assets/YatongW-2.jpeg";
import CarissaS from "@/assets/CarissaS.jpeg";
import CaitlynB from "@/assets/CaitlynB.jpeg";
import SaraS from "@/assets/SaraS.jpeg";
import EstherJ from "@/assets/EstherJ.jpg";

interface Facilitator {
  name: string;
  title: string;
  company: string | null;
  bio: string;
  linkedin: string;
  image: string;
}

const FacilitatorCard = ({ facilitator, index }: { facilitator: Facilitator; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (bioRef.current) {
      // Check if content exceeds 4 lines by temporarily removing line-clamp
      const lineHeight = parseFloat(getComputedStyle(bioRef.current).lineHeight);
      const maxHeight = lineHeight * 4;
      const isOverflowing = bioRef.current.scrollHeight > maxHeight;
      setShowToggle(isOverflowing);
    }
  }, [facilitator.bio]);

  return (
    <Card key={index} className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-20 h-20 flex-shrink-0">
            <AvatarImage src={facilitator.image} alt={facilitator.name} className="object-cover" />
            <AvatarFallback>{facilitator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-[1.38] min-w-0">
            <h3 className="font-bold text-lg mb-1">{facilitator.name}</h3>
            <p className="text-sm text-muted-foreground mb-1">{facilitator.title}</p>
            {facilitator.company && <p className="text-sm font-semibold text-foreground">{facilitator.company}</p>}
          </div>
        </div>
        <div className="mb-3">
          <p
            ref={bioRef}
            className={cn(
              "text-sm text-muted-foreground leading-relaxed transition-all duration-300 inline",
              !isExpanded && "line-clamp-4"
            )}
          >
            {facilitator.bio}
          </p>
          {showToggle && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium inline-block"
            >
              {isExpanded ? " Less" : " More"}
            </button>
          )}
        </div>
        {facilitator.linkedin !== "#" && (
          <a 
            href={facilitator.linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            aria-label={`Visit ${facilitator.name}'s LinkedIn profile`}
          >
            LinkedIn Profile
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </CardContent>
    </Card>
  );
};

const SocialProof = () => {
  const facilitators = [{
    name: "Danny Setiawan",
    title: "Founder, Instructor",
    company: "UX Support Group",
    bio: "UX leader and AI educator with a track record delivering product innovation for global brands including Yahoo!, The Economist, Disney, Sony, and Men's Warehouse, as well as growing the community of UX professionals with over 8800 members from all over the world.",
    linkedin: "https://www.linkedin.com/in/dnystwn/",
    image: DannyS
  }, {
    name: "Suyen Stevenson",
    title: "Facilitator| UX/UI Designer | AI Generalist | Storyteller",
    company: "Yen Graphics",
    bio: "Creative and analytical designer with a strong track record in UX design, digital product development, and product ops. Conference moderator skilled at engaging audiences and facilitating meaningful discussions. Brings over a decade of experience in visual design. Former: Revlon, LLNS, AFCEA Ace, First Responders Childrens Foundation, TASH",
    linkedin: "https://www.linkedin.com/in/suyenlyn/",
    image: SuyenL
  }, {
    name: "Volkan Unsal",
    title: "Senior Frontend Engineer",
    company: "Amazon Web Services (AWS)",
    bio: "Expert in cloud technology, civic tech, and startup development. Former: Co-Founder, Citiesense; Code for America.",
    linkedin: "https://www.linkedin.com/in/volkanunsal/",
    image: VolkanU
  }, {
    name: "Alexis Brochu",
    title: "AI Product Manager & Strategist",
    company: "Alexis Design",
    bio: "Human-first product leader specializing in AI-powered transformation across design, technology, and business domains. Expertise in UX-informed product strategy and developing business acumen in technical leaders. Former: California Governor's Office of Emergency Services, Rhode Island T.F. Green International Airport, WLNE-ABC6-TV, Brown University Health Systems, Mallinckrodt Pharmaceuticals.",
    linkedin: "https://www.linkedin.com/in/alexisbrochu/",
    image: AlexisB
  }, {
    name: "Renata Rocha",
    title: "Senior UX Designer",
    company: "Amazon",
    bio: "UX and product design leader specializing in digital financial services and e-commerce. Renata drives design for Amazon's payments platform and has led teams at JPMorgan Chase, impacting customer experience for millions. She has delivered over 600 websites, shaped major initiatives for Fortune 500s and Globo affiliates, and helped train the next generation of designers in academia.",
    linkedin: "https://www.linkedin.com/in/rerocha/",
    image: RenataR
  }, {
    name: "Silvia Balu",
    title: "UX/UI Designer | International UX & AI Community Lead",
    company: null,
    bio: "Recognized for innovation in design research and for bridging psychology, user experience, and AI to inspire more emotionally intelligent digital products.",
    linkedin: "https://www.linkedin.com/in/silviabalu/",
    image: SilviaB
  }, {
    name: "Carissa Sinclair",
    title: "Director of UI/UX",
    company: "Alethium Health/BiTE interactive",
    bio: "A champion of blending design with software development's Behavior Driven Development and Jobs-to-be Done methodologies. Carissa has created websites and software platforms within the health sciences space for over 15 years.",
    linkedin: "https://www.linkedin.com/in/clyncreative/",
    image: CarissaS
  }, {
    name: "Caitlyn Brady",
    title: "Product Designer & Researcher",
    company: "Covalent",
    bio: "Product Designer specializing in B2B SaaS and workforce optimization tools. Previously at Americaneagle.com, she led major UX projects for clients like NYC Public Schools, conducted persona research and usability testing, and helped launch multi-million-dollar platform redesigns for education and finance organizations.",
    linkedin: "https://www.linkedin.com/in/caitlyn-brady-40487349/",
    image: CaitlynB
  }, {
    name: "Hayley Dahle",
    title: "Designer",
    company: "Consulting on Digital Tools",
    bio: "As a design leader with over 15 years of experience, I am grounded in systematic design thinking, specializing in translating complex user needs into intuitive products. My process is data-driven, utilizing diverse research methods to create a compelling visual foundation with an emphasis on brand compliance and design consistency. Recognizing this era of rapid technological growth, I actively work to integrate AI seamlessly into my design process. Outside of the office, I feel strongly about empowering people to confidently layer their existing skills with AI tools.",
    linkedin: "https://www.linkedin.com/in/hayley-dahle/",
    image: HayleyD
  }, {
    name: "Farooq Khayyat",
    title: "Product Designer",
    company: null,
    bio: "User Experience (UX) Design for gaming-related experiences, creative tools, and community services.",
    linkedin: "https://www.linkedin.com/in/farooqkhayyat/",
    image: FarooqK
  }, {
    name: "Farah Khan",
    title: "Product",
    company: "Paytient",
    bio: "Product strategy for fintech and enterprise technology. Former: Stripe, Dell EMC.",
    linkedin: "https://www.linkedin.com/in/fkhan/",
    image: FarahK
  }, {
    name: "Yatong Wang",
    title: "Product Designer",
    company: "Spatial Front Inc.",
    bio: "UX design and research for scientific context and enterprise SaaS.",
    linkedin: "https://www.linkedin.com/in/yatong-wang/",
    image: YatongW
  }, {
    name: "Sara Semoune",
    title: "UX Designer",
    company: null,
    bio: "A Columbia-trained UX/UI Designer with global experience in freelance digital projects and customer-focused roles at ZARA. She specializes in accessibility, inclusive design, and AI-driven solutions, always prioritizing empathy and human-centered results.",
    linkedin: "https://www.linkedin.com/in/sara-semoune-uxdesigner/",
    image: SaraS
  }, {
    name: "Esther Greenfield Jakar",
    title: "Product Experience Designer & PM",
    company: "Studio Lama",
    bio: "AI-driven Product Designer for nonprofits, startups, and B2C/B2B/SaaS platforms. Skilled in agile UX, design systems, and cross-functional project leadership. Expertise in agile UX, design systems, wireframes, and usability testing, crafting intuitive experiences that meet both business goals and user needs.",
    linkedin: "https://www.linkedin.com/in/esther-g-j/",
    image: EstherJ
  }];
  return <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet the <span className="text-gradient">Facilitators</span>
          </h2>
          
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {facilitators.slice(0, 8).map((facilitator, index) => (
            <FacilitatorCard key={index} facilitator={facilitator} index={index} />
          ))}
        </div>

        <div className="text-center my-16">
          <h3 className="text-2xl md:text-3xl font-bold">
            Contestants for <span className="text-gradient">Design Challenge</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {facilitators.slice(8).map((facilitator, index) => (
            <FacilitatorCard key={index + 8} facilitator={facilitator} index={index + 8} />
          ))}
        </div>
      </div>
    </section>;
};
export default SocialProof;