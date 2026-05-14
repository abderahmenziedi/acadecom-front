import { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import PublicLayout from '../../components/PublicLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const CONTACT_INFOS = [
  { icon: Mail, label: 'Email', value: 'contact@acadecom.io' },
  { icon: Phone, label: 'Téléphone', value: '+216 24 000 000' },
  { icon: MapPin, label: 'Adresse', value: 'Tunis, Tunisie' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Pas d'endpoint dédié — feedback UX seulement.
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    setSent(true);
    toast.success('Message envoyé');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <PublicLayout>
      <section className="bg-app-gradient py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl text-balance">
            Discutons ensemble
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Une question, une démo, un partenariat ? Notre équipe vous répond rapidement.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-5">
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-4"
            >
              {CONTACT_INFOS.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <c.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {c.label}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {c.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8 shadow-sm space-y-4"
            >
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-success" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Merci pour votre message
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Nous reviendrons vers vous très rapidement.
                  </p>
                  <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Nom"
                      placeholder="Votre nom"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <Input
                      type="email"
                      label="Email"
                      placeholder="vous@exemple.com"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Sujet"
                    placeholder="Objet du message"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Votre message…"
                      className="input"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" icon={Send} loading={sending}>
                      Envoyer
                    </Button>
                  </div>
                </>
              )}
            </motion.form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
