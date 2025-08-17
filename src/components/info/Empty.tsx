import Link from 'next/link';
import { ReactNode } from 'react';

const EmptyComponent = ({
  icon,
  style,
  text,
  buttonText,
  href,
}: {
  icon: ReactNode;

  style?: string | undefined;
  text: string;
  buttonText?: string;
  href?: string | undefined;
}) => {
  return (
    <div className={`flex flex-col items-center mt-9 ${style}`}>
      <div className="w-24 h-24 mb-6 rounded-full bg-blue-gray-50 flex justify-center items-center text-blue-gray-300">
        {icon}
      </div>
      <p className="text-text-placeholder text-center">{text}</p>
      {buttonText && (
        <Link
          href={href ?? ''}
          className="bg-primary flex items-center px-9 md:px-12 h-10 md:h-11 mt-5 rounded-md text-white text-sm md:text-base font-medium hover:opacity-90"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
};
export default EmptyComponent;
