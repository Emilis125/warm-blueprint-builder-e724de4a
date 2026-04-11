import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, type ReactNode } from 'react';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: '/login' });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(10,132,255,0.3)', borderTopColor: '#0A84FF' }} />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
