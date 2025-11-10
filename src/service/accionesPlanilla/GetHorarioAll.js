// import axiosInstanceJava from "../api/AxiosInstanceJava";

import axiosInstance from "../../api/AxiosInstance";

export const GetHorariosAll = async () => {
  const response = await axiosInstance.get("/horariosAll");
  return response.data.data;
};
