// src/api.js
import axios from "axios";
import { backend_url } from "./config";

export default axios.create({
  baseURL: backend_url,
  withCredentials: true,
});
