import axiosInstance from '../axiosconfig'

export const getRoundList = async (projectName, projectType) => {
    return axiosInstance.get(`/user/round`, {
        params: { projectName, projectType },
    });
};

export const getAllRound = async () => await axiosInstance.get('/user/roundList')
export const postAddRound = async() => await axiosInstance.post('/user/roundList')
