import miroBoard from "@/assets/miro-collaboration.png";

const PhilosophySection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">We Are Not a Lecture Hall.</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Most communities are places to passively consume content. You watch a webinar, take notes, and go back to work.
              <br /><br />
              <strong className="text-foreground">UXSG is a workspace.</strong>
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-2">Human-First, AI-Empowered</h4>
                  <p className="text-muted-foreground">
                    We operate on a simple equation: <strong className="text-foreground">Human Ingenuity + AI &gt; AI alone.</strong> We use tools to amplify empathy, not replace it.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-2">Active Construction</h4>
                  <p className="text-muted-foreground">
                    We don't just talk about the future; we open our laptops and build it. Every session ends with output.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-2">Community Intelligence</h4>
                  <p className="text-muted-foreground">
                    Our formats are designed by veterans, but the breakthroughs come from <strong className="text-foreground">you</strong>. We are smarter together.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Visual: Miro collaboration board */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl transform rotate-2" />
            <div className="relative bg-background rounded-xl shadow-2xl overflow-hidden border border-border aspect-video flex items-center justify-center">
              <img 
                src={miroBoard} 
                alt="UXSG community collaboration board showing real member contributions, questions, realizations, and observations from live sessions"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;

