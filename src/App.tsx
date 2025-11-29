import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Summit from "./pages/Summit";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Membership from "./pages/Membership";
import Sponsor from "./pages/Sponsor";
import Partner from "./pages/Partner";
import MediaKit from "./pages/MediaKit";
import SummitWall from "./pages/SummitWall";
import SummitVerify from "./pages/SummitVerify";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/summit" element={<Summit />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/sponsor" element={<Sponsor />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/media-kit" element={<MediaKit />} />
          <Route path="/summit-profiles" element={<SummitWall />} />
          <Route path="/summit-profiles/verify" element={<SummitVerify />} />
          <Route path="/summit-profiles/:slug" element={<SummitWall />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
