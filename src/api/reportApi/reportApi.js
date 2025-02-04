import axiosInstance from '../axiosconfig'

export const postReport = async (payload) => await axiosInstance.post('/user/report', payload, { headers: { 'Content-Type': 'multipart/form-data' } });