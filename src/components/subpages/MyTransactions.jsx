import api from "../../lib/axiosInterceptor";
import { ApplicationBar } from "../bars/ApplicationBar";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const MyTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      const id = localStorage.getItem("accountId");
      const jwt = localStorage.getItem("jwt");

      if (!id || !jwt) {
        navigate("/");
        return;
      }

      try {
        const response = await api.get(`/transactions/${id}/all`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        setTransactions(response.data);
      } catch (error) {
        toast.error("Błąd podczas pobierania transakcji");
        setError("Nie udało się załadować transakcji.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
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

  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <>
      <ApplicationBar />
      <div className="bg-gray-100 mt-[200px] py-6 px-4">
        <div className="flex flex-col items-center max-w-md mx-auto space-y-6">
          <h1 className="text-2xl font-bold mb-4">Moje transakcje</h1>
          <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
            {error && <div className="text-center text-red-500">{error}</div>}
            {loading ? (
              renderSkeletons()
            ) : transactions.length === 0 ? (
              <div className="text-center text-gray-500">
                Brak transakcji do wyświetlenia.
              </div>
            ) : (
              <ul className="space-y-4">
                {transactions.map((transaction) => (
                  <li
                    key={transaction.id}
                    className="flex justify-between items-center bg-gray-50 shadow-sm rounded-lg p-4 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">
                        {getFlagEmoji(transaction.currencyCode)}
                      </span>
                      <div>
                        <p
                          className={`text-md rounded-md font-semibold px-1  ${
                            transaction.transactionType === "DEPOSIT"
                              ? "bg-green-100 text-green-600"
                              : ""
                          }`}
                        >
                          {transaction.transactionType}
                        </p>
                        <p className="text-sm  text-gray-500">
                          {transaction.currencyCode}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        {transaction.currencyValue} {transaction.currencyCode}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(
                          new Date(transaction.dateTime),
                          "yyyy-MM-dd HH:mm"
                        )}
                      </p>
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
