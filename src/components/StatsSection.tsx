const StatsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-gradient-accent">
            <div className="text-5xl font-bold text-primary mb-2">100</div>
            <p className="text-muted-foreground">Total Attendees</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-accent">
            <div className="text-5xl font-bold text-primary mb-2">20+</div>
            <p className="text-muted-foreground">Industry Leaders</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-accent">
            <div className="text-5xl font-bold text-primary mb-2">1</div>
            <p className="text-muted-foreground">Day of Innovation</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
