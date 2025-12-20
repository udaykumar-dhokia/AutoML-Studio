import axios from "axios";

const operationsAxios = axios.create({
  baseURL: process.env.OPERATIONS_BACKEND_URL,
  withCredentials: true,
});

export default operationsAxios;
