import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SketchyLayout } from "@/components/sketchy/SketchyLayout";
import Index from "./pages/Index";
import IndexV1 from "./pages/IndexV1";
import IndexV2 from "./pages/IndexV2";
import IndexV3 from "./pages/IndexV3";
import IndexV4 from "./pages/IndexV4";
import IndexV5 from "./pages/IndexV5";
import IndexV6 from "./pages/IndexV6";
import IndexV7 from "./pages/IndexV7";
import Summit2026 from "./pages/Summit2026";
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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CodeOfConduct from "./pages/CodeOfConduct";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<SketchyLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/index-v7" element={<IndexV7 />} />
            <Route path="/index-v1" element={<IndexV1 />} />
            <Route path="/index-v2" element={<IndexV2 />} />
            <Route path="/index-v3" element={<IndexV3 />} />
            <Route path="/index-v4" element={<IndexV4 />} />
            <Route path="/index-v5" element={<IndexV5 />} />
            <Route path="/index-v6" element={<IndexV6 />} />
            <Route path="/summit" element={<Summit2026 />} />
            <Route path="/summit-2025" element={<Summit />} />
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
            <Route path="/code-of-conduct" element={<CodeOfConduct />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
