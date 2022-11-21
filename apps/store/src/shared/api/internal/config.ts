import axios from 'axios';
import { createHttp } from 'effector-http-api';
import { appConfig } from '@steklo24/config/app';

const instance = axios.create({
  baseURL: appConfig.APIBaseURL,
  withCredentials: true, // use it with proxy
});

const http = createHttp(instance);

export { http };
