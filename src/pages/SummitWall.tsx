// @ts-nocheck
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Minus, Plus, Maximize2, UserPlus, ExternalLink, Share2, Edit, Link as LinkIcon, Trash2, LogOut, Shield, Globe, Camera } from "lucide-react";
import logo from "@/assets/uxsg-logo-dark-bg.png";
import uxsgLogo from "@/assets/uxsg-logo.svg";
import AuthModal from "@/components/AuthModal";
import html2canvas from 'html2canvas';
import EstherJImage from "@/assets/EstherJ.jpg";
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
  card_screenshot_url: string | null;
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
  const profileCardRef = useRef<HTMLDivElement>(null);
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedProfile, setDraggedProfile] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tempPositions, setTempPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ProfileCard | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    jobTitle: '',
    companyName: '',
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
  const [editFromWall, setEditFromWall] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddLinkDialog, setShowAddLinkDialog] = useState(false);
  const [newLinkData, setNewLinkData] = useState({
    url: '',
    title: ''
  });
  const [isGeneratingScreenshot, setIsGeneratingScreenshot] = useState(false);
  const [newCardIds, setNewCardIds] = useState<Set<string>>(new Set());

  // Generate deterministic animation properties based on profile ID
  const getFloatAnimation = (profileId: string) => {
    // Use profile ID to generate consistent random values
    const hash = profileId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const animationType = hash % 3 + 1; // 1, 2, or 3
    const duration = 12 + hash % 8; // 12-19 seconds
    const delay = hash % 10; // 0-9 seconds

    // Define keyframe names
    const keyframeName = `float-${animationType}-${profileId.substring(0, 8)}`;
    return {
      animationName: keyframeName,
      animationType,
      duration: `${duration}s`,
      delay: `${delay}s`
    };
  };

  // Create keyframes dynamically for each profile
  const createKeyframes = (profileId: string, animationType: number) => {
    const keyframeName = `float-${animationType}-${profileId.substring(0, 8)}`;

    // Different movement patterns
    const patterns = {
      1: `
        @keyframes ${keyframeName} {
          0%, 100% { transform: translate(0px, 0px); }
          25% { transform: translate(12px, -15px); }
          50% { transform: translate(-10px, -12px); }
          75% { transform: translate(-15px, 10px); }
        }
      `,
      2: `
        @keyframes ${keyframeName} {
          0%, 100% { transform: translate(0px, 0px); }
          25% { transform: translate(-18px, 12px); }
          50% { transform: translate(15px, 15px); }
          75% { transform: translate(10px, -18px); }
        }
      `,
      3: `
        @keyframes ${keyframeName} {
          0%, 100% { transform: translate(0px, 0px); }
          33% { transform: translate(14px, 16px); }
          66% { transform: translate(-16px, -11px); }
        }
      `
    };
    return patterns[animationType as keyof typeof patterns];
  };
  useEffect(() => {
    loadProfiles();
    checkAuthStatus();
    
    // Load temporary positions from sessionStorage
    const savedPositions = sessionStorage.getItem('summit_card_positions');
    if (savedPositions) {
      try {
        setTempPositions(JSON.parse(savedPositions));
      } catch (e) {
        console.error('Failed to parse saved positions:', e);
      }
    }

    // Check if we should open the create profile modal
    if (searchParams.get('createProfile') === 'true') {
      const email = sessionStorage.getItem('summit_user_email');
      if (email) {
        setShowCreateModal(true);
        // Remove the query param
        setSearchParams({});
      }
    }
  }, []);

  // Real-time subscription for new profiles
  useEffect(() => {
    const channel = supabase
      .channel('user_profiles_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_profiles'
        },
        (payload) => {
          const newProfile = payload.new as ProfileCard;
          
          // Only add if profile has a name (fully created)
          if (!newProfile.name) return;
          
          // Add to profiles with collision detection
          setProfiles(prev => {
            // Check if profile already exists
            if (prev.some(p => p.id === newProfile.id)) return prev;
            
            const updated = [...prev, newProfile];
            return preventOverlapping(updated);
          });
          
          // Mark as new for animation
          setNewCardIds(prev => new Set(prev).add(newProfile.id));
          
          // Remove animation after completion
          setTimeout(() => {
            setNewCardIds(prev => {
              const updated = new Set(prev);
              updated.delete(newProfile.id);
              return updated;
            });
          }, 600);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle direct profile link via slug
  useEffect(() => {
    if (slug && profiles.length > 0 && !isLoading) {
      const profile = profiles.find(p => p.slug === slug || p.id === slug);
      if (profile) {
        handleCardClick(profile);
        // Update URL to remove slug after opening modal
        navigate('/summit-profiles', {
          replace: true
        });
      } else {
        // Profile not found
        toast.error("This profile no longer exists or the link is invalid.");
        navigate('/summit-profiles', {
          replace: true
        });
      }
    } else if (slug && !isLoading && profiles.length === 0) {
      // Profiles loaded but empty
      toast.error("Unable to find this profile.");
      navigate('/summit-profiles', {
        replace: true
      });
    }
  }, [slug, profiles, isLoading, navigate]);
  const checkAuthStatus = async () => {
    const userId = sessionStorage.getItem('summit_user_id');
    const email = sessionStorage.getItem('summit_user_email');
    if (userId && email) {
      setCurrentUserId(userId);
      setUserEmail(email);

      // Check if user is admin
      try {
        const {
          data: adminData
        } = await supabase.functions.invoke('check-admin', {
          body: {
            userId
          }
        });
        setIsAdmin(adminData?.isAdmin || false);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    } else if (userId) {
      // Fetch email from database if we have userId but not email
      try {
        const {
          data
        } = await supabase.from('user_profiles').select('email').eq('id', userId).single();
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
      setIsLoading(true);
      const {
        data,
        error
      } = await supabase.from('user_profiles').select('id, name, job_title, company_name, bio, profile_photo_url, wall_position_x, wall_position_y, slug, linkedin_url, card_screenshot_url').not('name', 'is', null);
      if (error) {
        console.error('Error loading profiles:', error);
        toast.error("Unable to load profiles. Please refresh the page.");
        setProfiles([]);
        return;
      }
      
      // Apply collision detection to prevent overlapping
      const adjustedProfiles = preventOverlapping(data || []);
      setProfiles(adjustedProfiles);
    } catch (error) {
      console.error('Critical error loading profiles:', error);
      toast.error("Something went wrong. Please try again later.");
      setProfiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Collision detection to ensure cards don't overlap too much
  const preventOverlapping = (profiles: ProfileCard[]) => {
    const cardWidth = 200;
    const cardHeight = 250;
    const minSpacing = 45; // Increased to better account for floating animation

    // Apply initial grid positions for any cards without coordinates
    const withPositions = profiles.map((profile, index) => ({
      ...profile,
      wall_position_x:
        profile.wall_position_x ??
        (100 + (index % 8) * 250),
      wall_position_y:
        profile.wall_position_y ??
        (100 + Math.floor(index / 8) * 300),
      // Track original index so we can preserve ordering for rendering
      __originalIndex: index,
    })) as (ProfileCard & { __originalIndex: number })[];

    // Sort by Y then X for more predictable collision resolution
    const sorted = [...withPositions].sort((a, b) => {
      const yA = a.wall_position_y ?? 0;
      const yB = b.wall_position_y ?? 0;

      if (Math.abs(yA - yB) < 50) {
        const xA = a.wall_position_x ?? 0;
        const xB = b.wall_position_x ?? 0;
        return xA - xB;
      }

      return yA - yB;
    });

    const adjusted = sorted.map((profile) => ({ ...profile }));

    const maxPasses = 5;

    for (let pass = 0; pass < maxPasses; pass++) {
      let hasCollision = false;

      for (let i = 0; i < adjusted.length; i++) {
        const a = adjusted[i];
        const ax = a.wall_position_x ?? 0;
        const ay = a.wall_position_y ?? 0;

        for (let j = i + 1; j < adjusted.length; j++) {
          const b = adjusted[j];
          const bx = b.wall_position_x ?? 0;
          const by = b.wall_position_y ?? 0;

          const dx = bx - ax;
          const dy = by - ay;

          // Check if cards overlap within the width/height + spacing
          if (
            Math.abs(dx) < cardWidth + minSpacing &&
            Math.abs(dy) < cardHeight + minSpacing
          ) {
            hasCollision = true;

            // Move the later card just enough to resolve collision
            if (Math.abs(dx) >= Math.abs(dy)) {
              const direction = dx >= 0 ? 1 : -1;
              const overlap =
                cardWidth + minSpacing - Math.abs(dx);
              b.wall_position_x = bx + direction * (overlap + 10);
            } else {
              const direction = dy >= 0 ? 1 : -1;
              const overlap =
                cardHeight + minSpacing - Math.abs(dy);
              b.wall_position_y = by + direction * (overlap + 10);
            }
          }
        }
      }

      if (!hasCollision) {
        break;
      }
    }

    // Restore original ordering and strip helper field
    const result = adjusted
      .sort(
        (a, b) =>
          (a.__originalIndex ?? 0) - (b.__originalIndex ?? 0),
      )
      .map(({ __originalIndex, ...rest }) => rest as ProfileCard);

    return result;
  };
  // Drag handlers - using document listeners for better responsiveness
  const handleMouseDown = (e: React.MouseEvent, profileId: string) => {
    // Prevent drag if clicking on the card content (allow modal to open)
    if ((e.target as HTMLElement).closest('.card-content')) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;
    
    const currentX = tempPositions[profileId]?.x ?? profile.wall_position_x;
    const currentY = tempPositions[profileId]?.y ?? profile.wall_position_y;
    
    setDraggedProfile(profileId);
    const offset = {
      x: e.clientX / (zoom / 100) - currentX,
      y: e.clientY / (zoom / 100) - currentY
    };
    setDragOffset(offset);
    
    // Attach document-level listeners for better tracking
    const handleMove = (moveEvent: MouseEvent) => {
      const newX = moveEvent.clientX / (zoom / 100) - offset.x;
      const newY = moveEvent.clientY / (zoom / 100) - offset.y;
      
      // Clamp within canvas bounds
      const clampedX = Math.max(0, Math.min(1800, newX));
      const clampedY = Math.max(0, Math.min(1250, newY));
      
      setTempPositions(prev => {
        const newPositions = {
          ...prev,
          [profileId]: { x: clampedX, y: clampedY }
        };
        // Throttle sessionStorage updates
        requestAnimationFrame(() => {
          sessionStorage.setItem('summit_card_positions', JSON.stringify(newPositions));
        });
        return newPositions;
      });
    };
    
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      toast.success("Card position saved for this session");
      setDraggedProfile(null);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  const getCardPosition = (profile: ProfileCard) => {
    return tempPositions[profile.id] || {
      x: profile.wall_position_x || 0,
      y: profile.wall_position_y || 0
    };
  };

  // Helper to get profile photo URL (supports both storage URLs and local assets)
  const getProfilePhotoUrl = (photoUrl: string | null) => {
    if (!photoUrl) return null;
    // If it's already a full URL, return as is
    if (photoUrl.startsWith('http')) return photoUrl;
    // Map local asset filenames to imported assets
    const localAssets: Record<string, string> = {
      'EstherJ.jpg': EstherJImage,
    };
    return localAssets[photoUrl] || photoUrl;
  };
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-[#E5E7EB]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B5CF6]"></div>
      </div>;
  }
  return <div className="h-screen bg-[#E5E7EB] overflow-hidden relative">
      {/* Auth Status and Buttons - Bottom Right */}
      <div className="fixed bottom-8 right-8 z-10 flex items-center gap-4">
        {currentUserId ? <>
            <div className="bg-white rounded-lg shadow-md px-4 py-2 flex items-center gap-2">
              <span className="text-sm text-black">Logged in as</span>
              <span className="text-sm font-medium text-black">{userEmail}</span>
              <button onClick={handleLogout} className="text-sm text-[#8B5CF6] hover:text-[#7C3AED] ml-2">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <Button onClick={handleEditProfile} className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90 shadow-lg h-14 px-6" size="lg">
              <Edit className="w-5 h-5 mr-2" />
              Edit Profile
            </Button>
          </> : <Button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90 shadow-lg h-14 px-6" size="lg">
            <UserPlus className="w-5 h-5 mr-2" />
            Create Profile / Log In
          </Button>}
      </div>

      {/* Admin Link - Top Right */}
      {isAdmin && <div className="fixed top-4 left-4 z-10">
          <Button onClick={() => navigate('/admin')} variant="outline" className="bg-white shadow-md">
            <Shield className="w-4 h-4 mr-2" />
            Admin Panel
          </Button>
        </div>}

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-lg shadow-md p-2 z-10">
        <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
          <Minus className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium text-black min-w-[60px] text-center">
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
      <div 
        className="w-full h-full overflow-auto p-8" 
        style={{
          cursor: draggedProfile ? 'grabbing' : 'grab',
          transform: `scale(${zoom / 100})`
        }}
      >
        <div className="relative" style={{
        width: '2000px',
        height: '1500px'
      }}>
          {/* Centered Watermark Branding */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none opacity-10">
            <img src={uxsgLogo} alt="UXSG" className="h-33 w-auto -mr-[45px]" />
            <div className="w-px h-36 bg-gray-200" />
            <h2 className="text-[5.625rem] font-semibold text-black ml-[30px] whitespace-nowrap">
              AI<span className="text-gradient">x</span>UX Summit 2025
            </h2>
          </div>

          {/* Inject keyframes for all profiles */}
          <style>
            {`
              @keyframes card-entrance {
                0% {
                  transform: scale(0);
                  opacity: 0;
                }
                50% {
                  transform: scale(1.1);
                  opacity: 1;
                }
                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
              
              ${profiles.map(profile => {
                const floatAnimation = getFloatAnimation(profile.id);
                return createKeyframes(profile.id, floatAnimation.animationType);
              }).join('\n')}
            `}
          </style>

          {profiles.map(profile => {
          const floatAnimation = getFloatAnimation(profile.id);
          const position = getCardPosition(profile);
          const isDragging = draggedProfile === profile.id;
          const isNewCard = newCardIds.has(profile.id);
          
          return <div 
            key={profile.id} 
            className="absolute bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-4" 
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: '200px',
              cursor: isDragging ? 'grabbing' : 'grab',
              animation: isDragging 
                ? 'none' 
                : isNewCard
                  ? 'card-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                  : `${floatAnimation.animationName} ${floatAnimation.duration} ease-in-out infinite`,
              animationDelay: isNewCard ? '0s' : floatAnimation.delay,
              zIndex: isDragging ? 1000 : 1,
              userSelect: 'none'
            }} 
            onMouseDown={(e) => handleMouseDown(e, profile.id)}
          >
              <div className="card-content flex flex-col items-center gap-3" onClick={() => !isDragging && handleCardClick(profile)}>
                <div className="w-16 h-16 rounded-full bg-[#E5E7EB] overflow-hidden flex-shrink-0">
                  {profile.profile_photo_url ? <img src={getProfilePhotoUrl(profile.profile_photo_url)} alt={profile.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-xs">
                      No photo
                    </div>}
                </div>
                
                <h3 className="font-semibold text-black text-center line-clamp-1 text-lg">
                  {profile.name}
                </h3>
                
                {profile.job_title && <p className="text-xs font-medium text-black text-center line-clamp-1 mt-0.5 my-0">
                    {profile.job_title}
                  </p>}
                
                {profile.company_name && <p className="text-xs text-black text-center line-clamp-1 mt-1">
                    {profile.company_name}
                  </p>}
                
                {profile.bio && <p className="text-xs text-black text-center line-clamp-2 mt-1">
                    {profile.bio}
                   </p>}
              </div>
            </div>;
        })}

          {profiles.length === 0 && <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-black text-lg">No profiles yet</p>
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
            <DialogDescription className="text-center text-black text-sm">
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

            <p className="text-center text-xs text-black">
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
                <div className="flex items-center gap-1 pb-6 border-b border-gray-200">
                  <img src={uxsgLogo} alt="UXSG" className="h-[31px] w-auto -mr-[11px]" />
                  <div className="w-px h-[34px] bg-gray-200" />
                  <h3 className="text-[21px] font-semibold text-black ml-[7px]">
                    AI<span className="text-gradient">x</span>UX Summit 2025
                  </h3>
                </div>
                <DialogTitle className="sr-only">
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
                      {selectedProfile.profile_photo_url ? <img src={getProfilePhotoUrl(selectedProfile.profile_photo_url)} alt={selectedProfile.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-xs">
                          No photo
                        </div>}
                    </div>
                    <button onClick={handleChangePhoto} className="text-sm text-[#8B5CF6] hover:text-[#7C3AED] underline" disabled={isSaving}>
                      Change
                    </button>
                  </div>

                  <div>
                    <Label htmlFor="edit-name">Full Name *</Label>
                    <Input id="edit-name" type="text" placeholder="Sarah Chen" value={editFormData.name} onChange={e => setEditFormData({
                ...editFormData,
                name: e.target.value
              })} className="mt-2" disabled={isSaving} required />
                  </div>

                  <div>
                    <Label htmlFor="edit-jobTitle">Job Title *</Label>
                    <Input id="edit-jobTitle" type="text" placeholder="Senior Product Designer" value={editFormData.jobTitle} onChange={e => setEditFormData({
                ...editFormData,
                jobTitle: e.target.value
              })} className="mt-2" disabled={isSaving} required />
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

                  {/* LinkedIn Preview Generation - Hidden capture area */}
                  <div ref={profileCardRef} className="absolute -left-[9999px] w-[1200px] h-[630px] bg-white p-12">
                    <div className="flex items-start gap-8 h-full">
                      <div className="w-64 h-64 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                        {selectedProfile.profile_photo_url ? <img src={selectedProfile.profile_photo_url} alt={selectedProfile.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No photo</div>}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h2 className="text-6xl font-bold text-gray-900 mb-4">{editFormData.name}</h2>
                        <p className="text-3xl text-gray-700 mb-2">{editFormData.jobTitle}</p>
                        {editFormData.companyName && <p className="text-2xl text-gray-600">{editFormData.companyName}</p>}
                        <div className="mt-8 text-xl text-gray-500">AIxUX Summit 2025</div>
                      </div>
                    </div>
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
                        {enrichments.map(enrichment => <div key={enrichment.id} className="flex w-full items-center justify-between p-3 bg-[#F9FAFB] rounded-lg border min-w-0 overflow-hidden">
                            <div className="flex items-center gap-3 flex-1 min-w-0 w-0 overflow-hidden">
                              <LinkIcon className="w-4 h-4 text-[#8B5CF6] flex-shrink-0" />
                              <div className="flex-1 min-w-0 w-0 overflow-hidden">
                                <p className="text-sm text-black truncate">
                                  {enrichment.title || enrichment.url}
                                </p>
                                <p className="text-xs text-black truncate">
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
                <div className="flex gap-4 pt-6">
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
                    <h2 className="font-bold text-black text-3xl">{selectedProfile.name}</h2>
                    
                    {(selectedProfile.job_title || selectedProfile.company_name) && <p className="text-sm text-black">
                        {selectedProfile.job_title}
                        {selectedProfile.job_title && selectedProfile.company_name && " at "}
                        {selectedProfile.company_name}
                      </p>}
                    
                    {selectedProfile.linkedin_url && <a href={selectedProfile.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
                        LinkedIn Profile
                        <ExternalLink className="w-3 h-3" />
                      </a>}
                  </div>
                </div>

                {/* Bio */}
                {selectedProfile.bio && <div className="bg-[#F9FAFB] rounded-lg p-4">
                    <p className="text-sm text-black leading-relaxed">{selectedProfile.bio}</p>
                  </div>}


                {/* Enrichments/Links */}
                {enrichments.length > 0 && <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-black mb-3">What I created during the summit</h3>
                    <div className="space-y-2">
                      {enrichments.map(enrichment => <a key={enrichment.id} href={enrichment.url} target="_blank" rel="noopener noreferrer" className="flex w-full items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg border hover:border-[#8B5CF6] transition-colors group overflow-hidden">
                          <LinkIcon className="w-4 h-4 text-[#8B5CF6] flex-shrink-0" />
                          <div className="flex-1 min-w-0 w-0 overflow-hidden">
                            <p className="text-sm text-[#8B5CF6] truncate group-hover:underline">
                              {enrichment.title || enrichment.url}
                            </p>
                            <p className="text-xs text-black truncate">
                              {enrichment.url}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-[#8B5CF6] flex-shrink-0" />
                        </a>)}
                    </div>
                  </div>}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {currentUserId === selectedProfile.id && <Button onClick={handleEdit} variant="outline" className="flex-1 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>}
                  <Button onClick={handleShare} className={`${currentUserId === selectedProfile.id ? 'flex-1' : 'w-full'} bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90`}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Public Access Indicator */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                  <Globe className="w-3 h-3" />
                  <span>Public Profile - No login required to view</span>
                </div>
              </div>)}
            </>}
        </DialogContent>
      </Dialog>

      {/* Add Link Dialog */}
      <Dialog open={showAddLinkDialog} onOpenChange={setShowAddLinkDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
            <DialogDescription>
              Add a link to your work, portfolio, or social media
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-url">URL *</Label>
              <Input
                id="link-url"
                type="url"
                placeholder="https://..."
                value={newLinkData.url}
                onChange={e => setNewLinkData({...newLinkData, url: e.target.value})}
                disabled={isSaving}
              />
            </div>
            
            <div>
              <Label htmlFor="link-title">Title/Label *</Label>
              <Input
                id="link-title"
                type="text"
                placeholder="My Portfolio"
                value={newLinkData.title}
                onChange={e => setNewLinkData({...newLinkData, title: e.target.value})}
                disabled={isSaving}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowAddLinkDialog(false)}
                variant="outline"
                className="flex-1"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveNewLink}
                className="flex-1 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
    </div>;
};
export default SummitWall;