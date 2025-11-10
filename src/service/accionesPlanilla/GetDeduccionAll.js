import axiosInstance from "../../api/AxiosInstance";

export const GetDeduccionAll = async () => {
  const response = await axiosInstance.get("/deduccionesAll");
  return response.data.data;
};
