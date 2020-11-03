import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

class AuthService {
  errorHandler = async (e) => {
    console.error('AUTH API ERROR');
    console.error(e);
  };

  login = async (user) => {
    let userData;
    try {
      userData = await instance.post('/login', user);
    } catch (error) {
      this.errorHandler(error);
    }
    return userData;
  };
}

export default AuthService;
