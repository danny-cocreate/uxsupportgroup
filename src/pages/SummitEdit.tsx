import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link, Upload, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Enrichment {
  id: string;
  type: 'link' | 'image';
  url: string;
  title: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
}

const SummitEdit = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    companyName: ''
  });
  const [enrichments, setEnrichments] = useState<Enrichment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userId = sessionStorage.getItem('summit_user_id');
      if (!userId) {
        navigate('/summit-profiles');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      setProfile(profileData);
      setFormData({
        name: profileData.name || '',
        jobTitle: profileData.job_title || '',
        companyName: profileData.company_name || ''
      });

      const { data: enrichmentsData, error: enrichmentsError } = await supabase
        .from('enrichments')
        .select('*')
        .eq('user_id', userId)
        .order('display_order', { ascending: true });

      if (enrichmentsError) throw enrichmentsError;

      setEnrichments((enrichmentsData || []) as Enrichment[]);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldBlur = async (field: 'name' | 'jobTitle' | 'companyName') => {
    // Validate required fields
    if (field === 'name' && !formData.name.trim()) {
      toast.error("Full Name is required and cannot be empty");
      loadProfile(); // Reload to restore previous value
      return;
    }
    
    if (field === 'jobTitle' && !formData.jobTitle.trim()) {
      toast.error("Job Title is required and cannot be empty");
      loadProfile(); // Reload to restore previous value
      return;
    }

    try {
      const updateData: any = {};
      
      if (field === 'name') {
        updateData.name = formData.name;
      } else if (field === 'jobTitle') {
        updateData.job_title = formData.jobTitle;
      } else if (field === 'companyName') {
        updateData.company_name = formData.companyName;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', profile.id);

      if (error) throw error;

      toast.success(`${field === 'name' ? 'Name' : field === 'jobTitle' ? 'Job title' : 'Company name'} updated`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Failed to update ${field}`);
    }
  };

  const handlePreview = () => {
    navigate(`/summit-profiles/wall?highlight=${profile.id}`);
  };

  const handleAddLink = async () => {
    if (enrichments.length >= 10) {
      toast.error("Maximum 10 enrichments allowed");
      return;
    }

    const url = prompt("Enter URL:");
    if (!url) return;

    try {
      const { data, error } = await supabase
        .from('enrichments')
        .insert({
          user_id: profile.id,
          type: 'link',
          url,
          title: url,
          display_order: enrichments.length
        })
        .select()
        .single();

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
      const { error } = await supabase
        .from('enrichments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEnrichments(enrichments.filter(e => e.id !== id));
      toast.success("Item deleted");
    } catch (error) {
      console.error('Error deleting enrichment:', error);
      toast.error("Failed to delete item");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B5CF6]"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1F2937]">Edit Your Profile Card</h1>
          <Button
            onClick={handlePreview}
            className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90"
          >
            Preview & Share
          </Button>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-36 h-36 rounded-lg bg-[#E5E7EB] flex items-center justify-center overflow-hidden">
                  {profile.profile_photo_url ? (
                    <img src={profile.profile_photo_url} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#9CA3AF] text-sm">Profile Photo</span>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
              </div>

              <div className="flex-1">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-[#1F2937] mb-2 block">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onBlur={() => handleFieldBlur('name')}
                      className="border-[#E5E7EB] focus:border-[#8B5CF6]"
                      placeholder="Sarah Chen"
                    />
                  </div>

                  <div>
                    <Label htmlFor="jobTitle" className="text-sm font-medium text-[#1F2937] mb-2 block">
                      Job Title *
                    </Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      onBlur={() => handleFieldBlur('jobTitle')}
                      className="border-[#E5E7EB] focus:border-[#8B5CF6]"
                      placeholder="Senior Product Designer"
                    />
                  </div>

                  <div>
                    <Label htmlFor="companyName" className="text-sm font-medium text-[#1F2937] mb-2 block">
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      onBlur={() => handleFieldBlur('companyName')}
                      className="border-[#E5E7EB] focus:border-[#8B5CF6]"
                      placeholder="TechCorp"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#1F2937]">Your Creations</h3>
              <Badge variant="secondary">
                {enrichments.length} / 10
              </Badge>
            </div>

            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleAddLink}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90"
              >
                <Link className="w-4 h-4 mr-2" />
                Add Link
              </Button>
              <Button
                onClick={() => toast.info("Upload feature coming soon")}
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </div>

            <div className="space-y-3">
              {enrichments.length === 0 ? (
                <p className="text-center text-[#9CA3AF] py-8">
                  No enrichments yet. Add links or images from the summit sessions.
                </p>
              ) : (
                enrichments.map((enrichment) => (
                  <Card key={enrichment.id} className="border border-[#E5E7EB]">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Badge variant="outline" className="uppercase text-xs">
                          {enrichment.type}
                        </Badge>
                        <span className="text-[#1F2937] truncate">
                          {enrichment.title || enrichment.url}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Pencil className="w-4 h-4 text-[#8B5CF6]" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteEnrichment(enrichment.id)}
                        >
                          <Trash2 className="w-4 h-4 text-[#EF4444]" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SummitEdit;
