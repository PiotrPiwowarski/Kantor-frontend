import api from "../../lib/axiosInterceptor";
import { ApplicationBar } from "../bars/ApplicationBar";
import { AcceptButton } from "../buttons/Button";
import { CurrencySelector } from "../ui/CurrencySelect.jsx/CurrencySelector";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const CurrencyDeposit = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState({
    code: "PL",
    label: "PLN",
    value: "PLN",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const jwt = localStorage.getItem("jwt");

  const [fetchedRates, setFetchedRates] = useState([]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await api.get("/exchangerates", {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data && response.data[0].rates) {
          // Mapowanie kodów walut na kody państw ISO-3166 Alpha-2
          const countryMap = {
            PLN: "PL",
            USD: "US",
            EUR: "EU",
            GBP: "GB",
            CHF: "CH",
            CAD: "CA",
            AUD: "AU",
            JPY: "JP",
            HUF: "HU",
            CZK: "CZ",
            DKK: "DK",
            NOK: "NO",
            SEK: "SE",
            XDR: "UN",
          };
          let newRates = response.data[0].rates.map((rate) => ({
            code: countryMap[rate.code] || "UN",
            label: rate.code,
            value: rate.code,
          }));
          // Dodaj PLN jeśli nie ma go w liście
          if (!newRates.some((opt) => opt.value === "PLN")) {
            newRates = [
              { code: "PL", label: "PLN", value: "PLN" },
              ...newRates,
            ];
          }
          setFetchedRates(newRates);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania walut:", error);
      }
    };

    fetchRates();
  }, []);

  const handleDeposit = async () => {
    if (!amount || !selectedCurrency) {
      setError("Proszę wypełnić wszystkie pola");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Nieprawidłowa kwota");
      return;
    }

    const id = localStorage.getItem("accountId");

    if (!id || !jwt) {
      navigate("/");
      return;
    }

    try {
      await api.post(
        "/currencies/deposit",
        {
          accountId: Number(id),
          currencyValue: Number(parsedAmount),
          currencyCode: selectedCurrency.value,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(`Wpłacono ${parsedAmount} ${selectedCurrency.value}`);
      setAmount("");
      setError("");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (e) {
      toast.error("Błąd podczas wpłaty");
      console.error(e);
    }
  };

  const currencyOptions = [
    { code: "PL", label: "PLN", value: "PLN" },
    { code: "US", label: "USD", value: "USD" },
    { code: "EU", label: "EUR", value: "EUR" },
    { code: "GB", label: "GBP", value: "GBP" },
  ];

  const finalCurrencyOptions =
    fetchedRates && fetchedRates.length > 0 ? fetchedRates : currencyOptions;

  return (
    <>
      <ApplicationBar />
      <div className="flex flex-1 justify-center h-screen flex-col items-center p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-6">
          <h1 className="text-2xl font-bold text-center">Wpłata środków</h1>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Kwota
              </label>
              <input
                id="amount"
                type="number"
                placeholder="Wprowadź kwotę"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full p-6 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Wybierz walutę
              </label>
              <CurrencySelector
                value={selectedCurrency || "Wybierz walutę"}
                onChange={setSelectedCurrency}
                options={finalCurrencyOptions}
              />
            </div>

            <div className="flex justify-center">
              <AcceptButton onClick={handleDeposit} label="Wpłać" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
