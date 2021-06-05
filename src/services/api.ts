import axios from "axios";

const domain = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000'
  : 'https://ignews-cyan.vercel.app';

export const api = axios.create({
  baseURL: `${domain}/api`,
});