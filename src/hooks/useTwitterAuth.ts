import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { exchangeCodeForToken, getTwitterAuthUrl } from '@/services/twitterAuth';
import { toast } from 'react-hot-toast';

export const useTwitterAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(status === 'loading');

  useEffect(() => {
    setIsAuthenticated(!!(session as any)?.accessToken);
    setIsLoading(status === 'loading');
  }, [session, status]);

  useEffect(() => {
    const code = searchParams?.get('code');
    console.log('dsadsadsadsadsadsa', code);

    const handleAuth = async () => {
      if (code) {
        try {
          setIsLoading(true);
          const tokenData = await exchangeCodeForToken(code);
          const result = await signIn('credentials', {
            redirect: false,
            token: tokenData.access_token,
            callbackUrl: '/blackpink',
          });

          if (result?.error) {
            throw new Error(result.error);
          }

          router.push('/blackpink');
        } catch (error) {
          console.error('Authentication error:', error);
          toast.error('Failed to authenticate with Twitter');
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleAuth();
  }, [searchParams, router]);

  const handleLogin = useCallback(() => {
    window.location.href = getTwitterAuthUrl();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  }, [router]);

  return {
    isAuthenticated,
    isLoading,
    handleLogin,
    handleLogout,
  };
};
