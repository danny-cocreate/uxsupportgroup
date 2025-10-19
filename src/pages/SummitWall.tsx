import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Minus, Plus, Maximize2, UserPlus, ExternalLink, Share2, Edit, Link as LinkIcon, Trash2, LogOut } from "lucide-react";
import logo from "@/assets/uxsg-logo-dark-bg.png";
import AuthModal from "@/components/AuthModal";
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
interface Enrichment {
  id: string;
  type: 'link' | 'image';
  url: string;
  title: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
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
  const [enrichments, setEnrichments] = useState<Enrichment[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    companyName: '',
    linkedinUrl: ''
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadProfiles();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const userId = sessionStorage.getItem('summit_user_id');
    const email = sessionStorage.getItem('summit_user_email');
    
    if (userId && email) {
      setCurrentUserId(userId);
      setUserEmail(email);
    } else if (userId) {
      // Fetch email from database if we have userId but not email
      try {
        const { data } = await supabase
          .from('user_profiles')
          .select('email')
          .eq('id', userId)
          .single();
        
        if (data?.email) {
          setUserEmail(data.email);
          sessionStorage.setItem('summit_user_email', data.email);
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    }
  };
  const loadProfiles = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('user_profiles').select('id, name, job_title, company_name, bio, profile_photo_url, wall_position_x, wall_position_y, slug, linkedin_url').not('name', 'is', null);
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
    const email = sessionStorage.getItem('summit_user_email');
    
    if (!email) {
      // User not authenticated, show auth modal
      setShowAuthModal(true);
      return;
    }
    
    // User is authenticated, show profile creation modal
    setShowCreateModal(true);
    setFormData({
      name: '',
      jobTitle: '',
      companyName: '',
      linkedinUrl: ''
    });
  };

  const handleEditProfile = async () => {
    const userId = sessionStorage.getItem('summit_user_id');
    if (!userId) return;

    try {
      // Load the user's profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Set as selected profile and load enrichments
      setSelectedProfile(profile);
      setEditFormData({
        jobTitle: profile.job_title || '',
        companyName: profile.company_name || '',
        bio: profile.bio || '',
        linkedinUrl: profile.linkedin_url || ''
      });

      // Load enrichments
      const { data: enrichmentsData, error: enrichmentsError } = await supabase
        .from('enrichments')
        .select('*')
        .eq('user_id', userId)
        .order('display_order', { ascending: true });

      if (enrichmentsError) throw enrichmentsError;
      setEnrichments((enrichmentsData || []) as Enrichment[]);

      // Open modal in edit mode
      setIsEditMode(true);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading profile for editing:', error);
      toast.error("Failed to load profile");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('summit_user_id');
    sessionStorage.removeItem('summit_user_email');
    setUserEmail(null);
    setCurrentUserId(null);
    toast.success('Logged out successfully');
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const email = sessionStorage.getItem('summit_user_email');
    if (!email) {
      toast.error("Please log in first");
      setShowCreateModal(false);
      setShowAuthModal(true);
      return;
    }

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
      const {
        data: profile,
        error: profileError
      } = await supabase.from('user_profiles').insert({
        email: email,
        name: formData.name.trim(),
        job_title: formData.jobTitle.trim(),
        company_name: formData.companyName.trim() || null,
        linkedin_url: formData.linkedinUrl.trim() || null,
        slug
      }).select().single();
      
      if (profileError) throw profileError;
      
      sessionStorage.setItem('summit_user_id', profile.id);
      setCurrentUserId(profile.id);
      toast.success("Profile created successfully!");
      setShowCreateModal(false);
      loadProfiles();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  const handleCardClick = async (profile: ProfileCard) => {
    setSelectedProfile(profile);
    setIsEditMode(false);

    // Load enrichments for view mode
    try {
      const {
        data: enrichmentsData,
        error
      } = await supabase.from('enrichments').select('*').eq('user_id', profile.id).order('display_order', {
        ascending: true
      });
      if (error) throw error;
      setEnrichments((enrichmentsData || []) as Enrichment[]);
    } catch (error) {
      console.error('Error loading enrichments:', error);
      setEnrichments([]);
    }
    setShowDetailModal(true);
  };
  const handleEdit = async () => {
    if (!selectedProfile) return;

    // Check if user is authenticated
    const userId = sessionStorage.getItem('summit_user_id');
    if (!userId) {
      // Not authenticated - show auth modal
      setShowDetailModal(false);
      setShowAuthModal(true);
      return;
    }

    // Check if this is their own profile
    if (userId !== selectedProfile.id) {
      toast.error("You can only edit your own profile");
      return;
    }

    setEditFormData({
      jobTitle: selectedProfile.job_title || '',
      companyName: selectedProfile.company_name || '',
      bio: selectedProfile.bio || '',
      linkedinUrl: selectedProfile.linkedin_url || ''
    });

    // Load enrichments
    try {
      const {
        data: enrichmentsData,
        error
      } = await supabase.from('enrichments').select('*').eq('user_id', selectedProfile.id).order('display_order', {
        ascending: true
      });
      if (error) throw error;
      setEnrichments((enrichmentsData || []) as Enrichment[]);
    } catch (error) {
      console.error('Error loading enrichments:', error);
    }
    setIsEditMode(true);
  };
  const handleSaveEdit = async () => {
    if (!selectedProfile) return;
    setIsSaving(true);
    try {
      const {
        error
      } = await supabase.from('user_profiles').update({
        job_title: editFormData.jobTitle.trim() || null,
        company_name: editFormData.companyName.trim() || null,
        bio: editFormData.bio.trim() || null,
        linkedin_url: editFormData.linkedinUrl.trim() || null
      }).eq('id', selectedProfile.id);
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
        linkedin_url: editFormData.linkedinUrl.trim() || null
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
  const handleAddLink = async () => {
    if (!selectedProfile) return;
    if (enrichments.length >= 10) {
      toast.error("Maximum 10 enrichments allowed");
      return;
    }
    const url = prompt("Enter URL:");
    if (!url) return;
    try {
      const {
        data,
        error
      } = await supabase.from('enrichments').insert({
        user_id: selectedProfile.id,
        type: 'link',
        url,
        title: url,
        display_order: enrichments.length
      }).select().single();
      if (error) throw error;
      setEnrichments([...enrichments, data as Enrichment]);
      toast.success("Link added");
    } catch (error) {
      console.error('Error adding link:', error);
      toast.error("Failed to add link");
    }
  };
  const handleDeleteEnrichment = async (id: string) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    try {
      const {
        error
      } = await supabase.from('enrichments').delete().eq('id', id);
      if (error) throw error;
      setEnrichments(enrichments.filter(e => e.id !== id));
      toast.success("Item deleted");
    } catch (error) {
      console.error('Error deleting enrichment:', error);
      toast.error("Failed to delete item");
    }
  };
  const handleChangePhoto = async () => {
    if (!selectedProfile) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }

      setIsSaving(true);
      try {
        // Create a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${selectedProfile.id}-${Date.now()}.${fileExt}`;
        const filePath = fileName;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(filePath, file, {
            upsert: true,
            contentType: file.type
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(filePath);

        // Update profile with new photo URL
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ profile_photo_url: publicUrl })
          .eq('id', selectedProfile.id);

        if (updateError) throw updateError;

        // Update local state
        setSelectedProfile({
          ...selectedProfile,
          profile_photo_url: publicUrl
        });

        toast.success("Photo updated successfully!");
        loadProfiles();
      } catch (error) {
        console.error('Error uploading photo:', error);
        toast.error("Failed to upload photo. Please try again.");
      } finally {
        setIsSaving(false);
      }
    };

    input.click();
  };
  const handleShare = () => {
    if (selectedProfile) {
      const url = `${window.location.origin}/summit-profiles/${selectedProfile.slug || selectedProfile.id}`;
      navigator.clipboard.writeText(url);
      toast.success("Profile link copied to clipboard!");
    }
  };
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B5CF6]"></div>
      </div>;
  }
  return <div className="h-screen bg-[#F9FAFB] overflow-hidden relative">
      {/* Auth Status and Buttons - Bottom Right */}
      <div className="fixed bottom-8 right-8 z-10 flex items-center gap-4">
        {currentUserId ? (
          <>
            <div className="bg-white rounded-lg shadow-md px-4 py-2 flex items-center gap-2">
              <span className="text-sm text-[#6B7280]">Logged in as</span>
              <span className="text-sm font-medium text-[#1F2937]">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-[#8B5CF6] hover:text-[#7C3AED] ml-2"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <Button 
              onClick={handleEditProfile} 
              className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90 shadow-lg h-14 px-6" 
              size="lg"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Profile
            </Button>
          </>
        ) : (
          <Button 
            onClick={() => setShowAuthModal(true)} 
            className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90 shadow-lg h-14 px-6" 
            size="lg"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Create Profile / Log In
          </Button>
        )}
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-lg shadow-md p-2 z-10">
        <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
          <Minus className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium text-[#1F2937] min-w-[60px] text-center">
          {zoom}%
        </span>
        <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
          <Plus className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-[#E5E7EB] mx-1" />
        <Button variant="ghost" size="sm" onClick={handleFitAll}>
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Canvas */}
      <div className="w-full h-full overflow-auto p-8" style={{
      cursor: 'grab',
      transform: `scale(${zoom / 100})`
    }}>
        <div className="relative" style={{
        width: '2000px',
        height: '1500px'
      }}>
          {profiles.map(profile => <div key={profile.id} className="absolute bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer p-4" style={{
          left: `${profile.wall_position_x || 0}px`,
          top: `${profile.wall_position_y || 0}px`,
          width: '200px'
        }} onClick={() => handleCardClick(profile)}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#E5E7EB] overflow-hidden flex-shrink-0">
                  {profile.profile_photo_url ? <img src={profile.profile_photo_url} alt={profile.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-xs">
                      No photo
                    </div>}
                </div>
                
                <h3 className="text-sm font-semibold text-[#1F2937] text-center line-clamp-1">
                  {profile.name}
                </h3>
                
                {profile.job_title && <p className="text-xs font-medium text-[#8B5CF6] text-center line-clamp-1">
                    {profile.job_title}
                  </p>}
                
                {profile.company_name && <p className="text-xs text-[#6B7280] text-center line-clamp-1">
                    {profile.company_name}
                  </p>}
                
                {profile.bio && <p className="text-xs text-[#9CA3AF] text-center line-clamp-2 mt-1">
                    {profile.bio}
                  </p>}
              </div>
            </div>)}

          {profiles.length === 0 && <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[#9CA3AF] text-lg">No profiles yet</p>
            </div>}
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
              <Input id="name" type="text" placeholder="Sarah Chen" value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} className="mt-2" disabled={isProcessing} required />
            </div>

            <div>
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input id="jobTitle" type="text" placeholder="Senior Product Designer" value={formData.jobTitle} onChange={e => setFormData({
              ...formData,
              jobTitle: e.target.value
            })} className="mt-2" disabled={isProcessing} required />
            </div>

            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" type="text" placeholder="TechCorp" value={formData.companyName} onChange={e => setFormData({
              ...formData,
              companyName: e.target.value
            })} className="mt-2" disabled={isProcessing} />
            </div>

