import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '', role: 'user' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { getAllUsers } = await import('../services/api');
      const result = await getAllUsers();
      setUsers(result.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const { createUserAdmin } = await import('../services/api');
      await createUserAdmin(newUser);
      setNewUser({ email: '', password: '', name: '', role: 'user' });
      setShowCreateForm(false);
      loadUsers();
      alert('✅ User created successfully');
    } catch (error) {
      alert('❌ Failed to create user');
    }
  };

  const handleStatusChange = async (userId, status) => {
    try {
      const { updateUserStatus } = await import('../services/api');
      await updateUserStatus(userId, { status });
      loadUsers();
      alert(`✅ User ${status === 'suspended' ? 'suspended' : 'activated'}`);
    } catch (error) {
      alert('❌ Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const { deleteUserAdmin } = await import('../services/api');
      await deleteUserAdmin(userId);
      loadUsers();
      alert('✅ User deleted successfully');
    } catch (error) {
      alert('❌ Failed to delete user');
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3>👥 User Management</h3>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create User'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h4>Create New User</h4>
          <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              required
              style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              required
              style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
            <input
              type="text"
              placeholder="Full Name"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              required
              style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              Create User
            </button>
          </form>
        </div>
      )}

      <div className="grid">
        {users.map(user => (
          <div key={user.id} className="card">
            <h4>{user.name}</h4>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> <span className={`status ${user.role === 'admin' ? 'succeeded' : 'active'}`}>{user.role}</span></p>
            <p><strong>Balance:</strong> ₦{(user.balance / 100).toLocaleString()}</p>
            <p><strong>Last Login:</strong> {new Date(user.lastLogin * 1000).toLocaleDateString()}</p>
            
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button 
                className="btn btn-ghost"
                onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'suspended' : 'active')}
              >
                {user.status === 'active' ? 'Suspend' : 'Activate'}
              </button>
              <button 
                className="btn btn-ghost"
                onClick={() => handleDeleteUser(user.id)}
                style={{ color: '#dc3545' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;