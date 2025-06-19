import axiosInstance from "../axiosconfig";

/**
 * Submit tender tracking data with support for file uploads.
 * Automatically converts payload to FormData.
 */

export const postTenderTrackingData = async (payload) => {
  const formData = new FormData();

  Object.keys(payload).forEach((key) => {
    if (key !== 'tenderDocument') {
      formData.append(key, payload[key]);
    }
  });


  formData.append('file', payload.tenderDocument);

  try {
    const response = await axiosInstance.post('/user/TenderTrackingDetails', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error in submitting personal data:', error);
    if (error.response) {
      return error.response.data;
    } else {
      return {
        statusCode: 500,
        message: 'An error occurred while submitting the data.',
      };
    }
  }
};

// export const postTenderTrackingData = async (payload) => {
//   const formData = new FormData();

//   for (const key in payload) {
//     if (Object.prototype.hasOwnProperty.call(payload, key)) {
//       const value = payload[key];

//       if (value instanceof File || value instanceof Blob) {
//         formData.append(key, value);
//       } else if (value !== undefined && value !== null) {
//         formData.append(key, value);
//       }
//     }
//   }

//   try {
//     const response = await axiosInstance.post("/user/TenderTrackingDetails", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error in submitting tender tracking data:", error);
//     return error?.response?.data || {
//       statusCode: 500,
//       message: "An error occurred while submitting the data.",
//     };
//   }
// };

/**
 * Fetch tender details with pagination and search.
 */
export const getTenderDetailsList = async ({ page = 1, limit = 10, search = "" }) => {
  try {
    const response = await axiosInstance.get("/user/Tender", {
      params: { page, limit, search },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching tender details list:", error);
    return {
      data: [],
      total: 0,
      totalPages: 1,
      message: "Failed to fetch data.",
    };
  }
};

export const getEmpList = async()=> axiosInstance.get('/user/EmpListTF')

export const getTrackingById = async(id) => axiosInstance.get(`/user/tenderTracking/${id}`).then(response => response.data).catch(error => { throw error });

 export const updateTenderById = async (id, Payload, file) => {
    return await axiosInstance.put(`/user/tenderTracking/${id}`, Payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};
