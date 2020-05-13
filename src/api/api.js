import axios from 'axios';

let base = 'http://localhost:3000/api';
export const requestLogin = params => { return axios.post(`${base}/auth/login/`, params).then(res => res.data); };