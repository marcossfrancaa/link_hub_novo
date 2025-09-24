import { Link } from '@/types';

export const validateLink = (link: Link): { isValid: boolean; message?: string } => {
  if (!link.title || link.title.trim().length === 0) {
    return { isValid: false, message: 'O título do link é obrigatório' };
  }
  
  if (link.title.trim().length > 100) {
    return { isValid: false, message: 'O título do link deve ter no máximo 100 caracteres' };
  }
  
  if (link.type === 'link' || link.type === 'youtube' || link.type === 'spotify') {
    if (!link.url || link.url.trim().length === 0) {
      return { isValid: false, message: 'A URL é obrigatória' };
    }
    
    if (link.type === 'youtube') {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
      if (!youtubeRegex.test(link.url)) {
        return { isValid: false, message: 'URL do YouTube inválida' };
      }
    }
    
    if (link.type === 'spotify') {
      const spotifyRegex = /^(https?:\/\/)?(open\.spotify\.com)\/.+$/;
      if (!spotifyRegex.test(link.url)) {
        return { isValid: false, message: 'URL do Spotify inválida' };
      }
    }
    
    try {
      new URL(link.url);
    } catch (e) {
      return { isValid: false, message: 'URL inválida' };
    }
  }
  
  return { isValid: true };
};

export const formatLinkUrl = (url: string, type: Link['type']): string => {
  if (!url) return '';
  
  try {
    // Se já for uma URL completa, retornar como está
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Para links normais, adicionar https:// se não tiver protocolo
    if (type === 'link') {
      return `https://${url}`;
    }
    
    return url;
  } catch (e) {
    return url;
  }
};

export const getLinkPreview = (link: Link): { icon: string; label: string } => {
  switch (link.type) {
    case 'header':
      return { icon: 'H', label: 'Cabeçalho' };
    case 'youtube':
      return { icon: '▶️', label: 'Vídeo do YouTube' };
    case 'spotify':
      return { icon: '🎵', label: 'Player do Spotify' };
    case 'link':
    default:
      // Tentar identificar o tipo de link pela URL
      if (link.url.includes('instagram.com')) {
        return { icon: '📸', label: 'Instagram' };
      }
      if (link.url.includes('twitter.com') || link.url.includes('x.com')) {
        return { icon: '🐦', label: 'Twitter' };
      }
      if (link.url.includes('linkedin.com')) {
        return { icon: '💼', label: 'LinkedIn' };
      }
      if (link.url.includes('github.com')) {
        return { icon: '💻', label: 'GitHub' };
      }
      return { icon: '🔗', label: 'Link' };
  }
};

export const sortLinksByType = (links: Link[]): Link[] => {
  return [...links].sort((a, b) => {
    // Headers primeiro
    if (a.type === 'header' && b.type !== 'header') return -1;
    if (b.type === 'header' && a.type !== 'header') return 1;
    
    // Depois links normais
    if (a.type === 'link' && b.type !== 'link' && b.type !== 'header') return -1;
    if (b.type === 'link' && a.type !== 'link' && a.type !== 'header') return 1;
    
    // YouTube e Spotify por último
    return 0;
  });
};