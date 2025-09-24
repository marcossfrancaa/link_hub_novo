import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types';

export const validateUsername = async (username: string, currentUserId?: string): Promise<{ isValid: boolean; message?: string }> => {
  // Verificar comprimento
  if (username.length < 3) {
    return { isValid: false, message: 'Nome de usuário deve ter pelo menos 3 caracteres' };
  }
  
  if (username.length > 30) {
    return { isValid: false, message: 'Nome de usuário deve ter no máximo 30 caracteres' };
  }
  
  // Verificar caracteres válidos
  const validChars = /^[a-zA-Z0-9_]+$/;
  if (!validChars.test(username)) {
    return { isValid: false, message: 'Nome de usuário pode conter apenas letras, números e underscores' };
  }
  
  // Verificar se já existe
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();
    
  if (error) {
    return { isValid: false, message: 'Erro ao verificar nome de usuário' };
  }
  
  if (data && data.id !== currentUserId) {
    return { isValid: false, message: 'Nome de usuário já está em uso' };
  }
  
  return { isValid: true };
};

export const generateUniqueUsername = async (baseUsername: string): Promise<string> => {
  let username = baseUsername;
  let counter = 1;
  
  while (true) {
    const { isValid } = await validateUsername(username);
    if (isValid) {
      return username;
    }
    
    username = `${baseUsername}_${counter}`;
    counter++;
  }
};

export const formatProfileForDisplay = (profile: UserProfile): UserProfile => {
  return {
    ...profile,
    username: profile.username || 'user',
    bio: profile.bio || 'Bem-vindo ao meu perfil!',
    profile_picture_url: profile.profile_picture_url || 'https://via.placeholder.com/150',
    links: profile.links || [],
    theme: profile.theme || {
      backgroundColor: '#ffffff',
      linkColor: '#3b82f6',
      linkFontColor: '#ffffff',
      fontFamily: 'Inter',
      linkStyle: 'filled',
      linkColorHover: '#2563eb',
      linkFontColorHover: '#ffffff'
    },
    socials: profile.socials || {}
  };
};

export const sanitizeProfileData = (profile: Partial<UserProfile>): Partial<UserProfile> => {
  const sanitized: Partial<UserProfile> = {};
  
  if (profile.username !== undefined) {
    sanitized.username = profile.username.trim().toLowerCase();
  }
  
  if (profile.bio !== undefined) {
    sanitized.bio = profile.bio.trim();
  }
  
  if (profile.profile_picture_url !== undefined) {
    sanitized.profile_picture_url = profile.profile_picture_url.trim();
  }
  
  if (profile.links !== undefined) {
    sanitized.links = profile.links.map(link => ({
      ...link,
      title: link.title.trim(),
      url: link.url.trim()
    }));
  }
  
  return sanitized;
};