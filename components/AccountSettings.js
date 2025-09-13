import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useTranslations } from 'next-intl';

export default function AccountSettings({ user }) {
  const t = useTranslations('AccountSettings');
  
  const [displayName, setDisplayName] = useState(user?.attributes?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.attributes?.phone_number || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      await Auth.updateUserAttributes(user, {
        name: displayName,
        phone_number: phoneNumber,
      });
      setMessage(t('profileUpdateSuccess'));
    } catch (err) {
      console.error(err);
      setMessage(t('profileUpdateError'));
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      await Auth.changePassword(user, currentPassword, newPassword);
      setMessage(t('passwordChangeSuccess'));
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      console.error(err);
      setMessage(t('passwordChangeError'));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-2xl font-semibold">{t('title')}</h2>

      {message && <div className="p-3 bg-gray-100 border rounded">{message}</div>}

      <div>
        <label className="block font-medium mb-1">{t('displayName')}</label>
        <input
          type="text"
          className="border rounded w-full p-2"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">{t('phoneNumber')}</label>
        <input
          type="tel"
          className="border rounded w-full p-2"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <button
        onClick={handleProfileUpdate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? t('saving') : t('saveProfile')}
      </button>

      <hr />

      <div>
        <label className="block font-medium mb-1">{t('currentPassword')}</label>
        <input
          type="password"
          className="border rounded w-full p-2"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">{t('newPassword')}</label>
        <input
          type="password"
          className="border rounded w-full p-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <button
        onClick={handleChangePassword}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? t('changing') : t('changePassword')}
      </button>
    </div>
  );
}