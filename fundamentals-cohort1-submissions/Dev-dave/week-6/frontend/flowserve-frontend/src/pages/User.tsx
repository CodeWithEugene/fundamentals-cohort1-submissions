import AddUserForm from "../components/AddUserForm";
import UserList from "../components/UserList";

const Users = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        FlowServe Users 💼
      </h1>
      <AddUserForm />
      <UserList />
    </div>
  );
};

export default Users;
