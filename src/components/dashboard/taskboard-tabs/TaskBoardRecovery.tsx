'use client';

import TileLink from '../TileLink';
import { TileItem } from '@/types';

const TaskBoardRecoveryComponent = ({ recoveryData }: { recoveryData: TileItem[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {recoveryData.map((item) => (
        <TileLink
          key={item.label}
          href={item.href}
          icon={item.icon}
          label={item.label}
          count={item.count}
          countDiff={item.countDiff}
          percentageDiff={item.percentageDiff}
        />
      ))}
    </div>
  );
};

export default TaskBoardRecoveryComponent;