import api from "../../lib/axiosInterceptor";
import { AcceptButton, TextButton } from "../buttons/Button";
import styles from "./forms.module.css";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const LoginForm = ({ setActivePage }) => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginBtn = async () => {
    if (email === "" || password === "") {
      setError("Należy wypełnić wszystkie pola formularza");
      toast.error("Należy wypełnić wszystkie pola formularza");
      return;
    }

    const loginDto = {
      email,
      password,
    };

    try {
      const response = await api.post("/accounts/login", loginDto);
      localStorage.setItem("jwt", response.data.token);
      localStorage.setItem("accountId", response.data.accountId);
      toast.success("Zalogowano pomyślnie!");
      navigate("/dashboard");
    } catch (e) {
      setError("Błąd logowania");
      toast.error("Błąd logowania");
    }
  };

  return (
    <div className={styles.content}>
      <h1>Logowanie.</h1>
      {error && <p className={styles.error}>{error}</p>}
      <label>
        Podaj email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Podaj hasło
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <p>
        Nie masz jeszcze konta?{" "}
        <TextButton
          label="Zarejestruj się!"
          onClick={() => setActivePage("registration")}
        />
      </p>
      <AcceptButton label="Zaloguj się" onClick={handleLoginBtn} />
    </div>
  );
};
