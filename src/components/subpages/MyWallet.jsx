import api from "../../lib/axiosInterceptor";
import { ApplicationBar } from "../bars/ApplicationBar";
import styles from "./subpages.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const MyWallet = () => {
  const navigate = useNavigate();
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrencies = async () => {
      const id = localStorage.getItem("accountId");
      if (!id) {
        setError("Błąd pobierania danych portfela");
        return;
      }
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        localStorage.removeProperty("accountId");
        navigate("/");
      }
      try {
        const response = await api.get(`/currencies/${id}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setCurrencies(response.data);
      } catch (e) {
        setError("Błąd pobierania walut");
      }
    };

    fetchCurrencies();
  }, [navigate]);

  return (
    <>
      <ApplicationBar />
      <div className={styles.subpage}>
        <div className={styles.content}>
          <h1>Twój portfel</h1>
          {error && <p className={styles.error}>{error}</p>}
          {currencies.length === 0 && !error && <p>Brak walut w portfelu</p>}
          <ul className={styles.list}>
            {currencies.map((currency, index) => (
              <li key={index}>
                <strong>{currency.currencyCode}</strong>{" "}
                {currency.currencyValue.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
