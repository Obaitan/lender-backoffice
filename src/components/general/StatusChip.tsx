// import { StatusChipProps } from '@/types';

// const StatusChip = ({
//   label,
//   textColour,
//   bgColour,
//   style,
// }: StatusChipProps) => {
//   return <span>StatusChip</span>;
// };

// export default StatusChip;

import { StatusChipProps } from '@/types';
import clsx from 'clsx';

const statusStyles: StatusChipProps = {
  active: {
    textColour: 'text-success-500',
    bgColour: 'bg-success-50',
    label: 'Active',
  },
  suspended: {
    textColour: 'text-error-400',
    bgColour: 'bg-error-50',
    label: 'Suspended',
  },
  pending: {
    textColour: 'text-warning-400',
    bgColour: 'bg-warning-50',
    label: 'Pending',
  },
  reviewing: {
    textColour: 'text-warning-400',
    bgColour: 'bg-warning-50',
    label: 'Reviewing',
  },
  paidOff: {
    textColour: 'text-blue-500',
    bgColour: 'bg-blue-50',
    label: 'Paid Off',
  },
};

const StatusChip = ({ status }: { status: keyof typeof statusStyles }) => {
  const { textColour, bgColour, label } =
    statusStyles[status] || statusStyles.pending;

  return (
    <span
      className={clsx(
        'px-3 py-1 rounded-full text-xs font-semibold uppercase',
        textColour,
        bgColour
      )}
    >
      {label}
    </span>
  );
};

export default StatusChip;
