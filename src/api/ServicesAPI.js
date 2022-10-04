import axios from "axios";
import { config } from "./config";

export const getAllServices = async () => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/service`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const getServiceById = async (id) => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/service/${id}`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const addService = (payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/service/create`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const updateService = (id, payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/service/update/${id}`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const deleteService = (id) => {
  try {
    const res = axios.get(
      `https://service.mjt-tlpartner.com/api/service/delete/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const getAllServiceGallery = async () => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/serviceGallery`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const getServiceGalleryById = async (id) => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/serviceGallery/${id}`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const addServiceGallery = (payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/serviceGallery/create`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const updateServiceGallery = (id, payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/serviceGallery/update/${id}`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const deleteServiceGallery = (id) => {
  try {
    const res = axios.get(
      `https://service.mjt-tlpartner.com/api/serviceGallery/delete/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};
