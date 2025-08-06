import axiosInstance from "../../api/AxiosInstance";

export const GetCajas = async () => {
  const response = await axiosInstance.get("/cajasAll");
  return response.data.data;
};
