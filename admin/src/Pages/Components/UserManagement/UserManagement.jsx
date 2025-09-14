import React, { useState, useEffect } from 'react';
import './UserManagement.css';
import { backend_url } from '../../config';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backend_url}/admin/users`, {
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      const response = await fetch(`${backend_url}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token')
        },
        body: JSON.stringify({ role })
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      // Update the user in the local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role } : user
      ));
      
      setSelectedUser(null);
      setNewRole('');
    } catch (err) {
      setError(err.message);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'super_admin':
        return 'role-badge super-admin';
      case 'admin':
        return 'role-badge admin';
      default:
        return 'role-badge user';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  if (loading) {
    return (
      <div className="user-management">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-management">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>User Management</h2>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={getRoleBadgeClass(user.role)}>
                    {getRoleDisplayName(user.role)}
                  </span>
                </td>
                <td>
                  <button 
                    className="edit-role-btn"
                    onClick={() => {
                      setSelectedUser(user);
                      setNewRole(user.role);
                    }}
                  >
                    Edit Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="role-modal-overlay">
          <div className="role-modal">
            <h3>Update Role for {selectedUser.name}</h3>
            <p>Current role: <span className={getRoleBadgeClass(selectedUser.role)}>
              {getRoleDisplayName(selectedUser.role)}
            </span></p>
            
            <div className="role-selection">
              <label>New Role:</label>
              <select 
                value={newRole} 
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setSelectedUser(null);
                  setNewRole('');
                }}
              >
                Cancel
              </button>
              <button 
                className="update-btn"
                onClick={() => updateUserRole(selectedUser._id, newRole)}
                disabled={newRole === selectedUser.role}
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
