import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserProfile } from '@/types';
import { supabase } from '@/integrations/supabase/client';

import { HomePage } from '@/components/HomePage';
import { LoginPage } from '@/components/LoginPage';
import { SimpleLogin } from '@/components/SimpleLogin';
import { ManualSignup } from '@/components/ManualSignup';
import { AdminDashboard } from '@/components/AdminDashboard';
import { ProfilePage } from '@/components/ProfilePage';
import { NotFoundPage } from '@/components/NotFoundPage';

const App: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!session ? <HomePage /> : <Navigate to="/admin" />} />
        
        <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/admin" />} />
        
        <Route path="/register" element={!session ? <LoginPage initialView="sign_up" /> : <Navigate to="/admin" />} />

        <Route path="/test" element={<SimpleLogin />} />

        <Route path="/manual-signup" element={!session ? <ManualSignup /> : <Navigate to="/admin" />} />

        <Route path="/admin" element={session ? <AdminDashboard /> : <Navigate to="/login" />} />

        <Route path="/profile/:username" element={<ProfileWrapper />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

// Wrapper component to fetch profile data for public pages
const ProfileWrapper: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) {
                setError(true);
                setLoading(false);
                return;
            }
            
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single();

            if (error || !data) {
                console.error('Profile fetch error:', error);
                setError(true);
            } else {
                setProfile(data as UserProfile);
            }
            setLoading(false);
        };

        fetchProfile();
    }, [username]);

    const handleLinkClick = async (linkId: string) => {
        if (!profile || !profile.links) return;

        let clickedLink: any = null;
        const updatedLinks = profile.links.map(link => {
            if (link.id === linkId) {
                clickedLink = { ...link, clickCount: link.clickCount + 1 };
                return clickedLink;
            }
            return link;
        });

        if (clickedLink) {
            setProfile({ ...profile, links: updatedLinks });
            
            await supabase
                .from('profiles')
                .update({ links: updatedLinks })
                .eq('id', profile.id);
        }
    };

    if (loading) return <div>Loading profile...</div>;
    if (error || !profile) return <NotFoundPage />;

    return <ProfilePage profile={profile} onLinkClick={handleLinkClick} />;
};

export default App;