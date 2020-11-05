import axios from 'axios';
import { errorHandler, addAuth } from './utils';

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/devs`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

class Devs {
  getDevs = async (data) => {
    const { page, limit, sortString: sort, token } = data;
    let query = '?';
    let devsData;
    if (page) {
      query += `&page=${page + 1}`;
    }
    if (limit) {
      if (limit === -1) {
        query += `&all=true`;
      } else {
        query += `&limit=${limit}`;
      }
    }
    if (sort) {
      query += `&sort=${sort}`;
    }
    try {
      devsData = await instance.get(`/${query}`, addAuth(token));
    } catch (error) {
      errorHandler(error);
    }
    return devsData;
  };
}

export default Devs;
