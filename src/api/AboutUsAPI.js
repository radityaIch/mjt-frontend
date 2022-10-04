import axios from "axios";
import { config } from "./config";

export const getAllAboutUs = async () => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/aboutUs`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const getAboutUsById = async (id) => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/aboutUs/${id}`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const addAboutUs = (payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/aboutUs/create`,
      payload,
      config
    );

    return res;
  } catch (error) {
    return error.response;
  }
};

export const updateAboutUs = (id, payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/aboutUs/update/${id}`,
      payload,
      config
    );

    return res;
  } catch (error) {
    return error.response;
  }
};

export const deleteAboutUs = (id) => {
  try {
    const res = axios.get(
      `https://service.mjt-tlpartner.com/api/aboutUs/delete/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const getAllMissions = async () => {
  try {
    const res = await axios.get(`https://service.mjt-tlpartner.com/api/misi`);
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const addMissions = (payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/misi/create`,
      payload,
      config
    );

    return res;
  } catch (error) {
    return error.response;
  }
};

export const updateAllMissions = (id, payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/misi/update/${id}`,
      payload,
      config
    );

    return res;
  } catch (error) {
    return error.response;
  }
};

export const deleteMission = (id) => {
  try {
    const res = axios.get(
      `https://service.mjt-tlpartner.com/api/misi/delete/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};
