import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  height?: number;
  width?: number;
}

const BackOfficeLogo: React.FC<LogoProps> = ({ 
  className = "h-12 w-auto mx-auto", 
  height = 48
}) => {
  // First try with img tag
  const [imageError, setImageError] = React.useState(false);
  const [fallbackError, setFallbackError] = React.useState(false);
  const [secondFallbackError, setSecondFallbackError] = React.useState(false);

  if (imageError && fallbackError && secondFallbackError) {
    // Final fallback: Text-based logo
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-2xl font-bold text-primary">
          <span className="text-green-600">PayLater</span>
          <span className="text-blue-600">Hub</span>
        </div>
      </div>
    );
  }

  if (imageError && fallbackError) {
    // Third attempt: Try logo2
    return (
      <Image
        src="/branding/backoffice-logo2.svg"
        alt="PayLaterHub Back Office"
        width={180}
        height={height}
        className={className}
        onError={() => setSecondFallbackError(true)}
        priority
      />
    );
  }

  if (imageError) {
    // Second attempt: Try clean version
    return (
      <Image
        src="/branding/backoffice-logo-clean.svg"
        alt="PayLaterHub Back Office"
        width={180}
        height={height}
        className={className}
        onError={() => setFallbackError(true)}
        priority
      />
    );
  }

  // First attempt: Try logo3
  return (
    <Image
      src="/branding/backoffice-logo3.svg"
      alt="PayLaterHub Back Office"
      width={180}
      height={height}
      className={className}
      onError={() => setImageError(true)}
      priority
    />
  );
};

export default BackOfficeLogo;
