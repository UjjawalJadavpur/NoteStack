import { TOKEN_KEY } from "../utils/constants";
import { useAuthStore } from "../zustand/useAuthStore";

export function logout(router) {
  localStorage.removeItem(TOKEN_KEY);
  useAuthStore.getState().reset();  
  router.replace("/login");
}
