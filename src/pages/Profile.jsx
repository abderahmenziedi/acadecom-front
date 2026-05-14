import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  User as UserIcon,
  Phone,
  MapPin,
  Globe,
  AtSign,
  Hash,
  Link as LinkIcon,
  Briefcase,
  Shield,
  Save,
  Trash2,
  Mail,
} from 'lucide-react';
import { motion } from 'framer-motion';

import {
  getProfile,
  updateProfile,
  updateAvatar,
  deleteAvatar,
  changePassword,
} from '../api/profile';
import { getRoleLabel } from '../utils/roles';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ImageUpload from '../components/ui/ImageUpload';
import PageHeader from '../components/ui/PageHeader';
import { SkeletonCard } from '../components/ui/Skeleton';

const profileSchema = z.object({
  name: z.string().min(2, 'Au moins 2 caractères').max(100).optional().or(z.literal('')),
  phone: z.string().max(40).optional().or(z.literal('')),
  bio: z.string().max(2000).optional().or(z.literal('')),
  address: z.string().max(255).optional().or(z.literal('')),
  website: z.string().max(255).optional().or(z.literal('')),
  industry: z.string().max(100).optional().or(z.literal('')),
  description: z.string().max(2000).optional().or(z.literal('')),
  facebook: z.string().max(255).optional().or(z.literal('')),
  twitter: z.string().max(255).optional().or(z.literal('')),
  instagram: z.string().max(255).optional().or(z.literal('')),
  linkedin: z.string().max(255).optional().or(z.literal('')),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
    newPassword: z.string().min(6, 'Au moins 6 caractères'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const [tab, setTab] = useState(initialTab);

  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const profileForm = useForm({ resolver: zodResolver(profileSchema), defaultValues: {} });
  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  const isBrand = me?.role === 'brand';
  const isParticipant = me?.role === 'participant';

  const tabs = useMemo(
    () => [
      { id: 'profile', label: 'Informations' },
      { id: 'social', label: 'Réseaux sociaux' },
      { id: 'security', label: 'Sécurité' },
    ],
    [],
  );

  // load profile
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getProfile();
        const u = data?.data?.user || {};
        setMe(u);
        const sl = u.socialLinks || {};
        profileForm.reset({
          name: u.name || '',
          phone: u.phone || '',
          bio: u.bio || '',
          address: u.address || '',
          website: u.website || '',
          industry: u.industry || '',
          description: u.description || '',
          facebook: sl.facebook || '',
          twitter: sl.twitter || '',
          instagram: sl.instagram || '',
          linkedin: sl.linkedin || '',
        });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitProfile = async (values) => {
    const payload = {
      ...(values.name && { name: values.name }),
      phone: values.phone || null,
      bio: values.bio || null,
      address: values.address || null,
      website: values.website || null,
      ...(isBrand && {
        industry: values.industry || null,
        description: values.description || null,
      }),
      socialLinks: {
        facebook: values.facebook || null,
        twitter: values.twitter || null,
        instagram: values.instagram || null,
        linkedin: values.linkedin || null,
      },
    };
    try {
      const { data } = await updateProfile(payload);
      const updated = data?.data?.user;
      setMe(updated);
      refreshUser({ name: updated?.name, avatar: updated?.avatar });
      toast.success('Profil mis à jour');
    } catch { /* toast handled by interceptor */ }
  };

  const onChangePassword = async (values) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Mot de passe modifié');
      passwordForm.reset();
    } catch { /* toast handled */ }
  };

  const onAvatarChange = async (url) => {
    setSavingAvatar(true);
    try {
      const { data } = await updateAvatar(url);
      setMe(data?.data?.user || me);
      refreshUser({ avatar: url });
    } catch { /* */ } finally {
      setSavingAvatar(false);
    }
  };

  const onAvatarRemove = async () => {
    setSavingAvatar(true);
    try {
      const { data } = await deleteAvatar();
      setMe(data?.data?.user || me);
      refreshUser({ avatar: null });
      toast.success('Avatar supprimé');
    } catch { /* */ } finally {
      setSavingAvatar(false);
    }
  };

  const switchTab = (id) => {
    setTab(id);
    setSearchParams({ tab: id });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Mon profil"
        subtitle={`Connecté en tant que ${getRoleLabel(me?.role)}`}
        icon={UserIcon}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ─── LEFT — Identity ─────────────────────────────── */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <ImageUpload
              value={me?.avatar}
              onChange={(url) => (url ? onAvatarChange(url) : onAvatarRemove())}
              category="avatar"
              shape="circle"
              aspect="aspect-square"
              className="w-32"
            />
            <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              {me?.name || me?.email}
            </h2>
            <Badge variant="role" className="mt-2 capitalize">{me?.role}</Badge>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> {me?.email}
            </p>

            {isParticipant && (
              <div className="mt-5 grid grid-cols-3 gap-3 w-full text-center">
                <Mini label="Niveau" value={me?.level || 1} />
                <Mini label="XP" value={me?.xp || 0} />
                <Mini label="Coupons" value={me?.coupons || 0} />
              </div>
            )}
            {me?.avatar && (
              <button
                type="button"
                onClick={onAvatarRemove}
                disabled={savingAvatar}
                className="mt-5 inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer l'avatar
              </button>
            )}
          </div>
        </Card>

        {/* ─── RIGHT — Tabs ────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2 overflow-x-auto -mx-2 px-2 pb-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-primary text-white shadow-sm shadow-primary/30'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <form
                  onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Nom complet"
                      placeholder="Votre nom"
                      icon={UserIcon}
                      error={profileForm.formState.errors.name?.message}
                      {...profileForm.register('name')}
                    />
                    <Input
                      label="Téléphone"
                      placeholder="+33 6 12 34 56 78"
                      icon={Phone}
                      error={profileForm.formState.errors.phone?.message}
                      {...profileForm.register('phone')}
                    />
                    <Input
                      label="Adresse"
                      placeholder="Ville, Pays"
                      icon={MapPin}
                      className="sm:col-span-2"
                      error={profileForm.formState.errors.address?.message}
                      {...profileForm.register('address')}
                    />
                    <Input
                      label="Site web"
                      placeholder="https://..."
                      icon={Globe}
                      className="sm:col-span-2"
                      error={profileForm.formState.errors.website?.message}
                      {...profileForm.register('website')}
                    />
                  </div>

                  {isBrand && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Secteur d'activité"
                        placeholder="Tech, Mode, Food…"
                        error={profileForm.formState.errors.industry?.message}
                        {...profileForm.register('industry')}
                      />
                    </div>
                  )}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {isBrand ? 'Description de la marque' : 'Biographie'}
                    </label>
                    <textarea
                      rows={4}
                      className="input"
                      placeholder={
                        isBrand
                          ? 'Présentez votre marque…'
                          : 'Parlez de vous en quelques lignes…'
                      }
                      {...profileForm.register(isBrand ? 'description' : 'bio')}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      loading={profileForm.formState.isSubmitting}
                      icon={Save}
                    >
                      Enregistrer
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {tab === 'social' && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Réseaux sociaux</CardTitle>
                </CardHeader>
                <form
                  onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <Input
                    label="Facebook"
                    placeholder="https://facebook.com/…"
                    icon={LinkIcon}
                    {...profileForm.register('facebook')}
                  />
                  <Input
                    label="Twitter / X"
                    placeholder="https://x.com/…"
                    icon={AtSign}
                    {...profileForm.register('twitter')}
                  />
                  <Input
                    label="Instagram"
                    placeholder="https://instagram.com/…"
                    icon={Hash}
                    {...profileForm.register('instagram')}
                  />
                  <Input
                    label="LinkedIn"
                    placeholder="https://linkedin.com/…"
                    icon={Briefcase}
                    {...profileForm.register('linkedin')}
                  />
                  <div className="sm:col-span-2 flex justify-end">
                    <Button
                      type="submit"
                      loading={profileForm.formState.isSubmitting}
                      icon={Save}
                    >
                      Enregistrer
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {tab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Changer le mot de passe</CardTitle>
                </CardHeader>
                <form
                  onSubmit={passwordForm.handleSubmit(onChangePassword)}
                  className="space-y-4"
                >
                  <Input
                    label="Mot de passe actuel"
                    type="password"
                    icon={Shield}
                    error={passwordForm.formState.errors.currentPassword?.message}
                    {...passwordForm.register('currentPassword')}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Nouveau mot de passe"
                      type="password"
                      icon={Shield}
                      error={passwordForm.formState.errors.newPassword?.message}
                      {...passwordForm.register('newPassword')}
                    />
                    <Input
                      label="Confirmer"
                      type="password"
                      icon={Shield}
                      error={passwordForm.formState.errors.confirmPassword?.message}
                      {...passwordForm.register('confirmPassword')}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      loading={passwordForm.formState.isSubmitting}
                      variant="primary"
                    >
                      Mettre à jour
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-700/50 bg-gray-50/60 dark:bg-gray-900/30 p-3">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
