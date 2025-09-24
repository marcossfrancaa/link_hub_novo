import React, { useState, memo } from 'react';
import type { UserProfile, Theme, Socials } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Instagram, Twitter, Linkedin, Github, Youtube } from 'lucide-react';

// A simple component for the TikTok icon
const TikTokIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 12a4 4 0 1 0 4 4V8a8 8 0 1 1-8-8"/>
  </svg>
));

interface AppearanceEditorProps {
  profileInfo: { username: string; bio: string; profile_picture_url: string; };
  theme: Theme;
  socials: Socials;
  onUpdateProfileInfo: (info: { username: string; bio: string; profile_picture_url: string; }) => void;
  onUpdateTheme: (theme: Theme) => void;
  onUpdateSocials: (socials: Socials) => void;
}

const fonts = ["Inter", "Roboto", "Lato", "Montserrat", "Oswald", "Poppins", "Open Sans", "Nunito", "Raleway", "Merriweather"];

const themePresets = [
  {
    name: 'Minimalist Light',
    theme: { backgroundColor: '#F3F4F6', linkColor: '#1F2937', linkFontColor: '#FFFFFF', fontFamily: 'Inter', linkStyle: 'filled', linkColorHover: '#374151', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Minimalist Dark',
    theme: { backgroundColor: '#111827', linkColor: '#F9FAFB', linkFontColor: '#111827', fontFamily: 'Inter', linkStyle: 'filled', linkColorHover: '#E5E7EB', linkFontColorHover: '#111827' },
  },
  {
    name: 'Forest',
    theme: { backgroundColor: '#065F46', linkColor: '#ECFDF5', linkFontColor: '#065F46', fontFamily: 'Lato', linkStyle: 'filled', linkColorHover: '#D1FAE5', linkFontColorHover: '#065F46' },
  },
  {
    name: 'Ocean',
    theme: { backgroundColor: '#0C4A6E', linkColor: '#E0F2FE', linkFontColor: '#0C4A6E', fontFamily: 'Roboto', linkStyle: 'filled', linkColorHover: '#BAE6FD', linkFontColorHover: '#0C4A6E' },
  },
  {
    name: 'Sunset',
    theme: { backgroundColor: '#9A3412', linkColor: '#FED7AA', linkFontColor: '#9A3412', fontFamily: 'Montserrat', linkStyle: 'filled', linkColorHover: '#FDBA74', linkFontColorHover: '#9A3412' },
  },
  {
    name: 'Neon',
    theme: { backgroundColor: '#1A202C', linkColor: '#38B2AC', linkFontColor: '#1A202C', fontFamily: 'Poppins', linkStyle: 'outline', linkColorHover: '#319795', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Galaxy',
    theme: { backgroundColor: '#0F172A', linkColor: '#8B5CF6', linkFontColor: '#FFFFFF', fontFamily: 'Poppins', linkStyle: 'outline', linkColorHover: '#7C3AED', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Sakura',
    theme: { backgroundColor: '#831843', linkColor: '#FECACA', linkFontColor: '#831843', fontFamily: 'Montserrat', linkStyle: 'filled', linkColorHover: '#FCA5A5', linkFontColorHover: '#831843' },
  },
  {
    name: 'Mint',
    theme: { backgroundColor: '#134E4A', linkColor: '#CCFBF1', linkFontColor: '#134E4A', fontFamily: 'Lato', linkStyle: 'filled', linkColorHover: '#99F6E4', linkFontColorHover: '#134E4A' },
  },
  {
    name: 'Citrus',
    theme: { backgroundColor: '#92400E', linkColor: '#FEF3C7', linkFontColor: '#92400E', fontFamily: 'Oswald', linkStyle: 'filled', linkColorHover: '#FDE68A', linkFontColorHover: '#92400E' },
  },
  {
    name: 'Coffee',
    theme: { backgroundColor: '#44403C', linkColor: '#E7E5E4', linkFontColor: '#44403C', fontFamily: 'Roboto', linkStyle: 'filled', linkColorHover: '#D6D3D1', linkFontColorHover: '#44403C' },
  },
  {
    name: 'Royal',
    theme: { backgroundColor: '#581C87', linkColor: '#E9D5FF', linkFontColor: '#581C87', fontFamily: 'Inter', linkStyle: 'filled', linkColorHover: '#DDD6FE', linkFontColorHover: '#581C87' },
  },
  // Templates inspirados no Linktree
  {
    name: 'Clean White',
    theme: { backgroundColor: '#FFFFFF', linkColor: '#141414', linkFontColor: '#FFFFFF', fontFamily: 'Inter', linkStyle: 'filled', linkColorHover: '#333333', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Soft Pink',
    theme: { backgroundColor: '#FFF5F7', linkColor: '#FF6B9D', linkFontColor: '#FFFFFF', fontFamily: 'Poppins', linkStyle: 'filled', linkColorHover: '#FF8EAE', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Ocean Blue',
    theme: { backgroundColor: '#F0F9FF', linkColor: '#3B82F6', linkFontColor: '#FFFFFF', fontFamily: 'Roboto', linkStyle: 'filled', linkColorHover: '#60A5FA', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Sunset Orange',
    theme: { backgroundColor: '#FFFBF5', linkColor: '#F97316', linkFontColor: '#FFFFFF', fontFamily: 'Montserrat', linkStyle: 'filled', linkColorHover: '#FB923C', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Elegant Black',
    theme: { backgroundColor: '#000000', linkColor: '#FFFFFF', linkFontColor: '#000000', fontFamily: 'Inter', linkStyle: 'outline', linkColorHover: '#CCCCCC', linkFontColorHover: '#000000' },
  },
  {
    name: 'Lavender Dream',
    theme: { backgroundColor: '#F3F4FE', linkColor: '#8B5CF6', linkFontColor: '#FFFFFF', fontFamily: 'Poppins', linkStyle: 'filled', linkColorHover: '#A78BFA', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Mint Fresh',
    theme: { backgroundColor: '#F0FDFA', linkColor: '#10B981', linkFontColor: '#FFFFFF', fontFamily: 'Nunito', linkStyle: 'filled', linkColorHover: '#34D399', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Coral Glow',
    theme: { backgroundColor: '#FFF8F6', linkColor: '#F87171', linkFontColor: '#FFFFFF', fontFamily: 'Raleway', linkStyle: 'filled', linkColorHover: '#FC8181', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Midnight Purple',
    theme: { backgroundColor: '#1E1B4B', linkColor: '#A78BFA', linkFontColor: '#FFFFFF', fontFamily: 'Inter', linkStyle: 'filled', linkColorHover: '#C4B5FD', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Golden Hour',
    theme: { backgroundColor: '#FFFBEB', linkColor: '#F59E0B', linkFontColor: '#FFFFFF', fontFamily: 'Montserrat', linkStyle: 'filled', linkColorHover: '#FBBF24', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Teal Modern',
    theme: { backgroundColor: '#F0FDFA', linkColor: '#14B8A6', linkFontColor: '#FFFFFF', fontFamily: 'Roboto', linkStyle: 'filled', linkColorHover: '#0D9488', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Rose Gold',
    theme: { backgroundColor: '#FFF8F8', linkColor: '#E11D48', linkFontColor: '#FFFFFF', fontFamily: 'Poppins', linkStyle: 'filled', linkColorHover: '#F43F5E', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Sky Blue',
    theme: { backgroundColor: '#F0F9FF', linkColor: '#0EA5E9', linkFontColor: '#FFFFFF', fontFamily: 'Inter', linkStyle: 'filled', linkColorHover: '#38BDF8', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Charcoal',
    theme: { backgroundColor: '#1F2937', linkColor: '#F9FAFB', linkFontColor: '#1F2937', fontFamily: 'Montserrat', linkStyle: 'filled', linkColorHover: '#F3F4F6', linkFontColorHover: '#1F2937' },
  },
  {
    name: 'Lemon Zest',
    theme: { backgroundColor: '#FEFCE8', linkColor: '#EAB308', linkFontColor: '#000000', fontFamily: 'Nunito', linkStyle: 'filled', linkColorHover: '#FACC15', linkFontColorHover: '#000000' },
  },
  {
    name: 'Deep Forest',
    theme: { backgroundColor: '#064E3B', linkColor: '#6EE7B7', linkFontColor: '#064E3B', fontFamily: 'Raleway', linkStyle: 'filled', linkColorHover: '#A7F3D0', linkFontColorHover: '#064E3B' },
  },
  {
    name: 'Iceberg',
    theme: { backgroundColor: '#F0FDF4', linkColor: '#22C55E', linkFontColor: '#FFFFFF', fontFamily: 'Inter', linkStyle: 'filled', linkColorHover: '#4ADE80', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Berry',
    theme: { backgroundColor: '#FDF2F8', linkColor: '#DB2777', linkFontColor: '#FFFFFF', fontFamily: 'Poppins', linkStyle: 'filled', linkColorHover: '#E11D48', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Slate',
    theme: { backgroundColor: '#F1F5F9', linkColor: '#475569', linkFontColor: '#FFFFFF', fontFamily: 'Roboto', linkStyle: 'filled', linkColorHover: '#64748B', linkFontColorHover: '#FFFFFF' },
  },
  // Templates verificados e inspirados em plataformas populares
  {
    name: 'Twitter/X',
    theme: { backgroundColor: '#000000', linkColor: '#1D9BF0', linkFontColor: '#FFFFFF', fontFamily: 'Inter', linkStyle: 'filled', linkColorHover: '#1A8CD8', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Instagram',
    theme: { backgroundColor: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', linkColor: '#FFFFFF', linkFontColor: '#000000', fontFamily: 'Roboto', linkStyle: 'filled', linkColorHover: '#E0E0E0', linkFontColorHover: '#000000' },
  },
  {
    name: 'LinkedIn Pro',
    theme: { backgroundColor: '#0077B5', linkColor: '#FFFFFF', linkFontColor: '#0077B5', fontFamily: 'Montserrat', linkStyle: 'outline', linkColorHover: '#E0E0E0', linkFontColorHover: '#0077B5' },
  },
  {
    name: 'YouTube',
    theme: { backgroundColor: '#FF0000', linkColor: '#FFFFFF', linkFontColor: '#FF0000', fontFamily: 'Roboto', linkStyle: 'filled', linkColorHover: '#E60000', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'TikTok',
    theme: { backgroundColor: '#000000', linkColor: '#FFFFFF', linkFontColor: '#000000', fontFamily: 'Inter', linkStyle: 'filled', linkColorHover: '#E6E6E6', linkFontColorHover: '#000000' },
  },
  {
    name: 'GitHub',
    theme: { backgroundColor: '#24292e', linkColor: '#FFFFFF', linkFontColor: '#24292e', fontFamily: 'Roboto', linkStyle: 'outline', linkColorHover: '#E0E0E0', linkFontColorHover: '#24292e' },
  },
  {
    name: 'Spotify',
    theme: { backgroundColor: '#1DB954', linkColor: '#FFFFFF', linkFontColor: '#1DB954', fontFamily: 'Montserrat', linkStyle: 'filled', linkColorHover: '#1AA34A', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Discord',
    theme: { backgroundColor: '#5865F2', linkColor: '#FFFFFF', linkFontColor: '#5865F2', fontFamily: 'Inter', linkStyle: 'filled', linkColorHover: '#4752C4', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Pinterest',
    theme: { backgroundColor: '#BD081C', linkColor: '#FFFFFF', linkFontColor: '#BD081C', fontFamily: 'Montserrat', linkStyle: 'outline', linkColorHover: '#A50717', linkFontColorHover: '#FFFFFF' },
  },
  {
    name: 'Snapchat',
    theme: { backgroundColor: '#FFFC00', linkColor: '#000000', linkFontColor: '#FFFFFF', fontFamily: 'Inter', linkStyle: 'filled', linkColorHover: '#E6E300', linkFontColorHover: '#000000' },
  }
];

const ThemePreset = memo(({ preset, onUpdateTheme }: { preset: { name: string; theme: Theme }, onUpdateTheme: (theme: Theme) => void }) => (
  <div key={preset.name} className="text-center">
    <button
      onClick={() => onUpdateTheme(preset.theme)}
      className="w-full h-20 rounded-lg border-2 border-gray-200 flex items-center justify-center transition-transform transform hover:scale-105 focus:ring-2 focus:ring-primary"
      style={{ 
        background: preset.theme.backgroundColor.includes('linear-gradient') 
          ? preset.theme.backgroundColor 
          : preset.theme.backgroundColor,
        backgroundColor: preset.theme.backgroundColor.includes('linear-gradient') 
          ? undefined 
          : preset.theme.backgroundColor
      }}
      aria-label={`Aplicar tema ${preset.name}`}
    >
      <div 
        className="w-10 h-5 rounded" 
        style={{ 
          backgroundColor: preset.theme.linkColor,
          border: preset.theme.linkStyle === 'outline' ? `2px solid ${preset.theme.linkColor}` : 'none'
        }}
      ></div>
    </button>
    <p className="text-xs font-medium text-gray-600 mt-2">{preset.name}</p>
  </div>
));

const SocialInput = memo(({ icon, placeholder, value, onChange }: { 
  icon: React.ReactNode, 
  placeholder: string, 
  value: string, 
  onChange: (value: string) => void 
}) => (
  <div className="flex items-center">
    {icon}
    <input 
      type="text" 
      placeholder={placeholder} 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
));

export const AppearanceEditor: React.FC<AppearanceEditorProps> = ({ 
  profileInfo, 
  theme, 
  socials, 
  onUpdateProfileInfo, 
  onUpdateTheme, 
  onUpdateSocials 
}) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleProfileInfoChange = (field: keyof typeof profileInfo, value: string) => {
    onUpdateProfileInfo({ ...profileInfo, [field]: value });
  };
  
  const handleThemeChange = (field: keyof Theme, value: string) => {
    onUpdateTheme({ ...theme, [field]: value });
  };

  const handleSocialsChange = (platform: keyof Socials, value: string) => {
    onUpdateSocials({ ...socials, [platform]: value });
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      alert("Você precisa estar logado para fazer upload de uma imagem.");
      return;
    }

    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    setUploading(true);

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        const newAvatarUrl = `${data.publicUrl}?t=${new Date().getTime()}`;
        onUpdateProfileInfo({ ...profileInfo, profile_picture_url: newAvatarUrl });
      } else {
        throw new Error("Não foi possível obter a URL pública da imagem.");
      }
    } catch (error) {
      console.error('Erro no upload do avatar:', error);
      alert(`Erro ao fazer upload da imagem: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Perfil</h3>
        <div className="flex items-center space-x-4">
          <img 
            src={profileInfo.profile_picture_url || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            loading="lazy"
          />
          <div>
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              onChange={handleAvatarUpload}
              accept="image/png, image/jpeg, image/gif"
              disabled={uploading}
            />
            <label
              htmlFor="avatar-upload"
              className={`cursor-pointer text-sm font-semibold py-2 px-4 rounded-lg transition-colors ${
                uploading 
                  ? 'bg-gray-400 text-gray-800 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {uploading ? 'Carregando...' : 'Alterar Avatar'}
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
          <input
            type="text"
            value={profileInfo.username}
            onChange={(e) => handleProfileInfoChange('username', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-label="Nome de usuário"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Biografia</label>
          <textarea
            value={profileInfo.bio}
            onChange={(e) => handleProfileInfoChange('bio', e.target.value)}
            rows={3}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-label="Biografia"
          />
        </div>
      </div>

      {/* Social Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Social Icons</h3>
        <p className="text-sm text-gray-500">Adicione seus nomes de usuário para cada plataforma.</p>
        <div className="space-y-3">
          <SocialInput 
            icon={<Instagram className="h-5 w-5 text-gray-400 mr-3"/>}
            placeholder="Instagram username" 
            value={socials.instagram || ''} 
            onChange={(value) => handleSocialsChange('instagram', value)} 
          />
          <SocialInput 
            icon={<Twitter className="h-5 w-5 text-gray-400 mr-3"/>}
            placeholder="Twitter username" 
            value={socials.twitter || ''} 
            onChange={(value) => handleSocialsChange('twitter', value)} 
          />
          <SocialInput 
            icon={<TikTokIcon className="h-5 w-5 text-gray-400 mr-3"/>}
            placeholder="TikTok username" 
            value={socials.tiktok || ''} 
            onChange={(value) => handleSocialsChange('tiktok', value)} 
          />
          <SocialInput 
            icon={<Linkedin className="h-5 w-5 text-gray-400 mr-3"/>}
            placeholder="LinkedIn username" 
            value={socials.linkedin || ''} 
            onChange={(value) => handleSocialsChange('linkedin', value)} 
          />
          <SocialInput 
            icon={<Github className="h-5 w-5 text-gray-400 mr-3"/>}
            placeholder="GitHub username" 
            value={socials.github || ''} 
            onChange={(value) => handleSocialsChange('github', value)} 
          />
          <SocialInput 
            icon={<Youtube className="h-5 w-5 text-gray-400 mr-3"/>}
            placeholder="YouTube channel handle (e.g. @username)" 
            value={socials.youtube || ''} 
            onChange={(value) => handleSocialsChange('youtube', value)} 
          />
        </div>
      </div>
      
      {/* Themes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Temas</h3>
        <div className="grid grid-cols-3 gap-4">
          {themePresets.map((preset) => (
            <ThemePreset 
              key={preset.name} 
              preset={preset} 
              onUpdateTheme={onUpdateTheme} 
            />
          ))}
        </div>
      </div>

      {/* Customization */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Personalizar</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cor de Fundo</label>
          <input 
            type="color" 
            value={theme.backgroundColor} 
            onChange={(e) => handleThemeChange('backgroundColor', e.target.value)} 
            className="w-full h-10 mt-1 rounded-md"
            aria-label="Cor de fundo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cor do Link</label>
          <input 
            type="color" 
            value={theme.linkColor} 
            onChange={(e) => handleThemeChange('linkColor', e.target.value)} 
            className="w-full h-10 mt-1 rounded-md"
            aria-label="Cor do link"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cor da Fonte do Link</label>
          <input 
            type="color" 
            value={theme.linkFontColor} 
            onChange={(e) => handleThemeChange('linkFontColor', e.target.value)} 
            className="w-full h-10 mt-1 rounded-md"
            aria-label="Cor da fonte do link"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cor do Link (Hover)</label>
          <input 
            type="color" 
            value={theme.linkColorHover} 
            onChange={(e) => handleThemeChange('linkColorHover', e.target.value)} 
            className="w-full h-10 mt-1 rounded-md"
            aria-label="Cor do link ao passar o mouse"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cor da Fonte (Hover)</label>
          <input 
            type="color" 
            value={theme.linkFontColorHover} 
            onChange={(e) => handleThemeChange('linkFontColorHover', e.target.value)} 
            className="w-full h-10 mt-1 rounded-md"
            aria-label="Cor da fonte ao passar o mouse"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fonte</label>
          <select
            value={theme.fontFamily}
            onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            aria-label="Fonte"
          >
            {fonts.map(font => <option key={font} value={font}>{font}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Estilo do Botão</label>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <button
              onClick={() => handleThemeChange('linkStyle', 'filled')}
              className={`p-4 rounded-lg text-center font-semibold border-2 transition-all ${
                theme.linkStyle === 'filled' 
                  ? 'border-blue-500 ring-2 ring-blue-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: theme.linkColor, color: theme.linkFontColor }}
              aria-label="Estilo preenchido"
            >
              Preenchido
            </button>
            <button
              onClick={() => handleThemeChange('linkStyle', 'outline')}
              className={`p-4 rounded-lg text-center font-semibold border-2 bg-transparent transition-all ${
                theme.linkStyle === 'outline' 
                  ? 'border-blue-500 ring-2 ring-blue-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ borderColor: theme.linkColor, color: theme.linkColor }}
              aria-label="Estilo contornado"
            >
              Contorno
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};