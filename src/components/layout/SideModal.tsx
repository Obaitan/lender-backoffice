import { SideModalProps } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const SideModal = ({ isOpen, onClose, children }: SideModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 z-top bg-black bg-opacity-60"
            onClick={onClose}
          ></div>
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className={`py-4 px-5 md:p-7 lg:px-8 bg-white z-40 fixed top-0 right-0 z-top w-full sm:w-11/12 md:w-[640px] lg:w-[720px] xl:w-[800px] h-full overflow-y-auto rounded-none sm:rounded-md shadow-xl ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <button
              onClick={onClose}
              className="bg-primary-50 absolute top-5 right-5 md:right-7 lg:right-8 flex items-center gap-0.5 text-[13px] py-1.5 px-2.5 rounded-full text-gray-600 hover:text-error-300 hover:bg-error-50 hover:bg-opacity-30"
            >
              <XMarkIcon className="h-4 w-4" /> Close
            </button>

            <div className="my-2">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SideModal;
