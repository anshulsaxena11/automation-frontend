import axiosInstance from "../axiosconfig";

export const postProjectTypeList = async(payload)=> await axiosInstance.post('/user/ProjectTypeList-Post',payload)
export const getProjectTypeList = async () => await axiosInstance.get('/user/ProjectTypeList').then(response => response.data).catch(error => { console.error('Error fetching device list:', error); throw error; });