import axios from "axios";
import { config } from "./config";

export const getAllArticles = async () => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/article`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const getArticleById = async (id) => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/article/${id}`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const addArticle = (payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/article/create`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const updateArticle = (id, payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/article/update/${id}`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const deleteArticle = (id) => {
  try {
    const res = axios.get(
      `https://service.mjt-tlpartner.com/api/article/delete/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const getAllArticleGallery = async () => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/articleGallery`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const getArticleGalleryById = async (id) => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/articleGallery/${id}`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const addArticleGallery = (payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/articleGallery/create`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const updateAllArticleGallery = (id, payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/articleGallery/update/article/${id}`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};
