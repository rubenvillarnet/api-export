import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { setCookie } from 'nookies';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import AuthService from '../services/Auth';
import { useDispatchAuth } from '../components/AuthStore';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://termoweb.es/es/'>
        Termoweb
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    position: 'relative'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  }
}));

export default function Login() {
  const classes = useStyles();
  const { register, handleSubmit, errors, reset } = useForm();
  const authService = new AuthService();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const router = useRouter();
  const dispatch = useDispatchAuth();

  const handleCloseDialog = () => {
    setLoginError(false);
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userData = await authService.login(data);
      dispatch({
        type: 'LOGIN',
        payload: userData.data.token
      });
      if (data.remember) {
        setCookie({}, 'token', userData.data.token, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/'
        });
      }
      router.push('/');
    } catch (error) {
      console.log(error);
      setLoginError(true);
    }
    setLoading(false);
  };

  return (
    <Container component='main' maxWidth='xs' className={classes.container}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Iniciar sesión
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant='outlined'
            margin='normal'
            fullWidth
            id='user'
            label='Usuario'
            name='user'
            autoFocus
            inputRef={register({
              required: true
            })}
            error={!!errors.user}
            helperText={errors.user && 'Introduce un nombre de usuario'}
            disabled={loading}
          />
          <TextField
            variant='outlined'
            margin='normal'
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            inputRef={register({
              required: true
            })}
            error={!!errors.password}
            helperText={errors.password && 'Introduce una contraseña'}
            disabled={loading}
          />
          <FormControlLabel
            control={<Checkbox value='remember' color='primary' />}
            label='Recuérdame'
            inputRef={register}
            name='remember'
            disabled={loading}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Iniciar sesión
          </Button>
          {loading && (
            <div className={classes.loader}>
              <CircularProgress />
            </div>
          )}
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      <Dialog open={loginError} onClose={handleCloseDialog}>
        <DialogTitle>Credenciales incorrectas</DialogTitle>
        <DialogContent>
          <DialogContentText>
            El usuario o la contraseña no son correctos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
