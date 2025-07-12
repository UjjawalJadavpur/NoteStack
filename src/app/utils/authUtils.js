import { parseJwt } from "./parseJwt";
import { useAuthStore } from "../zustand/useAuthStore";

export function saveTokenToStore(token) {
  const payload = parseJwt(token);
  if (!payload) return;

  const { setToken, setName, setEmail } = useAuthStore.getState();
  setToken(token);
  if (payload.name) setName(payload.name);
  if (payload.email) setEmail(payload.email);
}
