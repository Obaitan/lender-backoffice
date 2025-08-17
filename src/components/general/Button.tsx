import { ReactNode } from 'react';

export const Button = ({
  className,
  onClick,
  disabled,
  children,
  type,
}: {
  children: ReactNode;
  className?: string;
  onClick?: (() => void) | undefined;
  disabled?: boolean | undefined;
  type?: 'button' | 'submit' | 'reset' | undefined;
}) => {
  return (
    <button
      type={type ? type : 'button'}
      className={`rounded-md w-full py-2.5 text-white md:text-[17px] font-medium hover:opacity-90 focus:outline-0 active:opacity-90 disabled:bg-disabled disabled:cursor-not-allowed cursor-pointer ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
