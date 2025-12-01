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
  
  // Drag threshold detection refs
  const dragStartRef = useRef<{ x: number; y: number; profileId: string } | null>(null);
  const wasDragRef = useRef(false);
  const DRAG_THRESHOLD = 5; // pixels - distance to move before it's considered a drag

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
      
      // Use database positions directly - no client-side manipulation
      setProfiles(data || []);
    } catch (error) {
      console.error('Critical error loading profiles:', error);
      toast.error("Something went wrong. Please try again later.");
      setProfiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Multi-pass collision detection to ensure cards don't overlap
  const preventOverlapping = (profiles: ProfileCard[]) => {
    const cardWidth = 200;
    const cardHeight = 250;
    const minSpacing = 50; // Increased to 50px to account for floating animation (±18px)
    const maxIterations = 10;
    const padding = 50; // Padding from canvas edges
    const minX = padding;
    const minY = padding;
    
    // Initialize positions
    let adjusted = profiles.map((profile, index) => ({
      ...profile,
      wall_position_x: profile.wall_position_x || (100 + (index % 8) * 250),
      wall_position_y: profile.wall_position_y || (100 + Math.floor(index / 8) * 300)
    }));
    
    // Multi-pass collision resolution
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      let hasCollision = false;
      
      // Check all card pairs
      for (let i = 0; i < adjusted.length; i++) {
        for (let j = i + 1; j < adjusted.length; j++) {
          const dx = adjusted[j].wall_position_x - adjusted[i].wall_position_x;
          const dy = adjusted[j].wall_position_y - adjusted[i].wall_position_y;
          
          // Check if cards overlap
          if (Math.abs(dx) < cardWidth + minSpacing && Math.abs(dy) < cardHeight + minSpacing) {
            hasCollision = true;
            
            // Push card j away from card i
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0) {
              const overlapX = (cardWidth + minSpacing) - Math.abs(dx);
              const overlapY = (cardHeight + minSpacing) - Math.abs(dy);
              
              // Move in the direction of least resistance
              if (overlapX < overlapY) {
                adjusted[j].wall_position_x += dx > 0 ? overlapX : -overlapX;
              } else {
                adjusted[j].wall_position_y += dy > 0 ? overlapY : -overlapY;
              }
            }
          }
        }
      }
      
      // Ensure all cards are within bounds (positive coordinates with padding)
      adjusted = adjusted.map(card => ({
        ...card,
        wall_position_x: Math.max(minX, card.wall_position_x),
        wall_position_y: Math.max(minY, card.wall_position_y)
      }));
      
      // If no collisions detected, we're done
      if (!hasCollision) break;
    }
    
    return adjusted;
  };

  // Calculate dynamic canvas size based on card positions
  const getCanvasSize = () => {
    if (profiles.length === 0) {
      return { width: 2000, height: 1500 };
    }
    
    const cardWidth = 200;
    const cardHeight = 250;
    const padding = 100;
    
    let maxX = 0;
    let maxY = 0;
    
    profiles.forEach(profile => {
      const position = getCardPosition(profile);
      maxX = Math.max(maxX, position.x + cardWidth);
      maxY = Math.max(maxY, position.y + cardHeight);
    });
    
    // Add padding and ensure minimum size
    return {
      width: Math.max(2000, maxX + padding),
      height: Math.max(1500, maxY + padding)
    };
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
      const {
        data: profile,
        error: profileError
      } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
      if (profileError) throw profileError;

      // Set as selected profile and load enrichments
      setSelectedProfile(profile);
      setEditFormData({
        name: profile.name || '',
        jobTitle: profile.job_title || '',
        companyName: profile.company_name || '',
        linkedinUrl: profile.linkedin_url || ''
      });

      // Load enrichments
      const {
        data: enrichmentsData,
        error: enrichmentsError
      } = await supabase.from('enrichments').select('*').eq('user_id', userId).order('display_order', {
        ascending: true
      });
      if (enrichmentsError) throw enrichmentsError;
      setEnrichments((enrichmentsData || []) as Enrichment[]);

      // Open modal in edit mode - mark as edit from wall
      setEditFromWall(true);
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

      // Store userId in sessionStorage
      sessionStorage.setItem('summit_user_id', profile.id);
      setCurrentUserId(profile.id);

      // Assign admin role if applicable
      try {
        await supabase.functions.invoke('assign-admin-role', {
          body: {
            userId: profile.id,
            email: email
          }
        });
      } catch (error) {
        console.error('Error assigning admin role:', error);
      }

      // Auto-generate screenshot
      setSelectedProfile(profile);
      setEditFormData({
        name: formData.name.trim(),
        jobTitle: formData.jobTitle.trim(),
        companyName: formData.companyName.trim(),
        linkedinUrl: formData.linkedinUrl.trim()
      });

      // Wait a tick for state to update, then generate
      setTimeout(async () => {
        const success = await generateScreenshot(profile.id, {
          name: formData.name.trim(),
          job_title: formData.jobTitle.trim(),
          company_name: formData.companyName.trim()
        });
        if (success) {
          toast.success("Profile created! Preview generated ✓");
        } else {
          toast.success("Profile created successfully!");
          toast.error("Preview generation failed. You can try again from edit mode.");
        }
      }, 100);
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
      if (error) {
        console.error('Error loading enrichments:', error);
        // Show enrichments section but with error state
        setEnrichments([]);
        toast.error("Unable to load profile links. The profile will still display.");
      } else {
        setEnrichments((enrichmentsData || []) as Enrichment[]);
      }
    } catch (error) {
      console.error('Critical error loading enrichments:', error);
      setEnrichments([]);
    }

    // Always open modal regardless of enrichments load status
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
      name: selectedProfile.name || '',
      jobTitle: selectedProfile.job_title || '',
      companyName: selectedProfile.company_name || '',
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

    // Mark as edit from card view (not from wall)
    setEditFromWall(false);
    setIsEditMode(true);
  };
  const handleSaveEdit = async () => {
    if (!selectedProfile) return;
    setIsSaving(true);
    try {
      const {
        error
      } = await supabase.from('user_profiles').update({
        name: editFormData.name.trim() || null,
        job_title: editFormData.jobTitle.trim() || null,
        company_name: editFormData.companyName.trim() || null,
        linkedin_url: editFormData.linkedinUrl.trim() || null
      }).eq('id', selectedProfile.id);
      if (error) throw error;

      // Update selected profile to show new data
      const updatedProfile = {
        ...selectedProfile,
        name: editFormData.name.trim() || selectedProfile.name,
        job_title: editFormData.jobTitle.trim() || null,
        company_name: editFormData.companyName.trim() || null,
        linkedin_url: editFormData.linkedinUrl.trim() || null
      };
      setSelectedProfile(updatedProfile);
      loadProfiles();

      // Auto-generate screenshot after update
      const success = await generateScreenshot(selectedProfile.id, {
        name: editFormData.name.trim(),
        job_title: editFormData.jobTitle.trim(),
        company_name: editFormData.companyName.trim()
      });
      if (success) {
        toast.success("Profile updated! Preview regenerated ✓");
      } else {
        toast.success("Profile updated successfully!");
        toast.error("Preview regeneration failed.");
      }

      // Check if edit was from wall or card view
      if (editFromWall) {
        // Came from wall - close modal completely
        setIsEditMode(false);
        setShowDetailModal(false);
        setEditFromWall(false);
      } else {
        // Came from card view - return to card view
        setIsEditMode(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleCancelEdit = () => {
    // Check if edit was from wall or card view
    if (editFromWall) {
      // Came from wall - close modal completely
      setIsEditMode(false);
      setShowDetailModal(false);
      setEditFromWall(false);
    } else {
      // Came from card view - return to card view
      setIsEditMode(false);
    }
  };
  const generateScreenshot = async (profileId: string, profileData: any): Promise<boolean> => {
    if (!profileCardRef.current) return false;
    setIsGeneratingScreenshot(true);
    try {
      // Capture the card element
      const canvas = await html2canvas(profileCardRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        logging: false,
        width: 1200,
        height: 630
      });

      // Convert to blob
      const blob = await new Promise<Blob>(resolve => {
        canvas.toBlob(blob => resolve(blob!), 'image/png', 0.85);
      });

      // Upload to Supabase Storage
      const fileName = `${profileId}-${Date.now()}.png`;
      const {
        data: uploadData,
        error: uploadError
      } = await supabase.storage.from('profile-screenshots').upload(fileName, blob, {
        contentType: 'image/png',
        upsert: true
      });
      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('profile-screenshots').getPublicUrl(fileName);

      // Update profile with screenshot URL
      const {
        error: updateError
      } = await supabase.from('user_profiles').update({
        card_screenshot_url: publicUrl,
        screenshot_generated_at: new Date().toISOString()
      }).eq('id', profileId);
      if (updateError) throw updateError;

      // Update local state
      if (selectedProfile?.id === profileId) {
        setSelectedProfile({
          ...selectedProfile,
          card_screenshot_url: publicUrl
        });
      }
      loadProfiles();
      return true;
    } catch (error) {
      console.error('Screenshot generation error:', error);
      return false;
    } finally {
      setIsGeneratingScreenshot(false);
    }
  };
  const handleAddLink = () => {
    if (!selectedProfile) return;
    if (enrichments.length >= 10) {
      toast.error("Maximum 10 enrichments allowed");
      return;
    }
    setNewLinkData({
      url: '',
      title: ''
    });
    setShowAddLinkDialog(true);
  };
  const handleSaveNewLink = async () => {
    if (!selectedProfile) return;

    // Validation
    if (!newLinkData.url.trim()) {
      toast.error("URL is required");
      return;
    }
    if (!newLinkData.title.trim()) {
      toast.error("Title/Label is required");
      return;
    }
    try {
      const {
        data,
        error
      } = await supabase.from('enrichments').insert({
        user_id: selectedProfile.id,
        type: 'link',
        url: newLinkData.url.trim(),
        title: newLinkData.title.trim(),
        display_order: enrichments.length
      }).select().single();
      if (error) throw error;
      setEnrichments([...enrichments, data as Enrichment]);
      toast.success("Link added");
      setShowAddLinkDialog(false);
      setNewLinkData({
        url: '',
        title: ''
      });
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
    input.onchange = async e => {
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
        const {
          error: uploadError
        } = await supabase.storage.from('profile-photos').upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });
        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: {
            publicUrl
          }
        } = supabase.storage.from('profile-photos').getPublicUrl(filePath);

        // Update profile with new photo URL
        const {
          error: updateError
        } = await supabase.from('user_profiles').update({
          profile_photo_url: publicUrl
        }).eq('id', selectedProfile.id);
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
  const handleShare = async () => {
    if (!selectedProfile) return;
    const shareUrl = `https://uxsupportgroup.com/summit-profiles/${selectedProfile.slug || selectedProfile.id}`;
    try {
      // Check if profile has a card screenshot for better LinkedIn previews
      if (!selectedProfile.card_screenshot_url) {
        toast.info("Tip: Generate a preview image in Edit mode for better LinkedIn previews!", {
          duration: 6000
        });
      }
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied! This link shows a rich preview on social platforms and redirects to your profile.", {
        duration: 5000
      });
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      toast.error("Failed to copy link");
    }
  };

  // Drag handlers - using document listeners for better responsiveness
  const handleMouseDown = (e: React.MouseEvent, profileId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;
    
    const currentX = tempPositions[profileId]?.x ?? profile.wall_position_x;
    const currentY = tempPositions[profileId]?.y ?? profile.wall_position_y;
    
    // Record start position for drag threshold detection
    dragStartRef.current = { 
      x: e.clientX / (zoom / 100), 
      y: e.clientY / (zoom / 100), 
      profileId 
    };
    wasDragRef.current = false;
    
    const offset = {
      x: e.clientX / (zoom / 100) - currentX,
      y: e.clientY / (zoom / 100) - currentY
    };
    setDragOffset(offset);
    
    // Attach document-level listeners for better tracking
    const handleMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current) return;
      
      const currentMouseX = moveEvent.clientX / (zoom / 100);
      const currentMouseY = moveEvent.clientY / (zoom / 100);
      
      // Calculate distance from start position
      const distanceX = Math.abs(currentMouseX - dragStartRef.current.x);
      const distanceY = Math.abs(currentMouseY - dragStartRef.current.y);
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      // Only start dragging if threshold exceeded
      if (distance > DRAG_THRESHOLD) {
        if (!wasDragRef.current) {
          wasDragRef.current = true;
          setDraggedProfile(profileId);
        }
        
        const newX = moveEvent.clientX / (zoom / 100) - offset.x;
        const newY = moveEvent.clientY / (zoom / 100) - offset.y;
        
        // Clamp within canvas bounds
        const clampedX = Math.max(0, Math.min(1800, newX));
        const clampedY = Math.max(0, Math.min(1250, newY));
        
        setTempPositions(prev => ({
          ...prev,
          [profileId]: { x: clampedX, y: clampedY }
        }));
      }
    };
    
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      
      if (wasDragRef.current) {
        toast.success("Card position saved for this session");
        setDraggedProfile(null);
      }
      
      dragStartRef.current = null;
      // Reset drag flag after a brief delay to allow click handler to check it
      setTimeout(() => {
        wasDragRef.current = false;
      }, 10);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  // Touch handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent, profileId: string) => {
    const touch = e.touches[0];
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;
    
    const currentX = tempPositions[profileId]?.x ?? profile.wall_position_x;
    const currentY = tempPositions[profileId]?.y ?? profile.wall_position_y;
    
    // Record start position for drag threshold detection
    dragStartRef.current = { 
      x: touch.clientX / (zoom / 100), 
      y: touch.clientY / (zoom / 100), 
      profileId 
    };
    wasDragRef.current = false;
    
    const offset = {
      x: touch.clientX / (zoom / 100) - currentX,
      y: touch.clientY / (zoom / 100) - currentY
    };
    setDragOffset(offset);
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!dragStartRef.current) return;
      
      const touch = moveEvent.touches[0];
      const currentTouchX = touch.clientX / (zoom / 100);
      const currentTouchY = touch.clientY / (zoom / 100);
      
      // Calculate distance from start position
      const distanceX = Math.abs(currentTouchX - dragStartRef.current.x);
      const distanceY = Math.abs(currentTouchY - dragStartRef.current.y);
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      // Only start dragging if threshold exceeded
      if (distance > DRAG_THRESHOLD) {
        if (!wasDragRef.current) {
          wasDragRef.current = true;
          setDraggedProfile(profileId);
        }
        
        const newX = touch.clientX / (zoom / 100) - offset.x;
        const newY = touch.clientY / (zoom / 100) - offset.y;
        
        // Clamp within canvas bounds
        const clampedX = Math.max(0, Math.min(1800, newX));
        const clampedY = Math.max(0, Math.min(1250, newY));
        
        setTempPositions(prev => ({
          ...prev,
          [profileId]: { x: clampedX, y: clampedY }
        }));
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      if (wasDragRef.current) {
        toast.success("Card position saved for this session");
        setDraggedProfile(null);
      }
      
      dragStartRef.current = null;
      // Reset drag flag after a brief delay to allow click handler to check it
      setTimeout(() => {
        wasDragRef.current = false;
      }, 10);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
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
              Edit Card
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
        width: `${getCanvasSize().width}px`,
        height: `${getCanvasSize().height}px`
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
            onTouchStart={(e) => handleTouchStart(e, profile.id)}
          >
              <div className="card-content flex flex-col items-center gap-3" onClick={() => {
                if (!wasDragRef.current) {
                  handleCardClick(profile);
                }
              }}>
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
                      Edit Card
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