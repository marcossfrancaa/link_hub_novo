import { Theme } from '@/types';

export const validateTheme = (theme: Theme): { isValid: boolean; message?: string } => {
  // Verificar se todas as propriedades obrigatórias estão presentes
  const requiredProps: (keyof Theme)[] = [
    'backgroundColor',
    'linkColor',
    'linkFontColor',
    'fontFamily',
    'linkStyle',
    'linkColorHover',
    'linkFontColorHover'
  ];
  
  for (const prop of requiredProps) {
    if (theme[prop] === undefined || theme[prop] === null) {
      return { isValid: false, message: `Propriedade obrigatória ausente: ${prop}` };
    }
  }
  
  // Validar cores (formato hex)
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const colorProps: (keyof Theme)[] = [
    'backgroundColor',
    'linkColor',
    'linkFontColor',
    'linkColorHover',
    'linkFontColorHover'
  ];
  
  for (const prop of colorProps) {
    if (!colorRegex.test(theme[prop])) {
      return { isValid: false, message: `Cor inválida para ${prop}: ${theme[prop]}` };
    }
  }
  
  // Validar estilo do link
  if (theme.linkStyle !== 'filled' && theme.linkStyle !== 'outline') {
    return { isValid: false, message: 'Estilo do link inválido' };
  }
  
  // Validar fonte
  if (typeof theme.fontFamily !== 'string' || theme.fontFamily.trim().length === 0) {
    return { isValid: false, message: 'Fonte inválida' };
  }
  
  return { isValid: true };
};

export const getDefaultTheme = (): Theme => {
  return {
    backgroundColor: '#ffffff',
    linkColor: '#3b82f6',
    linkFontColor: '#ffffff',
    fontFamily: 'Inter',
    linkStyle: 'filled',
    linkColorHover: '#2563eb',
    linkFontColorHover: '#ffffff'
  };
};

export const getThemePresets = (): { name: string; theme: Theme }[] => {
  return [
    {
      name: 'Minimalist Light',
      theme: { 
        backgroundColor: '#F3F4F6', 
        linkColor: '#1F2937', 
        linkFontColor: '#FFFFFF', 
        fontFamily: 'Inter', 
        linkStyle: 'filled', 
        linkColorHover: '#374151', 
        linkFontColorHover: '#FFFFFF' 
      },
    },
    {
      name: 'Minimalist Dark',
      theme: { 
        backgroundColor: '#111827', 
        linkColor: '#F9FAFB', 
        linkFontColor: '#111827', 
        fontFamily: 'Inter', 
        linkStyle: 'filled', 
        linkColorHover: '#E5E7EB', 
        linkFontColorHover: '#111827' 
      },
    },
    {
      name: 'Forest',
      theme: { 
        backgroundColor: '#065F46', 
        linkColor: '#ECFDF5', 
        linkFontColor: '#065F46', 
        fontFamily: 'Lato', 
        linkStyle: 'filled', 
        linkColorHover: '#D1FAE5', 
        linkFontColorHover: '#065F46' 
      },
    },
    {
      name: 'Ocean',
      theme: { 
        backgroundColor: '#0C4A6E', 
        linkColor: '#E0F2FE', 
        linkFontColor: '#0C4A6E', 
        fontFamily: 'Roboto', 
        linkStyle: 'filled', 
        linkColorHover: '#BAE6FD', 
        linkFontColorHover: '#0C4A6E' 
      },
    },
    {
      name: 'Sunset',
      theme: { 
        backgroundColor: '#9A3412', 
        linkColor: '#FED7AA', 
        linkFontColor: '#9A3412', 
        fontFamily: 'Montserrat', 
        linkStyle: 'filled', 
        linkColorHover: '#FDBA74', 
        linkFontColorHover: '#9A3412' 
      },
    },
    {
      name: 'Neon',
      theme: { 
        backgroundColor: '#1A202C', 
        linkColor: '#38B2AC', 
        linkFontColor: '#1A202C', 
        fontFamily: 'Poppins', 
        linkStyle: 'outline', 
        linkColorHover: '#319795', 
        linkFontColorHover: '#FFFFFF' 
      },
    },
    {
      name: 'Galaxy',
      theme: { 
        backgroundColor: '#0F172A', 
        linkColor: '#8B5CF6', 
        linkFontColor: '#FFFFFF', 
        fontFamily: 'Poppins', 
        linkStyle: 'outline', 
        linkColorHover: '#7C3AED', 
        linkFontColorHover: '#FFFFFF' 
      },
    },
    {
      name: 'Sakura',
      theme: { 
        backgroundColor: '#831843', 
        linkColor: '#FECACA', 
        linkFontColor: '#831843', 
        fontFamily: 'Montserrat', 
        linkStyle: 'filled', 
        linkColorHover: '#FCA5A5', 
        linkFontColorHover: '#831843' 
      },
    },
    {
      name: 'Mint',
      theme: { 
        backgroundColor: '#134E4A', 
        linkColor: '#CCFBF1', 
        linkFontColor: '#134E4A', 
        fontFamily: 'Lato', 
        linkStyle: 'filled', 
        linkColorHover: '#99F6E4', 
        linkFontColorHover: '#134E4A' 
      },
    },
    {
      name: 'Citrus',
      theme: { 
        backgroundColor: '#92400E', 
        linkColor: '#FEF3C7', 
        linkFontColor: '#92400E', 
        fontFamily: 'Oswald', 
        linkStyle: 'filled', 
        linkColorHover: '#FDE68A', 
        linkFontColorHover: '#92400E' 
      },
    },
    {
      name: 'Coffee',
      theme: { 
        backgroundColor: '#44403C', 
        linkColor: '#E7E5E4', 
        linkFontColor: '#44403C', 
        fontFamily: 'Roboto', 
        linkStyle: 'filled', 
        linkColorHover: '#D6D3D1', 
        linkFontColorHover: '#44403C' 
      },
    },
    {
      name: 'Royal',
      theme: { 
        backgroundColor: '#581C87', 
        linkColor: '#E9D5FF', 
        linkFontColor: '#581C87', 
        fontFamily: 'Inter', 
        linkStyle: 'filled', 
        linkColorHover: '#DDD6FE', 
        linkFontColorHover: '#581C87' 
      },
    }
  ];
};

export const isColorDark = (color: string): boolean => {
  // Converter cor hex para RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calcular luminosidade
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  return brightness < 128;
};

export const getContrastColor = (bgColor: string): string => {
  return isColorDark(bgColor) ? '#FFFFFF' : '#000000';
};