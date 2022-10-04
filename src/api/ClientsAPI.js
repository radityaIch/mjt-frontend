import axios from "axios";
import { config } from "./config";

export const getAllClients = async () => {
  try {
    const res = await axios.get(`https://service.mjt-tlpartner.com/api/client`);
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const getClientById = async (id) => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/client/${id}`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const addClient = (payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/client/create`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const updateClient = (id, payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/client/update/${id}`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const deleteClient = (id) => {
  try {
    const res = axios.get(
      `https://service.mjt-tlpartner.com/api/client/delete/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};
