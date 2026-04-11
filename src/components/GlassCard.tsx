import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'hero' | 'pill';
  onClick?: () => void;
}

export function GlassCard({ children, className, variant = 'default', onClick }: GlassCardProps) {
  const base = variant === 'hero' ? 'glass-hero' : variant === 'pill' ? 'glass-pill' : 'glass';
  return (
    <div className={cn(base, 'p-5', className)} onClick={onClick}>
      {children}
    </div>
  );
}
