// Note: Please add the Miro collaboration board image to /src/assets/miro-collaboration.png
// This should be the image showing the community collaboration board with member feedback

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
              <div className="text-center p-8 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Add miro-collaboration.png to /src/assets/</p>
                <p className="text-xs mt-2">This will show the community collaboration board</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;

