"use client";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'default' | 'primary' | 'white';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'default',
  className = "" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-4',
    xl: 'h-12 w-12 border-4'
  };

  const colorClasses = {
    default: 'border-zinc-600 border-t-zinc-400',
    primary: 'border-blue-600 border-t-blue-400',
    white: 'border-white/30 border-t-white'
  };

  return (
    <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`} />
  );
} 