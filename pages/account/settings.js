'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { getUser } from '@/src/graphql/queries';
import { updateUser } from '@/src/graphql/mutations';
import { Button } from '@aws-amplify/ui-react';

const client = generateClient();

export default function AccountSettingsPage() {
  const [form, setForm] = useState({ email: '', username: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getCurrentUser();
        const result = await client.graphql({
          query: getUser,
          variables: { id: user.userId },
        });
        const userData = result.data.getUser;
        setForm({ email: userData.email, username: userData.username });
      } catch (err) {
        console.error('Error loading user info:', err);
        setError('Could not load user information.');
      }
    };
    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const user = await getCurrentUser();
      await client.graphql({
        query: updateUser,
        variables: {
          input: {
            id: user.userId,
            email: form.email,
            username: form.username,
          },
        },
      });
      setSuccess(true);
    } catch (err) {
      console.error('Update failed:', err);
      setError('Update failed.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 text-white">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-400 mb-4">Profile updated successfully.</p>}

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
