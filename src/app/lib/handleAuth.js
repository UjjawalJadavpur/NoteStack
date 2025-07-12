import { login, register } from "./auth";
import { saveTokenToStore } from "../utils/authUtils";
import { TOKEN_KEY } from "../utils/constants";

export async function handleAuth(mode, formData, router, setError) {
  try {
    const res =
      mode === "login"
        ? await login(formData)
        : await register(formData);

    const token = res.token;
    localStorage.setItem(TOKEN_KEY, token);

    saveTokenToStore(token);
    router.push("/dashboard");
  } catch (err) {
    setError(err.message);
  }
}
