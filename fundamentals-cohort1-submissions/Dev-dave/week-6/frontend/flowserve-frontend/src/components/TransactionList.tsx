import { useEffect, useState } from "react";
import api from "../lib/api";


interface Transaction {
  id: number;
  userID: number;
  type: string;
  amount: number;
  createdAt: string;
  user?: {
    name: string;
  };
}

const TransactionList = () => {
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get<Transaction[]>("/transactions"); 
        setTransaction(res.data || []);
      } catch (error) {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);


  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <div>
      <h2>All Transactions</h2>

      {transaction.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <ul>
          {transaction.map((t) => (
            <li key={t.id}>
              <strong>{t.user?.name || "Unknown user"}</strong> — {t.type} ₦{t.amount} on{" "}
              {new Date(t.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;
