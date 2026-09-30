import axiosInstance from "../../api/AxiosInstance";

export const GetRoles = async () => {
  const response = await axiosInstance.get("/rolesAll");
  return response.data.data;
};
