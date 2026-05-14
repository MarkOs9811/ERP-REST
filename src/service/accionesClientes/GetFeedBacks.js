import axiosInstance from "../../api/AxiosInstance";

export const GetFeedBacks = async (page = 1) => {
  const response = await axiosInstance.get(`/feedbacks?page=${page}`);
  return response.data;
};

export const GetFeedBackIndicadores = async () => {
  const response = await axiosInstance.get(`/feedbacks/indicadores`);
  return response.data;
};
