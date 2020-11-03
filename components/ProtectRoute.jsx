import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useAuth } from './AuthStore';

const ProtectRoute = ({ children }) => {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!auth && window.location.pathname !== '/login') {
      router.push('/login');
    }
  });
  return children;
};

export default ProtectRoute;
