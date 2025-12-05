import axiosInstance from "../../api/AxiosInstance";

export const GetNomina = async (periodo) => {
  try {
    const response = await axiosInstance.get(`/getPlanilla?periodo=${periodo}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
