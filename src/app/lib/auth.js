import { TOKEN_KEY } from "../utils/constants";
import api from "./api";


export async function login({ email, password }) {
  try {
    const res = await api.post("/auth/login", { email, password });
    console.log("API Response:", res.data); 
    localStorage.setItem(TOKEN_KEY, res.data.token);
    return res.data;
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      throw new Error("Invalid email or password");
    }
    throw new Error("Login failed. Please try again later.");
  }
}

export async function register({ name, email, password }) {
  try {
    const res = await api.post("/auth/register", { name, email, password });
    localStorage.setItem(TOKEN_KEY, res.data.token);
    return res.data;
  } catch (err) {
    if (err.response?.status === 400) {
      const message = err.response?.data?.message || "Invalid request";
      throw new Error(message);
    }
    throw new Error("Registration failed. Please try again.");
  }
}
