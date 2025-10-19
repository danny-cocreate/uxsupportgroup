import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Minus, Plus, Maximize2, UserPlus, ExternalLink, Share2, Edit } from "lucide-react";
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
  slug: string | null;
  linkedin_url: string | null;
}

const SummitWall = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ProfileCard | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    jobTitle: '',
    companyName: '',
    bio: '',
    linkedinUrl: ''
  });
  const [isSaving, setIsSaving] = useState(false);
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
        .select('id, name, job_title, company_name, bio, profile_photo_url, wall_position_x, wall_position_y, slug, linkedin_url')
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

  const handleCardClick = (profile: ProfileCard) => {
    setSelectedProfile(profile);
    setIsEditMode(false);
    setShowDetailModal(true);
  };

  const handleEdit = () => {
    if (selectedProfile) {
      setEditFormData({
        jobTitle: selectedProfile.job_title || '',
        companyName: selectedProfile.company_name || '',
        bio: selectedProfile.bio || '',
        linkedinUrl: selectedProfile.linkedin_url || ''
      });
      setIsEditMode(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedProfile) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          job_title: editFormData.jobTitle.trim() || null,
          company_name: editFormData.companyName.trim() || null,
          bio: editFormData.bio.trim() || null,
          linkedin_url: editFormData.linkedinUrl.trim() || null,
        })
        .eq('id', selectedProfile.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      setIsEditMode(false);
      loadProfiles();
      
      // Update selected profile to show new data
      setSelectedProfile({
        ...selectedProfile,
        job_title: editFormData.jobTitle.trim() || null,
        company_name: editFormData.companyName.trim() || null,
        bio: editFormData.bio.trim() || null,
        linkedin_url: editFormData.linkedinUrl.trim() || null,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleShare = () => {
    if (selectedProfile) {
      const url = `${window.location.origin}/summit-profiles/${selectedProfile.slug || selectedProfile.id}`;
      navigator.clipboard.writeText(url);
      toast.success("Profile link copied to clipboard!");
    }
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
              onClick={() => handleCardClick(profile)}
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

      {/* Profile Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-lg">
          {selectedProfile && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-2xl">
                  {isEditMode ? 'Edit Profile' : 'Profile'}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {isEditMode ? 'Edit profile details' : 'View profile details'}
                </DialogDescription>
              </DialogHeader>

              {isEditMode ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-jobTitle">Job Title</Label>
                    <Input
                      id="edit-jobTitle"
                      type="text"
                      placeholder="Senior Product Designer"
                      value={editFormData.jobTitle}
                      onChange={(e) => setEditFormData({ ...editFormData, jobTitle: e.target.value })}
                      className="mt-2"
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-companyName">Company Name</Label>
                    <Input
                      id="edit-companyName"
                      type="text"
                      placeholder="TechCorp"
                      value={editFormData.companyName}
                      onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                      className="mt-2"
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-linkedinUrl">LinkedIn Profile URL</Label>
                    <Input
                      id="edit-linkedinUrl"
                      type="url"
                      placeholder="https://www.linkedin.com/in/yourprofile"
                      value={editFormData.linkedinUrl}
                      onChange={(e) => setEditFormData({ ...editFormData, linkedinUrl: e.target.value })}
                      className="mt-2"
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-bio">Bio</Label>
                    <textarea
                      id="edit-bio"
                      placeholder="Tell us about yourself..."
                      value={editFormData.bio}
                      onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                      className="mt-2 w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isSaving}
                      maxLength={280}
                    />
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      {editFormData.bio.length}/280 characters
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex-1"
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="space-y-6">
                {/* Profile Photo */}
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-[#E5E7EB] overflow-hidden">
                    {selectedProfile.profile_photo_url ? (
                      <img 
                        src={selectedProfile.profile_photo_url} 
                        alt={selectedProfile.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#9CA3AF]">
                        No photo
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-[#1F2937]">{selectedProfile.name}</h2>
                </div>

                {/* Job Title */}
                {selectedProfile.job_title && (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-[#8B5CF6]">{selectedProfile.job_title}</p>
                  </div>
                )}

                {/* Company */}
                {selectedProfile.company_name && (
                  <div className="text-center">
                    <p className="text-base text-[#6B7280]">{selectedProfile.company_name}</p>
                  </div>
                )}

                {/* Bio */}
                {selectedProfile.bio && (
                  <div className="bg-[#F9FAFB] rounded-lg p-4">
                    <p className="text-sm text-[#4B5563] leading-relaxed">{selectedProfile.bio}</p>
                  </div>
                )}

                {/* LinkedIn */}
                {selectedProfile.linkedin_url && (
                  <div className="flex justify-center">
                    <a
                      href={selectedProfile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[#8B5CF6] hover:text-[#7C3AED] transition-colors"
                    >
                      View LinkedIn Profile
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="flex-1 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={handleShare}
                    className="flex-1 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SummitWall;
