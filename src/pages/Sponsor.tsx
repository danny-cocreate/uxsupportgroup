import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Sponsor = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Sponsor</h1>
          <p className="text-xl text-muted-foreground">Coming Soon</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sponsor;
