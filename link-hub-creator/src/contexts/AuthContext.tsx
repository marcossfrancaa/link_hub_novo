import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateProfile: (newProfile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, 'Session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Temporarily disabled auto profile creation to fix signup issues
      // We'll create profiles manually after successful signup
      if (event === 'SIGNED_UP' && session?.user) {
        console.log('User created successfully:', session.user);
        console.log('Profile creation skipped - will be created manually');
      }
      
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          console.log('Profile não existe, criando...');
          const username = user.email?.split('@')[0] || 'user';
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: username + '_' + Math.floor(Math.random() * 1000),
              bio: 'Bem-vindo ao meu perfil! 🎉',
              profile_picture_url: 'https://via.placeholder.com/150',
              links: [
                {
                  id: '1',
                  type: 'link',
                  title: 'Meu primeiro link',
                  url: 'https://google.com',
                  clickCount: 0
                }
              ],
              theme: {
                backgroundColor: '#ffffff',
                linkColor: '#3b82f6',
                linkFontColor: '#ffffff',
                fontFamily: 'Arial',
                linkStyle: 'filled',
                linkColorHover: '#2563eb',
                linkFontColorHover: '#ffffff'
              }
            })
            .select()
            .single();
          
          if (createError) {
            console.error('Erro criando profile:', createError);
          } else if (newProfile) {
            setProfile(newProfile as UserProfile);
          }
        } else if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setProfile(data as UserProfile);
        }
      };
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const updateProfile = async (newProfile: UserProfile) => {
    if (!user) throw new Error("No user logged in");

    const profileDataToUpdate = {
        username: newProfile.username,
        bio: newProfile.bio,
        profile_picture_url: newProfile.profile_picture_url,
        links: newProfile.links,
        theme: newProfile.theme,
        socials: newProfile.socials,
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(profileDataToUpdate)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
    
    if (data) {
        setProfile(data as UserProfile);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};