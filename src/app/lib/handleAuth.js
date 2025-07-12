import { login, register } from "./auth";
import { parseJwt } from "../utils/parseJwt";
import { useAuthStore } from "../zustand/useAuthStore";
import { TOKEN_KEY } from "../utils/constants";


export async function handleAuth(mode, formData, router, setError) {
  try {
    const res =
      mode === "login"
        ? await login(formData)
        : await register(formData);

    const token = res.token;
    localStorage.setItem(TOKEN_KEY, token);

    const payload = parseJwt(token);
    const { setToken, setName, setEmail } = useAuthStore.getState();

    setToken(token);
    setName(payload.name);
    setEmail(payload.email);

    router.push("/dashboard");
  } catch (err) {
    setError(err.message);
  }
}
