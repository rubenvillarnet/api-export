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
    const { page, limit, sort = '-register_date', token } = data;
    let query = '?';
    let devsData;
    if (page) {
      query += `&page=${page}`;
    }
    if (limit) {
      if (limit === -1) {
        query += `&all=true`;
      } else {
        query += `&limit=${limit}`;
      }
    }
    console.log(sort);
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
