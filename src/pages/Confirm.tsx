import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const LOGO = 'https://waonfenqnffngbzalrsi.supabase.co/storage/v1/object/public/email-assets/logos/shorely-logo-white-yellow.png';
const CONFIRM_URL = import.meta.env.VITE_CURATOR_CONFIRM_FUNCTION_URL;

type State = 'loading' | 'success' | 'expired' | 'already_active' | 'error';

export default function Confirm() {
  const [params] = useSearchParams();
  const [state, setState] = useState<State>('loading');

  useEffect(() => {
    const token = params.get('token');
    if (!token) { setState('error'); return; }

    fetch(`${CONFIRM_URL}?token=${encodeURIComponent(token)}`)
      .then(async res => {
        if (res.ok) {
          setState('success');
        } else {
          const text = await res.text();
          if (text.includes('expired') || text.includes('Link expired')) setState('expired');
          else if (text.includes('already have access')) setState('already_active');
          else setState('error');
        }
      })
      .catch(() => setState('error'));
  }, [params]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <img src={LOGO} alt="Shorely Ibiza" className="h-9 mx-auto mb-12" />

        {state === 'loading' && (
          <>
            <div className="w-8 h-8 border-2 border-yellow border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-mid-grey text-sm">Setting up your access…</p>
          </>
        )}

        {state === 'success' && (
          <>
            <h1 className="font-display text-4xl text-yellow mb-4">You're in.</h1>
            <p className="text-off-white/70 text-sm leading-relaxed mb-2">
              Check your inbox — we've sent you an access link.
            </p>
            <p className="text-mid-grey text-sm leading-relaxed">
              Once you're set up, sign in at{' '}
              <a href="https://curator.shorelyibiza.app" className="text-teal underline">
                curator.shorelyibiza.app
              </a>
            </p>
          </>
        )}

        {state === 'expired' && (
          <>
            <h1 className="font-display text-3xl text-off-white mb-4">Link expired.</h1>
            <p className="text-mid-grey text-sm leading-relaxed">
              This invite link has expired. Email{' '}
              <a href="mailto:support@shorelyibiza.app" className="text-teal underline">
                support@shorelyibiza.app
              </a>{' '}
              to request a new one.
            </p>
          </>
        )}

        {state === 'already_active' && (
          <>
            <h1 className="font-display text-3xl text-off-white mb-4">Already set up.</h1>
            <p className="text-mid-grey text-sm leading-relaxed mb-6">
              You already have access. Sign in at:
            </p>
            <a
              href="https://curator.shorelyibiza.app"
              className="inline-block bg-yellow text-dark font-bold px-6 py-3 rounded text-sm tracking-wide uppercase"
            >
              Go to dashboard →
            </a>
          </>
        )}

        {state === 'error' && (
          <>
            <h1 className="font-display text-3xl text-off-white mb-4">Something went wrong.</h1>
            <p className="text-mid-grey text-sm leading-relaxed">
              Contact{' '}
              <a href="mailto:support@shorelyibiza.app" className="text-teal underline">
                support@shorelyibiza.app
              </a>{' '}
              and we'll sort it.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