            <div>
              <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
              <Input id="linkedinUrl" type="url" placeholder="https://www.linkedin.com/in/yourprofile" value={formData.linkedinUrl} onChange={e => setFormData({
              ...formData,
              linkedinUrl: e.target.value
            })} className="mt-2" disabled={isProcessing} />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90" disabled={isProcessing}>
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
          {selectedProfile && <>
              <DialogHeader>
                <DialogTitle className="text-center text-2xl">
                  {isEditMode ? 'Edit Profile' : 'Profile'}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {isEditMode ? 'Edit profile details' : 'View profile details'}
                </DialogDescription>
              </DialogHeader>

              {isEditMode ? (/* Edit Mode */
          <div className="space-y-4">
                  {/* Profile Photo */}
                  <div className="flex flex-col items-center gap-2 mb-4">
                    <div className="w-24 h-24 rounded-full bg-[#E5E7EB] overflow-hidden">
                      {selectedProfile.profile_photo_url ? <img src={selectedProfile.profile_photo_url} alt={selectedProfile.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-xs">
                          No photo
                        </div>}
                    </div>
                    <button onClick={handleChangePhoto} className="text-sm text-[#8B5CF6] hover:text-[#7C3AED] underline" disabled={isSaving}>
                      Change
                    </button>
                  </div>

                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-[#1F2937]">{selectedProfile.name}</h3>
                  </div>

                  <div>
                    <Label htmlFor="edit-jobTitle">Job Title</Label>
                    <Input id="edit-jobTitle" type="text" placeholder="Senior Product Designer" value={editFormData.jobTitle} onChange={e => setEditFormData({
                ...editFormData,
                jobTitle: e.target.value
              })} className="mt-2" disabled={isSaving} />
                  </div>

                  <div>
                    <Label htmlFor="edit-companyName">Company Name</Label>
                    <Input id="edit-companyName" type="text" placeholder="TechCorp" value={editFormData.companyName} onChange={e => setEditFormData({
                ...editFormData,
                companyName: e.target.value
              })} className="mt-2" disabled={isSaving} />
                  </div>

                  <div>
                    <Label htmlFor="edit-linkedinUrl">LinkedIn Profile URL</Label>
                    <Input id="edit-linkedinUrl" type="url" placeholder="https://www.linkedin.com/in/yourprofile" value={editFormData.linkedinUrl} onChange={e => setEditFormData({
                ...editFormData,
                linkedinUrl: e.target.value
              })} className="mt-2" disabled={isSaving} />
                  </div>

                  <div>
                    <Label htmlFor="edit-bio">Bio</Label>
                    <textarea id="edit-bio" placeholder="Tell us about yourself..." value={editFormData.bio} onChange={e => setEditFormData({
                ...editFormData,
                bio: e.target.value
              })} className="mt-2 w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" disabled={isSaving} maxLength={280} />
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      {editFormData.bio.length}/280 characters
                    </p>
                  </div>

                  {/* Enrichments Section */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <Label className="text-base">Your Creations</Label>
                      <Button onClick={handleAddLink} variant="outline" size="sm" className="text-[#8B5CF6] border-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white" disabled={isSaving}>
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Add Link
                      </Button>
                    </div>
                    
                    {enrichments.length > 0 && <div className="space-y-2">
                        {enrichments.map(enrichment => <div key={enrichment.id} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg border">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <LinkIcon className="w-4 h-4 text-[#8B5CF6] flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-[#1F2937] truncate">
                                  {enrichment.title || enrichment.url}
                                </p>
                                <p className="text-xs text-[#9CA3AF] truncate">
                                  {enrichment.url}
                                </p>
                              </div>
                            </div>
                            <Button onClick={() => handleDeleteEnrichment(enrichment.id)} variant="ghost" size="sm" className="text-[#DC2626] hover:text-[#DC2626] hover:bg-red-50 flex-shrink-0" disabled={isSaving}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>)}
                      </div>}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleCancelEdit} variant="outline" className="flex-1" disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} className="flex-1 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>) : (/* View Mode */
          <div className="space-y-6">
                {/* Two Column Layout: Photo Left, Info Right */}
                <div className="flex gap-4">
                  {/* Left Column - Photo */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-[#E5E7EB] overflow-hidden">
                      {selectedProfile.profile_photo_url ? <img src={selectedProfile.profile_photo_url} alt={selectedProfile.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-xs">
                          No photo
                        </div>}
                    </div>
                  </div>

                  {/* Right Column - Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <h2 className="text-xl font-bold text-[#1F2937]">{selectedProfile.name}</h2>
                    
                    {(selectedProfile.job_title || selectedProfile.company_name) && (
                      <p className="text-base font-semibold text-[#8B5CF6]">
                        {selectedProfile.job_title}
                        {selectedProfile.job_title && selectedProfile.company_name && " at "}
                        {selectedProfile.company_name}
                      </p>
                    )}
                    
                    {selectedProfile.linkedin_url && <a href={selectedProfile.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
                        View LinkedIn
                        <ExternalLink className="w-3 h-3" />
                      </a>}
                  </div>
                </div>

                {/* Bio */}
                {selectedProfile.bio && <div className="bg-[#F9FAFB] rounded-lg p-4">
                    <p className="text-sm text-[#4B5563] leading-relaxed">{selectedProfile.bio}</p>
                  </div>}


                {/* Enrichments/Links */}
                {enrichments.length > 0 && <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-[#1F2937] mb-3">My Creations</h3>
                    <div className="space-y-2">
                      {enrichments.map(enrichment => <a key={enrichment.id} href={enrichment.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg border hover:border-[#8B5CF6] transition-colors group">
                          <LinkIcon className="w-4 h-4 text-[#8B5CF6] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#1F2937] truncate group-hover:text-[#8B5CF6]">
                              {enrichment.title || enrichment.url}
                            </p>
                            <p className="text-xs text-[#9CA3AF] truncate">
                              {enrichment.url}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#8B5CF6] flex-shrink-0" />
                        </a>)}
                    </div>
                  </div>}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {currentUserId === selectedProfile.id && (
                    <Button onClick={handleEdit} variant="outline" className="flex-1 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                  <Button onClick={handleShare} className={`${currentUserId === selectedProfile.id ? 'flex-1' : 'w-full'} bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90`}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>)}
            </>}
        </DialogContent>
      </Dialog>
    </div>;
};
export default SummitWall;