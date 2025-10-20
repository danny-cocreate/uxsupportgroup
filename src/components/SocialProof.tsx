import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import SuyenL from "@/assets/SuyenL-2.jpeg";
import SilviaB from "@/assets/SilviaB-2.jpeg";
import AlexisB from "@/assets/AlexisB-2.png";
import VolkanU from "@/assets/VolkanU-2.jpeg";
import RenataR from "@/assets/RenataR-2.jpeg";
import DannyS from "@/assets/DannyS-2.jpeg";
import HayleyD from "@/assets/HayleyD-new.jpg";
import FarooqK from "@/assets/FarooqK-3.jpg";
import FarahK from "@/assets/FarahK-2.jpeg";
import YatongW from "@/assets/YatongW-2.jpeg";
const SocialProof = () => {
  const facilitators = [{
    name: "Danny Setiawan",
    title: "Founder, Instructor",
    company: "CoCreate | Ex. The Economist, Yahoo!",
    bio: "Leader in UX strategy for global media and startup growth. Former: Yahoo!, The Economist.",
    linkedin: "https://www.linkedin.com/in/dnystwn/",
    image: DannyS
  }, {
    name: "Suyen Stevenson",
    title: "Facilitator, Details TBA",
    company: null,
    bio: "Specialist in UX design and conference moderation.",
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
    title: "Principal, AI Product Strategist",
    company: "Alexis Design",
    bio: "Human-first product leader specializing in AI-powered transformation across design, technology, and business domains. Expertise in UX-informed product strategy and developing business acumen in technical leaders. Former: California Governor's Office of Emergency Services, Rhode Island T.F. Green International Airport, WLNE-ABC6-TV, Brown University Health Systems, Mallinckrodt Pharmaceuticals.",
    linkedin: "https://www.linkedin.com/in/alexisbrochu/",
    image: AlexisB
  }, {
    name: "Renata Rocha",
    title: "Product Designer",
    company: "Amazon",
    bio: "Specialist in e-commerce design and experience at global technology brands. Former: ContentSquare, Academy Product Design Studio.",
    linkedin: "https://www.linkedin.com/in/rerocha/",
    image: RenataR
  }, {
    name: "Silvia Balu",
    title: "UX/UI Designer | International UX & AI Community Lead",
    company: "Team Gesundheit GmbH",
    bio: "Recognized for innovation in design research and for bridging psychology, user experience, and AI to inspire more emotionally intelligent digital products.",
    linkedin: "https://www.linkedin.com/in/silviabalu/",
    image: SilviaB
  }, {
    name: "Hayley Dahle",
    title: "Director, UX/CAD",
    company: "FULLBEAUTY Brands",
    bio: "Expert in digital transformation and consumer brand experience design.",
    linkedin: "https://www.linkedin.com/in/hayley-dahle/",
    image: HayleyD
  }, {
    name: "Farooq Khayyat",
    title: "Senior Software Engineer UI/UX",
    company: "ibex. Pakistan",
    bio: "Specialist in enterprise UI/UX for global platforms. Former: UI/UX Designer, YPO Project.",
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
  }];
  return <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet the <span className="text-gradient">Facilitators</span>
          </h2>
          
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {facilitators.slice(0, 6).map((facilitator, index) => <Card key={index} className="group hover:shadow-lg transition-shadow">
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
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {facilitator.bio}
                </p>
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
            </Card>)}
        </div>

        <div className="text-center my-16">
          <h3 className="text-2xl md:text-3xl font-bold">
            Contestants for <span className="text-gradient">Design Challenge</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {facilitators.slice(6).map((facilitator, index) => <Card key={index + 6} className="group hover:shadow-lg transition-shadow">
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
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {facilitator.bio}
                </p>
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
            </Card>)}
        </div>
      </div>
    </section>;
};
export default SocialProof;