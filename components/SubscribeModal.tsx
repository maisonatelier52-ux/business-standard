'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [user, setUser] = useState<{ username: string; email: string; isSubscribed: boolean } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoadingUser(true);
      setErrorMsg(null);
      setMsg(null);
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
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('You must be logged in to subscribe.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
        setUser({ ...user, isSubscribed: true });
      } else {
        setErrorMsg(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setErrorMsg('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setUser({ ...user, isSubscribed: false });
        setMsg('Your subscription has been cancelled successfully.');
      } else {
        setErrorMsg(data.message || 'Failed to cancel subscription.');
      }
    } catch {
      setErrorMsg('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div
      id="subscribeModal"
      style={{
        display: 'flex',
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        id="subModalBox"
        style={{
          background: '#fff',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ height: '4px', background: '#b91c1c', width: '100%' }}></div>

        <button
          id="subCloseBtn"
          aria-label="Close"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#9ca3af',
            padding: '4px',
            lineHeight: 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {loadingUser ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            Loading subscription info...
          </div>
        ) : !user ? (
          /* Non-Logged In User State */
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 15v2m0 4h.01M5 20h14a2 2 0 002-2V10a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2zM8 8V6a4 4 0 118 0v2" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
              Login Required
            </h2>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.5, margin: '0 0 24px' }}>
              Only registered members can subscribe to Business Standard newsletters. Please log in or create an account to proceed.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link
                href="/login"
                onClick={onClose}
                style={{
                  background: '#b91c1c',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                style={{
                  background: '#f3f4f6',
                  color: '#111827',
                  border: '1px solid #d1d5db',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        ) : isSuccess ? (
          /* Success Screen */
          <div id="subSuccessState" style={{ padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M5 15l7 7 13-13" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#111827', margin: '0 0 8px' }}>
              Subscription Successful!
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 24px' }}>
              Welcome to Business Standard. Look out for our briefings at <strong>{user.email}</strong>.
            </p>
            <button
              onClick={handleDone}
              style={{
                background: '#b91c1c',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 32px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        ) : user.isSubscribed ? (
          /* Already Subscribed State -> Cancel Subscription Form */
          <div style={{ padding: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ background: '#fef2f2', color: '#b91c1c', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                Active Subscriber
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 700, color: '#111827', margin: '12px 0 6px' }}>
                Business Standard Newsletter
              </h2>
              <p style={{ fontSize: '13px', color: '#4b5563', margin: 0 }}>
                Signed in as <strong>{user.username}</strong> ({user.email})
              </p>
            </div>

            {msg && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
                {msg}
              </div>
            )}

            {errorMsg && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '20px', fontSize: '13px', color: '#374151' }}>
              You are currently receiving our daily briefings, market analyses, and breaking business alerts directly in your email inbox.
            </div>

            <button
              onClick={handleCancelSubscription}
              disabled={loading}
              style={{
                width: '100%',
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background .15s'
              }}
            >
              {loading ? 'Processing...' : 'Cancel Subscription'}
            </button>
          </div>
        ) : (
          /* Logged In & Not Subscribed State */
          <div id="subFormState" style={{ padding: '32px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 8l7.9 5.3a2 2 0 002.2 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    stroke="#b91c1c"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', color: '#b91c1c', textTransform: 'uppercase' }}>
                  Newsletter
                </span>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#b91c1c', margin: '0 0 6px' }}>
                Business Standard
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>
                The most important business, finance and market news — free in your inbox.
              </p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4b5563' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="8" cy="8" r="8" fill="#fef2f2" />
                  <path d="M5 8l2 2 4-4" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Top business news delivered every morning
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4b5563' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="8" cy="8" r="8" fill="#fef2f2" />
                  <path d="M5 8l2 2 4-4" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Markets, economy and policy simplified
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4b5563' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="8" cy="8" r="8" fill="#fef2f2" />
                  <path d="M5 8l2 2 4-4" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Cancel anytime, zero spam guaranteed
              </li>
            </ul>

            <form onSubmit={handleSubscribe}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Subscribing with Account Email:
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  style={{
                    width: '100%',
                    background: '#f3f4f6',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '11px 14px',
                    fontSize: '14px',
                    color: '#374151'
                  }}
                />
              </div>

              {errorMsg && (
                <div
                  style={{
                    borderRadius: '7px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    fontWeight: 500,
                    marginBottom: '8px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                  }}
                >
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: '#b91c1c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {loading ? 'Subscribing…' : 'Subscribe Now'}
              </button>
            </form>

            <p style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', margin: '12px 0 0' }}>
              No spam, ever. One-click unsubscribe anytime.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
