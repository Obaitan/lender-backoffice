import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const TileLink = ({
  href,
  icon,
  label,
  count,
  countDiff,
  percentageDiff,
}: {
  href: string;
  icon: string;
  label: string;
  count: number;
  countDiff: number;
  percentageDiff: number;
}) => {
  return (
    <Link href={href ?? '#'}>
      <div className="bg-white shadow-deep border border-[#f4f4f4] rounded-md px-6 pt-5 pb-4 hover:shadow-md transition-all duration-500">
        <div className="flex gap-5 justify-between items-center mb-3">
          <div className="flex gap-3">
            <Image
              src={icon}
              alt={`${label} icon`}
              height={24}
              width={24}
              priority
            />
            <p className="capitalize text-sm text-gray-400 font-medium">
              {label}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-gray-800 font-semibold text-[26px]">{count}</p>
          <div
            className={`flex gap-0.5 items-center text-[13px] ${
              countDiff > 0
                ? 'text-success-500'
                : countDiff === 0
                ? 'text-gray-600'
                : 'text-error-300'
            } `}
          >
            {countDiff > 0 ? (
              <ArrowUpIcon className="w-4 h-4" />
            ) : countDiff === 0 ? (
              <ArrowUpDownIcon className="w-4 h-4" />
            ) : (
              <ArrowDownIcon className="w-4 h-4" />
            )}
            <span>
              {percentageDiff.toLocaleString('en-US', {
                maximumFractionDigits: 0,
              })}
              %
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TileLink;
