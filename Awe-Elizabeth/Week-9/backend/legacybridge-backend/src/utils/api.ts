import axios from "axios";
import dotenv from 'dotenv'
import axiosRetry from "axios-retry";
dotenv.config()

const api = axios.create({
  baseURL: process.env.MOCKURL || 'http://localhost:5000/api/v1',
});

axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error)
  }
})

export default api