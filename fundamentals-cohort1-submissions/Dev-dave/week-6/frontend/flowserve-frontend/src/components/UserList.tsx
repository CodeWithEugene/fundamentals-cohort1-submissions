import { useEffect, useState } from "react";
import api from "../lib/api";


interface Transaction {
  id: number;
  userId: number;
  amount: number;
  type: string;
  createdAt: string;
}


interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
  createdAt: string; 
  transactions?: Transaction[];
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []); 

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <div>
      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> ({user.email}) — Balance: ₦{user.balance}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
