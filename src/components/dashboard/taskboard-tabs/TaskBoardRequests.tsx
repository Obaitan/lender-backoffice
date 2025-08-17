'use client';

import TileLink from '../TileLink';
import { TileItem } from '@/types';

const TaskBoardRequests = ({ requests }: { requests: TileItem[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {requests.map((request) => (
        <TileLink
          key={request.label}
          href={request.href}
          icon={request.icon}
          label={request.label}
          count={request.count}
          countDiff={request.countDiff}
          percentageDiff={request.percentageDiff}
        />
      ))}
    </div>
  );
};

export default TaskBoardRequests;
