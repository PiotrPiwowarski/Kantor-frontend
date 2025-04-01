import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/axiosInterceptor";

export const WithdrawModal = ({ onClose, currencies, fetchCurrencies }) => {
  const navigate = useNavigate();
  const [jwt, setJwt] = useState("");
  const [accountId, setAccountId] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setJwt(localStorage.getItem("jwt") || "");
    setAccountId(localStorage.getItem("accountId") || "");

    if (currencies?.length > 0) {
      setSelectedCurrency({
        code: currencies[0].currencyCode,
        label: currencies[0].currencyCode,
        value: currencies[0].currencyCode,
      });
    } else {
      setSelectedCurrency({ code: "PLN", label: "PLN", value: "PLN" });
    }
  }, [currencies]);

  const handleWithdraw = async () => {
    setError("");

    if (!amount || !selectedCurrency) {
      setError("Proszę wypełnić wszystkie pola");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Nieprawidłowa kwota");
      return;
    }

    if (!accountId || !jwt) {
      navigate("/");
      return;
    }

    try {
      await api.post(
        "/currencies/withdrawal",
        {
          accountId: parseInt(accountId),
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

      fetchCurrencies();
      toast.success(`Wypłacono ${parsedAmount} ${selectedCurrency.value}`);
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.message || "Błąd podczas wypłaty");
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Wypłata środków</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="mb-4">
          <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-700">
            Kwota
          </label>
          <input
            id="withdraw-amount"
            type="number"
            placeholder="Wprowadź kwotę"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            min="0"
            step="0.01"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="currency-select" className="block text-sm font-medium text-gray-700">
            Wybierz walutę
          </label>
          <select
            id="currency-select"
            value={selectedCurrency?.value || ""}
            onChange={(e) =>
              setSelectedCurrency({
                code: e.target.value,
                label: e.target.value,
                value: e.target.value,
              })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            {currencies.map((currency, index) => (
              <option key={index} value={currency.currencyCode}>
                {currency.currencyCode}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
            Anuluj
          </button>
          <button onClick={handleWithdraw} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Wypłać
          </button>
        </div>
      </div>
    </div>
  );
};
