// File: /app/account/messages/page.jsx
"use client";
import { useEffect, useState } from "react";
import { listMessages } from "@/graphql/queries";
import { API } from "aws-amplify";
import Link from "next/link";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.graphql({ query: listMessages });
        setMessages(res.data.listMessages.items);
      } catch (err) {
        setError("Failed to fetch messages");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <div className="text-white">Loading messages...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl text-white font-bold mb-6">Message Inbox</h1>
      {messages.length === 0 ? (
        <p className="text-gray-400">No messages yet.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li key={msg.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-1">{msg.senderName}</h3>
                  <p className="text-gray-400 text-sm">{msg.senderEmail}</p>
                  <p className="text-sm text-gray-300 mt-2">{msg.messageText.slice(0, 80)}...</p>
                </div>
                <Link
                  href={`/account/messages/${msg.id}`}
                  className="text-blue-400 hover:underline"
                >
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
