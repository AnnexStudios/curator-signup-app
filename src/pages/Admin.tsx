import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const ADMIN_PASSWORD = import.meta.env.VITE_CURATOR_ADMIN_PASSWORD;
const INVITE_URL = import.meta.env.VITE_CURATOR_INVITE_FUNCTION_URL;
const SESSION_KEY = 'curator_admin_auth';

type Status = 'applied' | 'approved' | 'rejected' | 'invited' | 'active';

const STATUS_STYLES: Record<Status, string> = {
  applied:  'bg-white/10 text-off-white/70',
  approved: 'bg-teal/20 text-teal',
  invited:  'bg-yellow/20 text-yellow',
  active:   'bg-green-500/20 text-green-400',
  rejected: 'bg-magenta/20 text-magenta',
};

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  expertise: string;
  instagram: string | null;
  about: string;
  status: Status;
  created_at: string;
  invited_at: string | null;
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true');
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('curator_applications')
      .select('*')
      .order('created_at', { ascending: false });
    setApplications((data as Application[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchApplications();
  }, [authed, fetchApplications]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthed(true);
    } else {
      setPwError('Incorrect password');
    }
  }

  async function handleApprove(id: string) {
    setInviting(id);
    try {
      const res = await fetch(INVITE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curator_id: id }),
      });
      if (res.ok) {
        setApplications(a => a.map(app =>
          app.id === id ? { ...app, status: 'invited', invited_at: new Date().toISOString() } : app
        ));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to send invite');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setInviting(null);
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl text-off-white mb-8 text-center">Admin</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password" autoFocus
              className="w-full bg-white/5 border border-white/10 rounded text-off-white placeholder-mid-grey px-4 py-3 text-sm focus:outline-none focus:border-yellow/50"
            />
            {pwError && <p className="text-magenta text-xs">{pwError}</p>}
            <button type="submit" className="bg-yellow text-dark font-bold py-3 rounded text-sm tracking-wide uppercase">
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-off-white">Curator Applications</h1>
          <div className="flex items-center gap-4">
            <span className="text-mid-grey text-sm">{applications.length} total</span>
            <button onClick={fetchApplications} className="px-4 py-2 bg-white/5 border border-white/10 rounded text-xs font-semibold text-off-white hover:bg-white/10 transition-colors">
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-mid-grey text-sm">Loading…</p>
        ) : (
          <div className="overflow-x-auto rounded border border-white/10">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-off-white/50 text-xs uppercase tracking-wider">
                <tr>
                  {['Name', 'Email', 'Expertise', 'Instagram', 'About', 'Status', 'Applied', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-off-white whitespace-nowrap font-medium">
                      {app.first_name} {app.last_name}
                    </td>
                    <td className="px-4 py-3 text-mid-grey text-xs">{app.email}</td>
                    <td className="px-4 py-3 text-mid-grey text-xs capitalize">
                      {app.expertise.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3 text-mid-grey text-xs">{app.instagram ?? '—'}</td>
                    <td className="px-4 py-3 text-mid-grey text-xs max-w-[200px]">
                      <span title={app.about}>
                        {app.about.length > 100 ? app.about.slice(0, 100) + '…' : app.about}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_STYLES[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-mid-grey text-xs whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {(app.status === 'applied' || app.status === 'approved') && (
                        <button
                          onClick={() => handleApprove(app.id)}
                          disabled={inviting === app.id}
                          className="px-3 py-1.5 bg-yellow text-dark rounded text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
                        >
                          {inviting === app.id ? 'Sending…' : 'Approve & Invite'}
                        </button>
                      )}
                      {app.status === 'invited' && (
                        <span className="text-xs text-mid-grey">
                          Invited {app.invited_at ? new Date(app.invited_at).toLocaleDateString() : ''}
                        </span>
                      )}
                      {app.status === 'active' && (
                        <span className="text-xs text-green-400">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {applications.length === 0 && (
              <p className="text-mid-grey text-sm text-center py-12">No applications yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
