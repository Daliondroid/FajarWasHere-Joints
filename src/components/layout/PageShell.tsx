import React from 'react';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  isBare?: boolean;
}

export default function PageShell({ children, className = '', isBare = false }: PageShellProps) {
  if (isBare) {
    return <div className={`w-full min-h-screen ${className}`}>{children}</div>;
  }

  return (
    <div
      className={`w-full max-w-[402px] mx-auto min-h-screen border-x-2 border-[#151D21] bg-[#F7F5F0] lg:max-w-none lg:border-x-0 lg:w-full ${className}`}
    >
      {children}
    </div>
  );
}
