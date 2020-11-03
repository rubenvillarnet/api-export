import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { useDispatchAuth } from '../components/AuthStore';

export default function Index() {
  const dispatch = useDispatchAuth();


  const handleLogout = () => dispatch({ type: 'LOGOUT' });

  return (
    <Container maxWidth='sm'>
      <Box my={4}></Box>
    </Container>
  );
}
