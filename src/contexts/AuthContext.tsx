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
      setSession(session);
      setUser(session?.user ?? null);
      
      // Criar perfil quando usuário se cadastrar
      if (event === 'SIGNED_IN' && session?.user) {
        // Verificar se perfil já existe
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (!existingProfile) {
          // Criar novo perfil
          const username = session.user.email?.split('@')[0] || `user_${Math.floor(Math.random() * 1000)}`;
          const { data: newProfile, error } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              username: username,
              bio: 'Bem-vindo ao meu perfil!',
              profile_picture_url: '',
              links: [],
              theme: {
                backgroundColor: '#ffffff',
                linkColor: '#3b82f6',
                linkFontColor: '#ffffff',
                fontFamily: 'Inter',
                linkStyle: 'filled',
                linkColorHover: '#2563eb',
                linkFontColorHover: '#ffffff'
              },
              socials: {}
            })
            .select()
            .single();
          
          if (error) {
            console.error('Erro ao criar perfil:', error);
          } else if (newProfile) {
            setProfile(newProfile as UserProfile);
          }
        } else {
          setProfile(existingProfile as UserProfile);
        }
      }
      
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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