import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Minus, Plus, Maximize2, UserPlus } from "lucide-react";
import logo from "@/assets/uxsg-logo-dark-bg.png";

interface ProfileCard {
  id: string;
  name: string;
  job_title: string | null;
  company_name: string | null;
  bio: string;
  profile_photo_url: string | null;
  wall_position_x: number;
  wall_position_y: number;
}

const SummitWall = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    companyName: '',
    linkedinUrl: ''
  });

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, name, job_title, company_name, bio, profile_photo_url, wall_position_x, wall_position_y')
        .not('name', 'is', null);

      if (error) throw error;

      setProfiles(data || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(50, prev - 25));
  };

  const handleFitAll = () => {
    setZoom(100);
  };

  const handleCreateProfile = () => {
    setShowCreateModal(true);
    setFormData({
      name: '',
      jobTitle: '',
      companyName: '',
      linkedinUrl: ''
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.jobTitle.trim()) {
      toast.error("Please enter your job title");
      return;
    }

    if (formData.linkedinUrl && !formData.linkedinUrl.includes('linkedin.com/in/')) {
      toast.error("Please enter a valid LinkedIn profile URL");
      return;
    }

    setIsProcessing(true);

    try {
      // Create slug from name
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          email: `${slug}@temp.com`, // Temporary email until we add real auth later
          name: formData.name.trim(),
          job_title: formData.jobTitle.trim(),
          company_name: formData.companyName.trim() || null,
          linkedin_url: formData.linkedinUrl.trim() || null,
          slug,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      sessionStorage.setItem('summit_user_id', profile.id);
      toast.success("Profile created successfully!");
      setShowCreateModal(false);
      loadProfiles();
      navigate('/summit-profiles');

    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardClick = (profileId: string) => {
    // For now, just show a toast. In full implementation, open detail modal
    toast.info("Click to view profile details (coming soon)");
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B5CF6]"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F9FAFB] overflow-hidden relative">
      {/* Create Profile Button - Bottom Right */}
      <Button
        onClick={handleCreateProfile}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90 shadow-lg z-10 h-14 px-6"
        size="lg"
      >
        <UserPlus className="w-5 h-5 mr-2" />
        Create Profile
      </Button>

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-lg shadow-md p-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= 50}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium text-[#1F2937] min-w-[60px] text-center">
          {zoom}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= 200}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-[#E5E7EB] mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFitAll}
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Canvas */}
      <div 
        className="w-full h-full overflow-auto p-8"
        style={{ 
          cursor: 'grab',
          transform: `scale(${zoom / 100})`
        }}
      >
        <div className="relative" style={{ width: '2000px', height: '1500px' }}>
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="absolute bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer p-4"
              style={{
                left: `${profile.wall_position_x || 0}px`,
                top: `${profile.wall_position_y || 0}px`,
                width: '200px',
              }}
              onClick={() => handleCardClick(profile.id)}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#E5E7EB] overflow-hidden flex-shrink-0">
                  {profile.profile_photo_url ? (
                    <img 
                      src={profile.profile_photo_url} 
                      alt={profile.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-xs">
                      No photo
                    </div>
                  )}
                </div>
                
                <h3 className="text-sm font-semibold text-[#1F2937] text-center line-clamp-1">
                  {profile.name}
                </h3>
                
                {profile.job_title && (
                  <p className="text-xs font-medium text-[#8B5CF6] text-center line-clamp-1">
                    {profile.job_title}
                  </p>
                )}
                
                {profile.company_name && (
                  <p className="text-xs text-[#6B7280] text-center line-clamp-1">
                    {profile.company_name}
                  </p>
                )}
                
                {profile.bio && (
                  <p className="text-xs text-[#9CA3AF] text-center line-clamp-2 mt-1">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
          ))}

          {profiles.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[#9CA3AF] text-lg">No profiles yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Profile Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <img src={logo} alt="UXSG Logo" className="h-16 w-16 rounded-xl" />
            </div>
            <DialogTitle className="text-center text-2xl">
              Create Your Profile Card
            </DialogTitle>
            <DialogDescription className="text-center text-[#6B7280] text-sm">
              Welcome to the AI x UX Virtual Summit! Let's create your unique profile card.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Sarah Chen"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
                disabled={isProcessing}
                required
              />
            </div>

            <div>
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                type="text"
                placeholder="Senior Product Designer"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="mt-2"
                disabled={isProcessing}
                required
              />
            </div>

            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="TechCorp"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="mt-2"
                disabled={isProcessing}
              />
            </div>

            <div>
              <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
              <Input
                id="linkedinUrl"
                type="url"
                placeholder="https://www.linkedin.com/in/yourprofile"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="mt-2"
                disabled={isProcessing}
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90"
              disabled={isProcessing}
            >
              {isProcessing ? "Creating..." : "Create Profile"}
            </Button>

            <p className="text-center text-xs text-[#9CA3AF]">
              * Required fields
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SummitWall;
