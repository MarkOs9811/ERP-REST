import axiosInstance from "../../api/AxiosInstance";

export const GetCajas = async () => {
  const response = await axiosInstance.get("/cajasAll");
  console.log("Respuesta cajas:", response.data);

  return response.data.data;
};
