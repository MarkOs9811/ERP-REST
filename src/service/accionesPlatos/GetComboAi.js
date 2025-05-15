import axiosInstance from "../../api/AxiosInstance";

export const GetComboAi = async () => {
  const response = await axiosInstance.get("/combos/ia");
  return response.data.data;
};
