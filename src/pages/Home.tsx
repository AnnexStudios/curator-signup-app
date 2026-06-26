import { useState } from 'react';
import FormField from '../components/FormField';

const FUNCTION_URL = 'https://waonfenqnffngbzalrsi.supabase.co/functions/v1/curator-apply';
const LOGO = 'https://waonfenqnffngbzalrsi.supabase.co/storage/v1/object/public/email-assets/icons/shorely-logo-white-yellow.png';

const EXPERTISE_OPTIONS = [
  { value: 'beaches',      label: 'Beaches' },
  { value: 'restaurants',  label: 'Restaurants' },
  { value: 'beach_clubs',  label: 'Beach clubs' },
  { value: 'events',       label: 'Events' },
  { value: 'activities',   label: 'Activities' },
  { value: 'general',      label: 'General Ibiza knowledge' },
];

interface FormState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  expertise: string;
  about: string;
  instagram: string;
  how_heard: string;
}

interface Errors {
  first_name?: string;
  last_name?: string;
  email?: string;
  expertise?: string;
  about?: string;
  form?: string;
}

const inputClass = 'w-full bg-white/5 border border-white/10 rounded text-off-white placeholder-mid-grey px-4 py-3 text-sm focus:outline-none focus:border-yellow/50 transition-colors';
const selectClass = 'w-full bg-white/5 border border-white/10 rounded text-off-white px-4 py-3 text-sm focus:outline-none focus:border-yellow/50 transition-colors appearance-none';

export default function Home() {
  const [form, setForm] = useState<FormState>({
    first_name: '', last_name: '', email: '', phone: '',
    expertise: '', about: '', instagram: '', how_heard: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function set(field: keyof FormState, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field as keyof Errors]) setErrors(e => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!form.first_name.trim()) e.first_name = 'First name is required';
    if (!form.last_name.trim()) e.last_name = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.expertise) e.expertise = 'Please select your area of expertise';
    if (!form.about.trim()) e.about = 'Please tell us about yourself';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          expertise: form.expertise,
          about: form.about.trim(),
          instagram: form.instagram.trim() || undefined,
          how_heard: form.how_heard || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ form: data.error || 'Something went wrong. Please try again.' });
        return;
      }
      setSuccess(true);
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  const charCount = form.about.length;

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-[480px]">
        <img src={LOGO} alt="Shorely Ibiza" className="h-9 mx-auto mb-12" />

        {success ? (
          <div className="text-center">
            <h1 className="font-display text-4xl text-off-white mb-4">Application sent.</h1>
            <p className="text-mid-grey text-sm leading-relaxed mb-6">
              We'll review your application and be in touch within 48 hours.
            </p>
            <p className="text-xs text-mid-grey leading-relaxed">
              Questions? Email{' '}
              <a href="mailto:support@shorelyibiza.app" className="text-teal underline">support@shorelyibiza.app</a>
              {' '}or WhatsApp{' '}
              <a href="https://wa.me/447576266664" className="text-teal underline">+44 7576 266664</a>
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-5xl text-off-white text-center mb-3">
              Write Ibiza.
            </h1>
            <p className="text-mid-grey text-sm text-center leading-relaxed mb-10 max-w-[400px] mx-auto">
              We're building the most comprehensive guide to Ibiza and Formentera.
              If you know the island properly, we'd like you to help.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="First name *" error={errors.first_name}>
                  <input
                    type="text" value={form.first_name} onChange={e => set('first_name', e.target.value)}
                    placeholder="First name" className={inputClass} autoComplete="given-name"
                  />
                </FormField>
                <FormField label="Last name *" error={errors.last_name}>
                  <input
                    type="text" value={form.last_name} onChange={e => set('last_name', e.target.value)}
                    placeholder="Last name" className={inputClass} autoComplete="family-name"
                  />
                </FormField>
              </div>

              <FormField label="Email address *" error={errors.email}>
                <input
                  type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com" className={inputClass} autoComplete="email"
                />
              </FormField>

              <FormField label="Phone number">
                <input
                  type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="+44..." className={inputClass} autoComplete="tel"
                />
              </FormField>

              <FormField label="Area of expertise *" error={errors.expertise}>
                <select value={form.expertise} onChange={e => set('expertise', e.target.value)} className={selectClass}>
                  <option value="">Select an area</option>
                  {EXPERTISE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="About you *"
                helper="Three to five sentences. What do you know, where do you go, what makes your knowledge worth reading?"
                error={errors.about}
              >
                <div className="relative">
                  <textarea
                    value={form.about} onChange={e => set('about', e.target.value)}
                    placeholder="Tell us about yourself and what you know about Ibiza"
                    rows={5}
                    className={`${inputClass} resize-none`}
                  />
                  <span className={`absolute bottom-3 right-3 text-xs ${charCount > 600 ? 'text-magenta' : 'text-mid-grey'}`}>
                    {charCount}/600
                  </span>
                </div>
              </FormField>

              <FormField label="Instagram handle">
                <input
                  type="text" value={form.instagram} onChange={e => set('instagram', e.target.value)}
                  placeholder="@handle" className={inputClass}
                />
              </FormField>

              <FormField label="How did you hear about us?">
                <select value={form.how_heard} onChange={e => set('how_heard', e.target.value)} className={selectClass}>
                  <option value="">Select an option</option>
                  <option value="friend">Friend</option>
                  <option value="shorely">Shorely</option>
                  <option value="direct_invite">Direct invite</option>
                  <option value="other">Other</option>
                </select>
              </FormField>

              {errors.form && (
                <p className="text-sm text-magenta text-center">{errors.form}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow text-dark font-bold py-4 rounded text-sm tracking-wide uppercase hover:opacity-90 transition-opacity disabled:opacity-60 mt-2"
              >
                {loading ? 'Sending…' : 'Send your application'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
