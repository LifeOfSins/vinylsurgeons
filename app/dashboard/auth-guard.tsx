"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ['/dashboard/sign-in', '/dashboard/sign-up', '/dashboard/otp'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Check current session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user && !isPublicRoute) {
          // No user found and not on a public route, redirect to login
          router.replace('/dashboard/sign-in');
          return;
        }
        
        if (session?.user && isPublicRoute) {
          // User is logged in but on a public route, redirect to dashboard
          router.replace('/dashboard');
          return;
        }
        
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error checking auth:', error);
        if (!isPublicRoute) {
          router.replace('/dashboard/sign-in');
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        if (!isPublicRoute) {
          router.replace('/dashboard/sign-in');
        }
      } else if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        if (isPublicRoute) {
          router.replace('/dashboard');
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router, pathname, isPublicRoute]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // For public routes, always render children
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For protected routes, only render if user is authenticated
  if (!user) {
    return null; // This prevents flash of content before redirect
  }

  return <>{children}</>;
}