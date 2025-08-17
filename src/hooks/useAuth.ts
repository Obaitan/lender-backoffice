import { getDummyUser } from '@/utils/dummyUser';

export const useAuth = () => {
  const user = getDummyUser();
  
  const logout = () => {
    // No-op for demo
    console.log('Logout called (demo mode)');
  };
  
  return {
    user,
    logout,
    isAuthenticated: true,
    isLoading: false
  };
};

export default useAuth;