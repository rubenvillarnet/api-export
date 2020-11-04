import axios from 'axios';
import { errorHandler } from './utils';

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

class Auth {
  login = async (user) => {
    let userData;
    try {
      userData = await instance.post('/login', user);
    } catch (error) {
      errorHandler(error);
    }
    return userData;
  };
}

export default Auth;
