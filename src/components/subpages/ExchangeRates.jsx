import api from "../../lib/axiosInterceptor";
import { ApplicationBar } from "../bars/ApplicationBar";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Flag from "react-world-flags";

export const ExchangeRates = () => {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExchangeRates = async () => {
      const jwt = localStorage.getItem("jwt");

      try {
        const response = await api.get("/exchangerates", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const rates = response.data[0]?.rates || [];
        const enrichedRates = rates.map((rate) => ({
          ...rate,
          effectiveDate: response.data[0]?.effectiveDate,
        }));
        setExchangeRates(enrichedRates);
      } catch (e) {
        toast.error("Błąd podczas pobierania kursów walut");
        setError("Błąd podczas pobierania kursów walut");
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  // Mapowanie kodów walut na kody państw ISO-3166 Alpha-2
  const getCountryCode = (currencyCode) => {
    const map = {
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
      XDR: "UN", // brak konkretnego kraju
    };
    return map[currencyCode] || "UN";
  };

  const renderSkeletons = () => (
    <ul className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <li
          key={index}
          className="animate-pulse flex justify-between items-center bg-gray-200 rounded-lg p-4"
        >
          <div className="w-24 h-4 bg-gray-300 rounded mb-2"></div>
          <div className="w-16 h-4 bg-gray-300 rounded"></div>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <ApplicationBar />
      <div className="bg-gray-100 min-h-screen py-6 mt-20 px-4">
        <div className="flex flex-col items-center max-w-xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold mb-4">Kursy walut</h1>
          <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
            {error && (
              <div className="text-center text-red-500 mb-4">{error}</div>
            )}
            {loading ? (
              renderSkeletons()
            ) : (
              <ul className="space-y-4">
                {exchangeRates.map((rate, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-50 shadow-sm rounded-lg p-4 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Flag
                        code={getCountryCode(rate.code)}
                        style={{ width: 25, height: 16 }}
                      />
                      <div>
                        <div className="text-lg font-semibold">
                          {rate.currency} ({rate.code})
                        </div>
                        <div className="text-sm text-gray-500">
                          Data: {rate.effectiveDate}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-md font-bold">
                        Sprzedaż: {rate.bid} PLN
                      </p>
                      <p className="text-md font-bold">Zakup: {rate.ask} PLN</p>
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
