import axiosInstance from '../axiosconfig'

export const postReport = async (payload) => {
    const formData = new FormData();

    // Append non-file fields
    Object.keys(payload).forEach((key) => {
        if (key !== "proof") {
            const value = typeof payload[key] === "object" ? JSON.stringify(payload[key]) : payload[key];
            formData.append(key, value);
        }
    });

    // Append files one by one
    payload.proof.forEach((file, index) => { 
        if (file) {
            formData.append(`proof[${index}]`, file);
        }
    });

    // Send request with multipart/form-data
    return await axiosInstance.post("/user/report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const getReportList = async ({ page = 1, limit = 10, search = "", round="", devices="",projectType="",projectName="" }) => axiosInstance.get("/user/report", { params: { page, limit, search, round, devices, projectType, projectName } }).then(response => response.data);
export const getReportById = async (id) => await axiosInstance.get(`/user/report/${id}`).then(response => response.data).catch(error => { throw error });
export const updateReport = async (id, formData) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };
    
    return await axiosInstance.put(`/user/report/${id}`, formData, config);
};

export const getFullReport = async(projectName, projectType, round, devices) =>await axiosInstance.get('/user/fullreport',{
    params:{projectName, projectType, round, devices}
})

export const getVulListSpecific = async ({ projectName, projectType, round, devices, Name, ipAddress }) =>
  (await axiosInstance.get('/user/VulnerabilityListSpecific', {
    params: { projectName, projectType, round, devices, Name, ipAddress }
  })).data;

  export const deleteReportBYId = async(id)=>await axiosInstance.put(`/user/reportDeleted/${id}`).then(response => response.data).catch(error => { throw error });