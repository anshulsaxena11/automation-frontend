import axiosInstance from "../axiosconfig";


export const postPerseonlData = async (payload) => {
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      if (key !== 'workOrder') {
        formData.append(key, payload[key]);
      }
    });
    formData.append('file', payload.workOrder);
  
 
    return await axiosInstance.post('/user/perseonalDetails', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    });
  };

  export const getProjectNameList = async () => await axiosInstance.get('/user/projectName').then(response => response.data).catch(error => { console.error('Error fetching device list:', error); throw error; });
  export const getProjectTypeList = async (id) => await axiosInstance.get(`/user/project/${id}`).then(response => response.data).catch(error => { throw error });
