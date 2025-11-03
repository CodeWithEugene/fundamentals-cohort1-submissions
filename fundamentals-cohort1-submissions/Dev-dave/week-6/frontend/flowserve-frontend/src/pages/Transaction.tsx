import AddTransactionForm from "../components/AddTransactionForm";
import TransactionList from "../components/TransactionList";

const Transactions = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-black-700">
        Transactions 💰
      </h1>
      <AddTransactionForm />
      <TransactionList />
    </div>
  );
};

export default Transactions;
