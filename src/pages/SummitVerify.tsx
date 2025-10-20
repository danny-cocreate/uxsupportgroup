// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const SummitVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setErrorMessage('No verification token provided');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('verify-magic-link', {
        body: { token }
      });

      if (error) throw error;

      if (data.valid) {
        // Store email in sessionStorage
        sessionStorage.setItem('summit_user_email', data.email);
        
        // If user has existing profile, store userId and redirect to wall
        if (data.hasProfile && data.userId) {
          sessionStorage.setItem('summit_user_id', data.userId);
          toast.success('Successfully logged in!');
          setStatus('success');
          setTimeout(() => navigate('/summit-profiles'), 1500);
        } else {
          // New user - redirect to create profile
          toast.success('Welcome! Please create your profile.');
          setStatus('success');
          setTimeout(() => navigate('/summit-profiles?createProfile=true'), 1500);
        }
      } else {
        setStatus('error');
        if (data.reason === 'expired') {
          setErrorMessage('This magic link has expired. Please request a new one.');
        } else if (data.reason === 'invalid') {
          setErrorMessage('This magic link is invalid or has already been used.');
        } else {
          setErrorMessage('Unable to verify magic link.');
        }
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      setStatus('error');
      setErrorMessage('An error occurred while verifying your magic link.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B5CF6] mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Verifying...</h2>
            <p className="text-[#6B7280]">Please wait while we verify your magic link.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Verified!</h2>
            <p className="text-[#6B7280]">Redirecting you now...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Verification Failed</h2>
            <p className="text-[#EF4444] mb-6">{errorMessage}</p>
            <Button 
              onClick={() => navigate('/summit-profiles')}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-90"
            >
              Return to Summit Profiles
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SummitVerify;
