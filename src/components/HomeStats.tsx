const HomeStats = () => {
  const stats = [
    { value: "8,800+", label: "Members" },
    { value: "250+", label: "Events Per Year" },
    { value: "8+ Years", label: "Strong" },
  ];

  return (
    <section className="py-16 gradient-stats relative">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-4xl md:text-5xl font-medium text-white mb-2">{stat.value}</div>
              <p className="text-white/90 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeStats;
