'use client';
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SignOutButton() {
  const router = useRouter();
  const t = useTranslations('SignOut');

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out');
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      {t('signOut')}
    </button>
  );
}