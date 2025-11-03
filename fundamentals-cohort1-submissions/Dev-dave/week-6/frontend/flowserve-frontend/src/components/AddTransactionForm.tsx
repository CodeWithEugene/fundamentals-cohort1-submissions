import { useState } from "react";
import api from "../lib/api";

const AddTransactionForm = () => {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("deposit");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false); // show when sending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setMessage(""); 

    if (!userId || !amount) {
      setMessage("Please enter User ID and Amount");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/transactions", { userId: Number(userId), amount: Number(amount), type, });
    


      setMessage("Transaction successful!");
      setUserId("");
      setAmount("");
    } catch (error) {
      console.error("Transaction failed:", error);
      setMessage("Failed to process transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="my-4">
      <h2 className="text-xl font-bold mb-2">Simulate Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-2">
      <input
          className="border p-2 rounded w-full"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          disabled={submitting}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={submitting}
        />

        <select
          className="border p-2 rounded w-full"
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled={submitting}
        >
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
        </select>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Processing..." : "Submit"}
        </button>
      </form>

      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default AddTransactionForm;
