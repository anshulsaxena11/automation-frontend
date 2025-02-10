import axiosInstance from "../axiosconfig";

export const postdirectrate = async(payload) => await axiosInstance.post('/user/directrate',payload);
export const getdirectrate = async() => await axiosInstance.get('/user/directrate')
