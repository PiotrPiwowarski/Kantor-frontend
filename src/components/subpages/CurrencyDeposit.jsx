import api from "../../lib/axiosInterceptor";
import { ApplicationBar } from "../bars/ApplicationBar";
import { AcceptButton } from "../buttons/Button";
import { CurrencySelector } from "../ui/CurrencySelect.jsx/CurrencySelector";
import styles from "./subpages.module.css";
import axios from "axios";
import React, { useState } from "react";
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
    const jwt = localStorage.getItem("jwt");

    if (!id || !jwt) {
      navigate("/");
      return;
    }

    try {
      await api.post(
        "/currencies/deposit",
        {
          accountId: parseInt(id),
          currencyCode: selectedCurrency.value,
          currencyValue: parsedAmount,
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
                options={currencyOptions}
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
