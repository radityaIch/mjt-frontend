import axios from "axios";
import { config } from "./config";

export const getAllContacts = async () => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/contact`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const getContactById = async (id) => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/contact/${id}`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const addContact = (payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/contact/create`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const updateContact = (id, payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/contact/update/${id}`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const deleteContact = (id) => {
  try {
    const res = axios.get(
      `https://service.mjt-tlpartner.com/api/contact/delete/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};
