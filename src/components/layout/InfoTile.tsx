import { ReactNode } from 'react';

const InfoTile = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="bg-secondary-100 h-9 rounded-t-md"></div>
      <div className="bg-white shadow-sm border border-gray-50 rounded-b-md p-4 md:p-5 mb-1">
        {children}
      </div>
    </>
  );
};

export default InfoTile;
