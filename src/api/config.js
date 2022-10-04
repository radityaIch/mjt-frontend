export const config = {
  headers: {
    Authorization: localStorage.getItem("_token"),
    "Content-Type": "multipart/form-data",
  },
};
