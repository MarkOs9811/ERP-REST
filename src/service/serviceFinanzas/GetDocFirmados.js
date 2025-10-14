import axiosInstance from "../../api/AxiosInstance";

export const GetDocFirmados = async () => {
  const response = await axiosInstance.get("/getDocFirmados");
  return response.data.data;
};
