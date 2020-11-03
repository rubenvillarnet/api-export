import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useAuth } from './AuthStore';

const ProtectRoute = ({ children }) => {
  const router = useRouter();
  const auth = useAuth();
  const { token, loading } = auth;

  useEffect(() => {
    if (!loading && !token && window.location.pathname !== '/login') {
      router.push('/login');
    }
  });
  return loading ? <CircularProgress /> : children;
};

export default ProtectRoute;
