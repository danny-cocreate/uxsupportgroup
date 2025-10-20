const HomeStats = () => {
  const stats = [
    { value: "8,800+", label: "Members" },
    { value: "250+", label: "Events Per Year" },
    { value: "8+ Years", label: "Strong" },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-medium text-foreground mb-2">{stat.value}</div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeStats;
