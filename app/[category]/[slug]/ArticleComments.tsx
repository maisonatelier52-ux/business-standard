'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CommentItem } from '@/lib/db';

interface Props {
  articleSlug: string;
  initialComments: CommentItem[];
}

export default function ArticleComments({ articleSlug, initialComments }: Props) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMsg({ type: 'error', text: 'You must be logged in to comment.' });
      return;
    }
    if (!content.trim()) {
      setMsg({ type: 'error', text: 'Please write a comment before submitting.' });
      return;
    }

    setSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleSlug, content }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setComments([data.comment, ...comments]);
        setContent('');
        setMsg({ type: 'success', text: 'Your comment has been posted successfully!' });
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to submit comment.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Error connecting to server.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-8 border-t-2 border-gray-200 mt-10 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold font-serif">Reader Comments ({comments.length})</h3>
      </div>

      {loadingUser ? (
        <div className="p-6 bg-gray-50 border rounded-lg text-center text-sm text-gray-500">
          Loading comment access...
        </div>
      ) : !user ? (
        /* Non-Logged In User Box */
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-6 rounded-lg text-center space-y-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-red-100">
            <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 4h.01M5 20h14a2 2 0 002-2V10a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2zM8 8V6a4 4 0 118 0v2" />
            </svg>
          </div>
          <h4 className="font-bold text-lg text-gray-900">Join the Conversation</h4>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Only logged in members can leave comments on Business Standard articles. Please log in or create an account to share your thoughts.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2 rounded-md text-sm transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-white hover:bg-gray-100 text-gray-800 font-bold border border-gray-300 px-5 py-2 rounded-md text-sm transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      ) : (
        /* Logged In User Comment Form */
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h4 className="font-bold text-base text-gray-800">Leave a Comment</h4>
            <span className="text-xs text-gray-600">
              Posting as <strong className="text-red-700">{user.username}</strong> ({user.email})
            </span>
          </div>
          
          {msg && (
            <div className={`p-3 rounded text-sm ${msg.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
              {msg.text}
            </div>
          )}

          <div>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-200"
              placeholder={`What are your thoughts on this story, ${user.username}?`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-red-800 transition disabled:opacity-50"
          >
            {submitting ? 'Posting Comment...' : 'Post Comment'}
          </button>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-sm text-gray-900">{comment.name}</span>
              <span className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed font-serif">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
