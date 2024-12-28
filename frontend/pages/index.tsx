import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Layout } from '../app/layout';
import { UserGrid } from '../components/UserGrid';
import { UserForm } from '../components/UserForm';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import { User } from '../types';
import { CircularProgress, Backdrop } from '@mui/material';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [mode, setMode] = useState<'list' | 'create' | 'edit' | 'delete'>('list');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data);
      toast.success('Users loaded successfully');
    } catch (error) {
      toast.error('Error loading users');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (userData: User) => {
    try {
      setLoading(true);
      switch (mode) {
        case 'create':
          await createUser(userData);
          toast.success('User created successfully');
          break;
        case 'edit':
          if (selectedUser?.id) {
            await updateUser(selectedUser.id, userData);
            toast.success('User updated successfully');
          }
          break;
        case 'delete':
          if (selectedUser?.id) {
            await deleteUser(selectedUser.id);
            toast.success('User deleted successfully');
          }
          break;
      }
      await loadUsers();
      setMode('list');
      setSelectedUser(null);
    } catch (error) {
      toast.error('Operation failed');
      console.error('Operation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {mode === 'list' ? (
        <UserGrid
          users={users}
          onNew={() => setMode('create')}
          onEdit={(user) => {
            setSelectedUser(user);
            setMode('edit');
          }}
          onDelete={(user) => {
            setSelectedUser(user);
            setMode('delete');
          }}
          onRefresh={loadUsers}
        />
      ) : (
        <UserForm
          user={selectedUser}
          mode={mode}
          onSubmit={handleSubmit}
          onBack={() => setMode('list')}
        />
      )}

      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }}
        open={loading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Layout>
  );
}