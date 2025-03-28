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

  if (loading)
    return <div className="text-center p-4">Ładowanie transakcji...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <>
      <ApplicationBar />
      <div className="flex flex-col flex-1 mt-[200px] justify-center items-center p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-6">
          <h1 className="text-2xl font-bold text-center">Moje transakcje</h1>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center text-gray-500">
                Brak transakcji do wyświetlenia.
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border-b border-gray-200 p-4 last:border-none flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{transaction.transactionType}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.currencyCode}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {transaction.currencyValue} {transaction.currencyCode}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(
                        new Date(transaction.dateTime),
                        "yyyy-MM-dd HH:mm"
                      )}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
