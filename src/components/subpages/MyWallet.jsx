import api from "../../lib/axiosInterceptor";
import { ApplicationBar } from "../bars/ApplicationBar";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const MyWallet = () => {
  const navigate = useNavigate();
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrencies = async () => {
      const id = localStorage.getItem("accountId");
      if (!id) {
        setError("Błąd pobierania danych portfela");
        toast.error("Błąd pobierania danych portfela");
        setLoading(false);
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
      } catch (e) {
        toast.error("Błąd pobierania walut");
        setError("Błąd pobierania walut");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, [navigate]);

  const getFlagEmoji = (currencyCode) => {
    const codePoints = currencyCode
      .slice(0, 2)
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const renderSkeletons = () => (
    <ul className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <li
          key={index}
          className="animate-pulse flex justify-between items-center bg-gray-200 rounded-lg p-4"
        >
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
      ))}
    </ul>
  );

  return (
    <>
      <ApplicationBar />
      <div className="bg-gray-100 mt-[200px] py-6 px-4">
        <div className="flex flex-col items-center max-w-md mx-auto space-y-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
            <h1 className="text-2xl font-bold mb-4 text-center">
              Twój portfel
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading ? (
              renderSkeletons()
            ) : currencies.length === 0 && !error ? (
              <p className="text-gray-500">Brak walut w portfelu</p>
            ) : (
              <ul className="space-y-4">
                {currencies.map((currency, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-50 shadow-sm rounded-lg p-4 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">
                        {getFlagEmoji(currency.currencyCode)}
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
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
