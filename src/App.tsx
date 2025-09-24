import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';

// Lazy load pages to reduce initial bundle size
const HomePage = lazy(() => import('@/components/HomePage').then(module => ({ default: module.HomePage })));
const LoginPage = lazy(() => import('@/components/LoginPage').then(module => ({ default: module.LoginPage })));
const LazyAdminDashboard = lazy(() => import('@/components/LazyAdminDashboard').then(module => ({ default: module.LazyAdminDashboard })));
const ProfilePage = lazy(() => import('@/components/ProfilePage').then(module => ({ default: module.ProfilePage })));
const NotFoundPage = lazy(() => import('@/components/NotFoundPage').then(module => ({ default: module.NotFoundPage })));
const SimpleLogin = lazy(() => import('@/components/SimpleLogin').then(module => ({ default: module.SimpleLogin })));

const App: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
        <Routes>
          <Route path="/" element={
            <>
              <SEOHead />
              {!session ? <HomePage /> : <Navigate to="/admin" />}
            </>
          } />
          
          <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/admin" />} />
          
          <Route path="/register" element={!session ? <LoginPage /> : <Navigate to="/admin" />} />

          <Route path="/test" element={<SimpleLogin />} />

          <Route path="/admin" element={session ? <LazyAdminDashboard /> : <Navigate to="/login" />} />

          <Route path="/profile/:username" element={<PublicProfilePage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

const PublicProfilePage: React.FC = () => {
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const { username } = useParams<{ username: string }>();

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!username) {
        setError(true);
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (error || !data) {
          setError(true);
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleLinkClick = async (linkId: string) => {
    if (!profile || !profile.links) return;

    // Atualizar contador de cliques localmente
    const updatedLinks = profile.links.map((link: any) => {
      if (link.id === linkId) {
        return { ...link, clickCount: link.clickCount + 1 };
      }
      return link;
    });

    setProfile({ ...profile, links: updatedLinks });
    
    // Atualizar no banco de dados
    try {
      await supabase
        .from('profiles')
        .update({ links: updatedLinks })
        .eq('id', profile.id);
    } catch (error) {
      console.error('Erro ao atualizar contador de cliques:', error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando perfil...</div>;
  if (error || !profile) return <NotFoundPage />;

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando perfil...</div>}>
      <ProfilePage profile={profile} onLinkClick={handleLinkClick} />
    </Suspense>
  );
};

export default App;