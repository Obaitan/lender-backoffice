import { ReactNode } from 'react';
import { NavComponent } from '@/components/navigation/Nav';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <NavComponent />
      <div
        className="bg-white fixed top-[70px] bottom-0 left-0 z-50 xl:left-[221px] right-0 shadow-sm rounded-sm 
        flex flex-col overflow-hidden px-6"
      >
        <div className="shrink-0 h-8"></div>
        <div className="flex-1 overflow-y-auto scrollbar pr-1">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin w-8 h-8 text-secondary-200" />
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
        <div className="shrink-0 h-8"></div>
      </div>
    </div>
  );
}
