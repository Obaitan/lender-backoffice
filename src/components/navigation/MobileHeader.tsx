import Image from 'next/image';
import Link from 'next/link';

const HeaderComponent = () => {
  const newMessaga = 1;

  return (
    <div className="bg-white h-12 shadow-sm fixed top-0 left-0 right-0 z-50 flex items-center px-6">
      <div className="flex justify-between items-center gap-5 w-full">
        <p className="hidden lg:block text-[18px] font-medium text-gray-800">
          Credit WorkMaster
        </p>

        <div className="flex items-center gap-4">
          <>
            {newMessaga ? (
              <div className="bg-[#f9f9f9] w-9 h-9 rounded-full border border-gray-50 flex justify-center items-center hover:bg-primary-50 cursor-pointer">
                <Image
                  src="/shapes/notification-new.svg"
                  alt="Icon"
                  width={24}
                  height={24}
                  priority
                />
              </div>
            ) : (
              <div className="bg-[#f9f9f9] w-9 h-9 rounded-full border border-gray-50 flex justify-center items-center hover:bg-primary-50 cursor-pointer">
                <Image
                  src="/shapes/notification.svg"
                  alt="Icon"
                  width={24}
                  height={24}
                  priority
                />
              </div>
            )}
          </>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5"
          >
            <div className="bg-gray-50 w-9 h-9 rounded-full flex justify-center items-center text-[22px] font-semibold">
              A
            </div>
            <div className="hidden md:block">
              <p className="text-xs text-gray-600 font-medium mb-0.5">
                Adeyemi Olayemi
              </p>
              <p className="text-[11px] text-gray-300">Role</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
