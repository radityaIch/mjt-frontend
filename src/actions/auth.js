import { loginUserAccount } from "../api/AuthAPI";
import { toast } from "react-toastify";
import Notification from "../components/Notification/Notification";
import { notificationOptions } from "../components/utils/utils";
// import { getLoggedUser } from "../api/UserAPI";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

export function receiveLogin() {
  return {
    type: LOGIN_SUCCESS,
  };
}

function loginError(payload) {
  return {
    type: LOGIN_FAILURE,
    payload,
  };
}

function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
  };
}

export function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
  };
}

// logs the user out
export function logoutUser() {
  return (dispatch) => {
    dispatch(requestLogout());
    localStorage.removeItem("authenticated");
    localStorage.removeItem("level");
    localStorage.removeItem("userId");
    localStorage.removeItem("_token");
    dispatch(receiveLogout());
  };
}

export function loginUser(payload) {
  return async (dispatch) => {
    dispatch(receiveLogin());
    if (payload.creds.email.length > 0 && payload.creds.password.length > 0) {
      const res = await loginUserAccount(payload);
      console.log(res);
      if (res.status === 200) {
        localStorage.setItem("authenticated", true);
        localStorage.setItem("_token", "bearer " + res.data.access_token);
        payload.history.push("/dashboard");
        window.location.reload(false);
      } else {
        toast(
          <Notification type="error" message={res.data.message} withIcon />,
          notificationOptions
        );
      }
    } else {
      toast(
        <Notification
          type="warning"
          message="Email & password tidak boleh kosong!"
          withIcon
        />,
        notificationOptions
      );
      dispatch(loginError("Email & password tidak boleh kosong!"));
    }
  };
}
