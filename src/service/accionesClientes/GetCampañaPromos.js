import axiosInstance from "../../api/AxiosInstance";

export const GetCampañaPromos = async () => {
  const response = await axiosInstance.get("/campanasPromos");
  return response.data.data;
};
