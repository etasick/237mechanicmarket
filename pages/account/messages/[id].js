// pages/account/messages/[id].js
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getMessage } from '@/graphql/queries';
import { generateClient } from 'aws-amplify/api';
import Link from 'next/link';

const client = generateClient();

export default function MessageDetail() {
  const params = useParams();
  const { id } = params;
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const result = await client.graphql({
          query: getMessage,
          variables: { id },
        });
        setMessage(result.data.getMessage);
      } catch (err) {
        console.error('Error fetching message:', err);
      }
    };

    if (id) fetchMessage();
  }, [id]);

  if (!message) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <Link href="/account/messages" className="text-blue-400 hover:underline">← Back to Messages</Link>
      <h1 className="text-2xl font-bold mt-4 mb-2">Message from {message.senderName}</h1>
      <p className="text-sm text-gray-400">Sent: {new Date(message.createdAt).toLocaleString()}</p>
      <div className="mt-4 space-y-2">
        <p><strong>Email:</strong> {message.senderEmail}</p>
        <p><strong>Phone:</strong> {message.senderPhone}</p>
        <p className="mt-4"><strong>Message:</strong></p>
        <div className="bg-gray-800 p-4 rounded border border-gray-700 text-gray-200">
          {message.messageText}
        </div>
      </div>
    </div>
  );
}
