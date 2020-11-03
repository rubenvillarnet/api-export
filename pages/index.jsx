import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from 'next/link';
import Button from '@material-ui/core/Button';

import { useAuth, useDispatchAuth } from '../components/AuthStore';

export default function Index() {
  const auth = useAuth();
  const dispatch = useDispatchAuth();

  const handleLogout = () => dispatch({ type: 'LOGOUT' });

  return (
    <Container maxWidth='sm'>
      <Box my={4}>
        <Typography variant='h4' component='h1' gutterBottom>
          Next.js example
        </Typography>
        <Link href='/login'>
          <Button>Ir a Login</Button>
        </Link>
        {auth ? <p>Logueado. Token: {auth}</p> : <p>No logueado</p>}
        {auth && (
          <Button color='secondary' variant='outlined' onClick={handleLogout}>
            Cerrar sesión
          </Button>
        )}
      </Box>
    </Container>
  );
}
