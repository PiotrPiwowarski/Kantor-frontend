import api from "../../lib/axiosInterceptor";
import { ApplicationBar } from "../bars/ApplicationBar";
import { CurrencySelector } from "../ui/CurrencySelect.jsx/CurrencySelector";
import styles from "./subpages.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const MyWallet = () => {
  const navigate = useNavigate();
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [specificLoading, setSpecificLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromCurrency, setFromCurrency] = useState({
    code: "PL",
    label: "PLN",
    value: "PLN",
  });
  const [toCurrency, setToCurrency] = useState({
    code: "EU",
    label: "EUR",
    value: "EUR",
  });
  const [exchangeAmount, setExchangeAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [exchangeResult, setExchangeResult] = useState(null);
  const [exchangeError, setExchangeError] = useState("");
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [accountBalances, setAccountBalances] = useState([]);

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

  // Funkcja do pobierania stanu portfela (do użycia po wymianie)
  const fetchCurrencies = async () => {
    const id = localStorage.getItem("accountId");
    if (!id) {
      setError("Błąd pobierania danych portfela");
      toast.error("Błąd pobierania danych portfela");
      return;
    }
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      localStorage.removeItem("accountId");
      navigate("/");
    }
    try {
      const response = await api.get(`/currencies/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setCurrencies(response.data);
      setAccountBalances(response.data);
    } catch (e) {
      setError("Błąd pobierania walut");
      toast.error("Błąd pobierania walut");
    }
  };

  // Funkcja pobierająca kurs wymiany
  const fetchExchangeRate = async (from, to) => {
    if (!from || !to || from === to) return null;
    try {
      // Przykład: pobierz kurs z endpointu /exchangerates lub innego, dostosuj do swojego API
      // Tu zakładamy, że kursy są już pobrane w currencies lub można pobrać osobno
      // Jeśli masz endpoint na kurs pary walutowej, użyj go tutaj
      // Poniżej uproszczony przykład:
      const jwt = localStorage.getItem("jwt");
      const response = await api.get("/exchangerates", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const rates = response.data[0]?.rates || [];
      if (from === "PLN") {
        // PLN -> inna waluta
        const found = rates.find((r) => r.code === to);
        return found ? 1 / found.ask : null;
      } else if (to === "PLN") {
        // inna waluta -> PLN
        const found = rates.find((r) => r.code === from);
        return found ? found.bid : null;
      } else {
        // inna waluta -> inna waluta
        const foundFrom = rates.find((r) => r.code === from);
        const foundTo = rates.find((r) => r.code === to);
        if (foundFrom && foundTo) {
          // Najpierw przelicz na PLN, potem na docelową
          return foundFrom.bid / foundTo.ask;
        }
        return null;
      }
    } catch (e) {
      return null;
    }
  };

  // Obsługa zmiany walut lub kwoty w modal
  useEffect(() => {
    setExchangeError("");
    setExchangeResult(null);
    if (
      !fromCurrency ||
      !toCurrency ||
      !exchangeAmount ||
      isNaN(Number(exchangeAmount)) ||
      Number(exchangeAmount) <= 0
    ) {
      setExchangeRate(null);
      return;
    }
    if (fromCurrency.value === toCurrency.value) {
      setExchangeError("Nie można wymienić tej samej waluty na siebie.");
      setExchangeRate(null);
      return;
    }
    const run = async () => {
      setExchangeLoading(true);
      const rate = await fetchExchangeRate(
        fromCurrency.value,
        toCurrency.value
      );
      setExchangeRate(rate);
      if (rate) {
        setExchangeResult(Number(exchangeAmount) * rate);
      } else {
        setExchangeResult(null);
      }
      setExchangeLoading(false);
    };
    run();
  }, [fromCurrency, toCurrency, exchangeAmount]);

  // Obsługa wymiany waluty
  const handleExchange = async () => {
    setExchangeError("");
    if (!fromCurrency || !toCurrency) {
      setExchangeError("Wybierz obie waluty.");
      return;
    }
    if (fromCurrency.value === toCurrency.value) {
      setExchangeError("Nie można wymienić tej samej waluty na siebie.");
      return;
    }
    if (
      !exchangeAmount ||
      isNaN(Number(exchangeAmount)) ||
      Number(exchangeAmount) <= 0
    ) {
      setExchangeError("Podaj poprawną kwotę.");
      return;
    }
    const saldo =
      accountBalances.find((c) => c.currencyCode === fromCurrency.value)
        ?.currencyValue || 0;
    if (Number(exchangeAmount) > saldo) {
      setExchangeError("Nie masz wystarczających środków na koncie.");
      return;
    }
    if (!exchangeRate) {
      setExchangeError("Brak kursu wymiany.");
      return;
    }
    try {
      const id = localStorage.getItem("accountId");
      const jwt = localStorage.getItem("jwt");
      await api.post(
        "/currencies/currencypurchase",
        {
          accountId: Number(id),
          fromCurrency: fromCurrency.value,
          toCurrency: toCurrency.value,
          currencyValue: Number(exchangeAmount),
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Wymiana zakończona sukcesem!");
      setIsModalOpen(false);
      setFromCurrency({ code: "PL", label: "PLN", value: "PLN" });
      setToCurrency({ code: "EU", label: "EUR", value: "EUR" });
      setExchangeAmount("");
      setExchangeRate(null);
      setExchangeResult(null);
      setExchangeError("");
      // Odśwież portfel po wymianie
      fetchCurrencies();
    } catch (e) {
      setExchangeError("Błąd podczas wymiany waluty.");
    }
  };

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

  useEffect(() => {
    fetchCurrencies();
  }, [navigate]);

  return (
    <>
      <ApplicationBar />
      <div className="bg-gray-100 mt-[200px] py-6 px-4">
        <div className="flex flex-col items-center max-w-md mx-auto space-y-6">
          <button
            className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            onClick={() => setIsModalOpen(true)}
          >
            Wymień walutę
          </button>
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
          {/* MODAL */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </button>
                <h2 className="text-xl font-bold mb-4">Wymiana waluty</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Z jakiej waluty?
                  </label>
                  <CurrencySelector
                    value={fromCurrency}
                    onChange={(option) => {
                      setFromCurrency(option);
                      // Jeśli nowa waluta to nie PLN, ustaw PLN jako docelową
                      if (option.value !== "PLN") {
                        setToCurrency({
                          code: "PL",
                          label: "PLN",
                          value: "PLN",
                        });
                      } else if (toCurrency.value === "PLN") {
                        setToCurrency({
                          code: "EU",
                          label: "EUR",
                          value: "EUR",
                        }); // domyślnie EUR
                      }
                    }}
                    options={[
                      { code: "PL", label: "PLN", value: "PLN" },
                      ...accountBalances
                        .filter((c) => c.currencyCode !== "PLN")
                        .map((c) => ({
                          code: c.currencyCode.slice(0, 2),
                          label: c.currencyCode,
                          value: c.currencyCode,
                        })),
                    ]}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Saldo:{" "}
                    {fromCurrency
                      ? accountBalances
                          .find((c) => c.currencyCode === fromCurrency.value)
                          ?.currencyValue?.toFixed(2) || 0
                      : "-"}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Na jaką walutę?
                  </label>
                  <CurrencySelector
                    value={toCurrency}
                    onChange={(option) => {
                      setToCurrency(option);
                      // Jeśli nowa waluta to nie PLN, ustaw PLN jako źródłową
                      if (option.value !== "PLN") {
                        setFromCurrency({
                          code: "PL",
                          label: "PLN",
                          value: "PLN",
                        });
                      } else if (fromCurrency.value === "PLN") {
                        setFromCurrency({
                          code: "EU",
                          label: "EUR",
                          value: "EUR",
                        }); // domyślnie EUR
                      }
                    }}
                    options={[
                      { code: "PL", label: "PLN", value: "PLN" },
                      { code: "US", label: "USD", value: "USD" },
                      { code: "EU", label: "EUR", value: "EUR" },
                      { code: "GB", label: "GBP", value: "GBP" },
                      { code: "CH", label: "CHF", value: "CHF" },
                      { code: "CA", label: "CAD", value: "CAD" },
                      { code: "AU", label: "AUD", value: "AUD" },
                      { code: "JP", label: "JPY", value: "JPY" },
                      { code: "HU", label: "HUF", value: "HUF" },
                      { code: "CZ", label: "CZK", value: "CZK" },
                      { code: "DK", label: "DKK", value: "DKK" },
                      { code: "NO", label: "NOK", value: "NOK" },
                      { code: "SE", label: "SEK", value: "SEK" },
                      { code: "UN", label: "XDR", value: "XDR" },
                    ].filter((opt) => opt.value !== fromCurrency.value)}
                  />
                </div>
                {/* Walidacja pary walutowej */}
                {fromCurrency &&
                  toCurrency &&
                  fromCurrency.value !== "PLN" &&
                  toCurrency.value !== "PLN" && (
                    <div className="text-red-500 mb-2 text-sm">
                      Jedna z walut musi być PLN!
                    </div>
                  )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kwota do wymiany
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded p-2"
                    min="0"
                    max={
                      fromCurrency
                        ? accountBalances.find(
                            (c) => c.currencyCode === fromCurrency.value
                          )?.currencyValue || 0
                        : undefined
                    }
                    value={exchangeAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      const saldo = fromCurrency
                        ? accountBalances.find(
                            (c) => c.currencyCode === fromCurrency.value
                          )?.currencyValue || 0
                        : 0;
                      if (val === "" || Number(val) <= saldo) {
                        setExchangeAmount(val);
                        setExchangeError("");
                      } else {
                        setExchangeError(
                          "Nie masz wystarczających środków na koncie."
                        );
                      }
                    }}
                  />
                </div>
                {exchangeLoading ? (
                  <div className="text-gray-500 mb-2">Ładowanie kursu...</div>
                ) : exchangeRate ? (
                  <div className="mb-2 text-sm text-gray-700">
                    Kurs:{" "}
                    <span className="font-semibold">
                      {exchangeRate.toFixed(4)}
                    </span>
                  </div>
                ) : null}
                {exchangeResult && (
                  <div className="mb-2 text-sm text-gray-700">
                    Otrzymasz:{" "}
                    <span className="font-semibold">
                      {exchangeResult.toFixed(2)} {toCurrency?.label}
                    </span>
                  </div>
                )}

                {exchangeError && (
                  <div className="text-red-500 mb-2 text-sm">
                    {exchangeError}
                  </div>
                )}
                <button
                  className="mt-2 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                  onClick={handleExchange}
                  disabled={exchangeLoading}
                >
                  Wymień
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
