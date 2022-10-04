import axios from "axios";
import { config } from "./config";

export const getAllTeam = async () => {
  try {
    const res = await axios.get(`https://service.mjt-tlpartner.com/api/team`);
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const getTeamById = async (id) => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/team/${id}`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const addTeam = (payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/team/create`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const updateTeam = (id, payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/team/update/${id}`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const deleteTeam = (id) => {
  try {
    const res = axios.get(
      `https://service.mjt-tlpartner.com/api/team/delete/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};
