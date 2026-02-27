'use client';

import { FormEvent, useState } from 'react';
import { AppIcon } from '@/components/ui/shared/AppIcon';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'success' | 'error' | ''>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Successfully subscribed to the newsletter.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Failed to subscribe. Try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      setMessage('');
      setStatus('');
    }, 3000);
  };

  return (
    <div className="bg-surface p-4 rounded-lg border border-border">
      <h3 className="font-bold text-sm text-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
        <AppIcon name="envelope" size="sm" className="text-primary" />
        Stay Updated
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p
          className={`mt-2 flex items-center gap-2 text-xs font-medium ${
            status === 'success' ? 'text-success' : 'text-error'
          }`}
          aria-live="polite"
        >
          {status === 'success' && (
            <AppIcon name="circle-check" size="sm" className="text-success" />
          )}
          <span>{message}</span>
        </p>
      )}
    </div>
  );
}
