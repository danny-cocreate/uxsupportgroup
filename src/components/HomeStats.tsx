const HomeStats = () => {
  const stats = [
    { value: "8,700+", label: "Members" },
    { value: "50+", label: "Events Per Year" },
    { value: "8+ Years", label: "Strong" },
    { value: "100%", label: "Free to Join" },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeStats;
