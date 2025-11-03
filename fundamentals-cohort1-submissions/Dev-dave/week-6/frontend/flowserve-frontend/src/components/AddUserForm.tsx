import { useState } from "react";
import api from "../lib/api";

const AddUserForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!name || !email) {
            setMessage("Please fill name and email");
            return;
        }

        setSubmitting(true);
        try{
            await api.post("/users", {name, email});
            setMessage("User added");
            setName("");
            setEmail("");
        } catch (error) {
            setMessage("Failed to add user");
        } finally {
            setSubmitting(false);
        }
        }
    

    return (
    <form onSubmit={handleSubmit}>
      <h2>Add New User</h2>

      <input
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add User"}
      </button>

      {message && <p>{message}</p>}
    </form>

    );
};

export default AddUserForm;