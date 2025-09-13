import { useState, useEffect } from 'react';
import { client } from '@/lib/amplifyClient';
import { listMessages } from '@/src/graphql/queries';
import { updateMessage } from '@/src/graphql/mutations';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useTranslations } from 'next-intl';

export default function Messages() {
  const { user } = useAuthenticator();
  const t = useTranslations('Messages');
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchMessages = async () => {
    if (!user?.username) return;
    setLoading(true);

    try {
      const result = await client.graphql({
        query: listMessages,
        variables: {
          filter: { ownerId: { eq: user.username } },
          limit: 20,
        },
      });

      setMessages(result.data.listMessages.items);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (msgId) => {
    setUpdatingId(msgId);
    try {
      await client.graphql({
        query: updateMessage,
        variables: {
          input: {
            id: msgId,
            answered: true,
            answeredAt: new Date().toISOString(),
          },
        },
      });

      // update UI
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId ? { ...m, answered: true, answeredAt: new Date().toISOString() } : m
        )
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user?.username]);

  if (loading) return <p>{t('loading')}</p>;
  if (!messages.length) return <p className="text-gray-600">{t('noMessages')}</p>;

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`border p-4 rounded shadow-sm ${
            msg.answered ? 'bg-gray-100' : 'bg-white'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{msg.fromName} ({msg.fromEmail})</p>
              <p className="text-sm text-gray-500">
                {t('regarding')} {msg.listingTitle} — {new Date(msg.sentAt).toLocaleString()}
              </p>
            </div>
            {!msg.answered && (
              <button
                onClick={() => handleMarkAsRead(msg.id)}
                disabled={updatingId === msg.id}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {updatingId === msg.id ? t('marking') : t('markAsRead')}
              </button>
            )}
          </div>
          <p className="mt-3">{msg.body}</p>

          {msg.answered && (
            <p className="mt-2 text-xs text-gray-500">
              {t('markedAsRead')} {new Date(msg.answeredAt).toLocaleString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}