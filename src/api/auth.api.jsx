import api from "./axios";

export const loginApi = (email, password) => {
  return api.post("/Auth/login", { email, password });
};

export const refreshTokenApi = (refreshToken) => {
  return api.post(`/Auth/refresh?refreshToken=${refreshToken}`);
};

export const logoutApi = () => {
  return api.post("/Auth/logout");
};
