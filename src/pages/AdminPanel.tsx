// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, ArrowLeft, Shield, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  job_title: string | null;
  company_name: string | null;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [deleteProfileId, setDeleteProfileId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    checkAdminAndLoadProfiles();
  }, []);

  const checkAdminAndLoadProfiles = async () => {
    try {
      const userId = sessionStorage.getItem('summit_user_id');
      
      if (!userId) {
        toast.error("Please log in first");
        navigate('/summit-profiles');
        return;
      }

      // Check admin status via edge function (server-side validation)
      const { data: adminData, error: adminError } = await supabase.functions.invoke('check-admin', {
        body: { userId }
      });

      if (adminError || !adminData?.isAdmin) {
        toast.error("Access denied. Admin privileges required.");
        navigate('/summit-profiles');
        return;
      }

      setIsAdmin(true);

      // Load all user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, name, email, job_title, company_name')
        .order('name');

      if (profilesError) throw profilesError;

      setProfiles(profilesData || []);
    } catch (error) {
      console.error('Error loading admin panel:', error);
      toast.error("Failed to load admin panel");
      navigate('/summit-profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!deleteProfileId) return;

    try {
      const userId = sessionStorage.getItem('summit_user_id');
      const { data, error } = await supabase.functions.invoke('delete-profile', {
        body: { userId, profileId: deleteProfileId }
      });

      if (error) throw error;
      if (!data?.success) {
        throw new Error(data?.message || 'Delete failed');
      }

      toast.success("Profile deleted successfully");
      setProfiles(profiles.filter(p => p.id !== deleteProfileId));
      setDeleteProfileId(null);
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error("Failed to delete profile");
    }
  };

  const handleSyncEvents = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-events', {
        body: {}
      });

      if (error) throw error;

      toast.success(`Successfully synced ${data?.events?.length || 0} events from Google Sheets`);
    } catch (error) {
      console.error('Error syncing events:', error);
      toast.error("Failed to sync events from Google Sheets");
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B5CF6]"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/summit-profiles')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Wall
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#8B5CF6]" />
              <h1 className="text-3xl font-bold text-[#1F2937]">Admin Panel</h1>
            </div>
          </div>
          <Button
            onClick={handleSyncEvents}
            disabled={isSyncing}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Events'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-[#6B7280] mb-1">Total Profiles</p>
            <p className="text-3xl font-bold text-[#1F2937]">{profiles.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-[#6B7280] mb-1">With Job Title</p>
            <p className="text-3xl font-bold text-[#1F2937]">
              {profiles.filter(p => p.job_title).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-[#6B7280] mb-1">With Company</p>
            <p className="text-3xl font-bold text-[#1F2937]">
              {profiles.filter(p => p.company_name).length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-[#9CA3AF] py-8">
                    No profiles found
                  </TableCell>
                </TableRow>
              ) : (
                profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.name}</TableCell>
                    <TableCell className="text-[#6B7280]">{profile.email}</TableCell>
                    <TableCell className="text-[#6B7280]">
                      {profile.job_title || '—'}
                    </TableCell>
                    <TableCell className="text-[#6B7280]">
                      {profile.company_name || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteProfileId(profile.id)}
                        className="text-[#EF4444] hover:text-[#DC2626] hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProfileId} onOpenChange={(open) => !open && setDeleteProfileId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this profile? This action cannot be undone.
              All associated data (enrichments, photos) will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProfile}
              className="bg-[#EF4444] hover:bg-[#DC2626]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPanel;
