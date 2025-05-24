import api from "../../lib/axiosInterceptor";
import { AcceptButton } from "../buttons/Button";
import styles from "./subpages.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Account = () => {
  const navigate = useNavigate();

  const [account, setAccount] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem("accountId");
      if (!id) {
        setError("Błąd pobierania danych konta");
        setLoading(false);
        return;
      }
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        localStorage.removeItem("accountId");
        navigate("/");
      }
      try {
        const response = await api.get(`/accounts/${id}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setAccount(response.data);
      } catch (e) {
        setError("Błąd pobierania danych konta");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const renderSkeletons = () => (
    <ul className={styles.list}>
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="animate-pulse mb-2">
          <div className="h-4 bg-gray-300 rounded w-48 mb-1"></div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.subpage}>
      <div className={styles.content}>
        <h1>Twoje konto.</h1>
        {error && <p className={styles.error}>{error}</p>}
        {loading ? (
          renderSkeletons()
        ) : (
          <ul className={styles.list}>
            <li>
              <strong>Imię</strong> {account.firstName}
            </li>
            <li>
              <strong>Nazwisko</strong> {account.lastName}
            </li>
            <li>
              <strong>Email</strong> {account.email}
            </li>
          </ul>
        )}
        {!loading && <AcceptButton label="Edytuj" />}
      </div>
    </div>
  );
};
