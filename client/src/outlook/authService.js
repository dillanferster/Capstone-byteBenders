// authService.js
import { msalInstance, loginRequest } from "./authConfig";

export const signIn = async () => {
  try {
    const response = await msalInstance.loginPopup(loginRequest);
    return response.account;
  } catch (error) {
    console.error("Login error:", error);
  }
};

export const signOut = () => {
  msalInstance.logout();
};
