import api from "../../lib/axiosInterceptor";
import { ApplicationBar } from "../bars/ApplicationBar";
import { CurrencySelector } from "../ui/CurrencySelect.jsx/CurrencySelector";
import styles from "./subpages.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const MyWallet = () => {
  const navigate = useNavigate();
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [specificLoading, setSpecificLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const getFlagEmoji = (currencyCode) => {
    const codePoints = currencyCode
      .slice(0, 2)
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const currencyOptions = [
    { code: "ALL", label: "Wszystkie waluty", value: null },
    { code: "PL", label: "PLN", value: "PLN" },
    { code: "US", label: "USD", value: "USD" },
    { code: "AU", label: "AUD", value: "AUD" },
    { code: "CA", label: "CAD", value: "CAD" },
    { code: "EU", label: "EUR", value: "EUR" },
    { code: "HU", label: "HUF", value: "HUF" },
    { code: "CH", label: "CHF", value: "CHF" },
    { code: "GB", label: "GBP", value: "GBP" },
    { code: "JP", label: "JPY", value: "JPY" },
    { code: "CZ", label: "CZK", value: "CZK" },
    { code: "DK", label: "DKK", value: "DKK" },
    { code: "NO", label: "NOK", value: "NOK" },
    { code: "SE", label: "SEK", value: "SEK" },
    { code: "UN", label: "XDR", value: "XDR" },
  ];

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
        setLoading(true);
        const response = await api.get(`/currencies/${id}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setCurrencies(response.data);
      } catch (e) {
        setError("Błąd pobierania walut");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, [navigate]);

  const renderSkeletons = () => {
    return (
      <ul className="space-y-4">
        <li>
          <ul className="space-y-4">
            <li className="flex items-center justify-between bg-gray-200 rounded-lg p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-300 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-20"></div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    );
  };

  return (
    <>
      <ApplicationBar />
      <div className="bg-gray-100 mt-[200px] py-6 px-4">
        <div className="flex flex-col items-center max-w-md mx-auto space-y-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
            <h1 className="text-2xl font-bold mb-4 text-center">
              Twój portfel
            </h1>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtruj walutę:
              </label>
              <CurrencySelector
                value={
                  selectedCurrency === null
                    ? currencyOptions[0]
                    : currencyOptions.find(
                        (opt) => opt.value === selectedCurrency?.value
                      )
                }
                onChange={(option) =>
                  setSelectedCurrency(option.value === null ? null : option)
                }
                options={currencyOptions}
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading ? (
              renderSkeletons()
            ) : (
              <ul className="space-y-4">
                {(selectedCurrency
                  ? currencies.filter(
                      (c) => c.currencyCode === selectedCurrency.value
                    )
                  : currencies
                ).length === 0 ? (
                  <li className="text-gray-500">
                    {selectedCurrency
                      ? "Nie masz tej waluty w portfelu"
                      : "Nie masz żadnych walut w portfelu"}
                  </li>
                ) : (
                  (selectedCurrency
                    ? currencies.filter(
                        (c) => c.currencyCode === selectedCurrency.value
                      )
                    : currencies
                  ).map((currency, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-50 shadow-sm rounded-lg p-4 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">
                          <span role="img" aria-label={currency.currencyCode}>
                            {getFlagEmoji(currency.currencyCode)}
                          </span>
                        </span>
                        <div>
                          <div className="text-lg font-semibold">
                            {currency.currencyCode}
                          </div>
                          <div className="text-sm text-gray-500">
                            {currency.currencyName || "Waluta"}
                          </div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-right">
                        {currency.currencyValue.toFixed(2)}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
