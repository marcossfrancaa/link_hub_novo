import React, { useState } from 'react';
import type { UserProfile, Theme, Socials } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Instagram, Twitter, Linkedin, Github, Youtube } from 'lucide-react';

// A simple component for the TikTok icon
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 12a4 4 0 1 0 4 4V8a8 8 0 1 1-8-8"/>
  </svg>
);

interface AppearanceEditorProps {
  profileInfo: { username: string; bio: string; profile_picture_url: string; };
  theme: Theme;
  socials: Socials;
  onUpdateProfileInfo: (info: { username: string; bio: string; profile_picture_url: string; }) => void;
  onUpdateTheme: (theme: Theme) => void;
  onUpdateSocials: (socials: Socials) => void;
}

const fonts = ["Inter", "Roboto", "Lato", "Montserrat", "Oswald", "Poppins"];

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
  }
];


export const AppearanceEditor: React.FC<AppearanceEditorProps> = ({ profileInfo, theme, socials, onUpdateProfileInfo, onUpdateTheme, onUpdateSocials }) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleProfileInfoChange = (field: keyof typeof profileInfo, value: string) => {
    onUpdateProfileInfo({ ...profileInfo, [field]: value });
  };
  
  const handleThemeChange = (field: keyof Theme, value: string) => {
      onUpdateTheme({...theme, [field]: value})
  }

  const handleSocialsChange = (platform: keyof Socials, value: string) => {
    onUpdateSocials({ ...socials, [platform]: value });
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = prompt('Cole a URL da imagem:');
    if (url) {
      onUpdateProfileInfo({ ...profileInfo, profile_picture_url: url });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Perfil</h3>
        <div className="flex items-center space-x-4">
            <img src={profileInfo.profile_picture_url} alt="Profile" className="w-16 h-16 rounded-full object-cover"/>
            <div>
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                onChange={handleAvatarUpload}
                accept="image/png, image/jpeg"
                disabled={uploading}
              />
              <label
                htmlFor="avatar-upload"
                className={`cursor-pointer text-sm font-semibold py-2 px-4 rounded-lg transition-colors ${uploading ? 'bg-gray-400 text-gray-800' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            />
        </div>
         <div>
            <label className="block text-sm font-medium text-gray-700">Biografia</label>
            <textarea
                value={profileInfo.bio}
                onChange={(e) => handleProfileInfoChange('bio', e.target.value)}
                rows={3}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            />
        </div>
      </div>

      {/* Social Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Social Icons</h3>
        <p className="text-sm text-gray-500">Add your username for each platform.</p>
        <div className="space-y-3">
          <div className="flex items-center">
            <Instagram className="h-5 w-5 text-gray-400 mr-3"/>
            <input type="text" placeholder="Instagram username" value={socials.instagram || ''} onChange={(e) => handleSocialsChange('instagram', e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"/>
          </div>
          <div className="flex items-center">
            <Twitter className="h-5 w-5 text-gray-400 mr-3"/>
            <input type="text" placeholder="Twitter username" value={socials.twitter || ''} onChange={(e) => handleSocialsChange('twitter', e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"/>
          </div>
          <div className="flex items-center">
            <TikTokIcon className="h-5 w-5 text-gray-400 mr-3"/>
            <input type="text" placeholder="TikTok username" value={socials.tiktok || ''} onChange={(e) => handleSocialsChange('tiktok', e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"/>
          </div>
          <div className="flex items-center">
            <Linkedin className="h-5 w-5 text-gray-400 mr-3"/>
            <input type="text" placeholder="LinkedIn username" value={socials.linkedin || ''} onChange={(e) => handleSocialsChange('linkedin', e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"/>
          </div>
          <div className="flex items-center">
            <Github className="h-5 w-5 text-gray-400 mr-3"/>
            <input type="text" placeholder="GitHub username" value={socials.github || ''} onChange={(e) => handleSocialsChange('github', e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"/>
          </div>
           <div className="flex items-center">
            <Youtube className="h-5 w-5 text-gray-400 mr-3"/>
            <input type="text" placeholder="YouTube channel handle (e.g. @username)" value={socials.youtube || ''} onChange={(e) => handleSocialsChange('youtube', e.target.value)} className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"/>
          </div>
        </div>
      </div>
      
      {/* Themes */}
       <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Temas</h3>
        <div className="grid grid-cols-3 gap-4">
            {themePresets.map((preset) => (
                <div key={preset.name} className="text-center">
                    <button
                        onClick={() => onUpdateTheme(preset.theme)}
                        className="w-full h-20 rounded-lg border-2 border-gray-200 flex items-center justify-center transition-transform transform hover:scale-105 focus:ring-2 focus:ring-primary"
                        style={{ backgroundColor: preset.theme.backgroundColor }}
                    >
                        <div className="w-10 h-5 rounded" style={{ backgroundColor: preset.theme.linkColor }}></div>
                    </button>
                    <p className="text-xs font-medium text-gray-600 mt-2">{preset.name}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Customization */}
       <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Personalizar</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cor de Fundo</label>
          <input type="color" value={theme.backgroundColor} onChange={(e) => handleThemeChange('backgroundColor', e.target.value)} className="w-full h-10 mt-1 rounded-md"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cor do Link</label>
          <input type="color" value={theme.linkColor} onChange={(e) => handleThemeChange('linkColor', e.target.value)} className="w-full h-10 mt-1 rounded-md"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Cor da Fonte do Link</label>
             <input type="color" value={theme.linkFontColor} onChange={(e) => handleThemeChange('linkFontColor', e.target.value)} className="w-full h-10 mt-1 rounded-md"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Cor do Link (Hover)</label>
             <input type="color" value={theme.linkColorHover} onChange={(e) => handleThemeChange('linkColorHover', e.target.value)} className="w-full h-10 mt-1 rounded-md"/>
        </div>
         <div>
            <label className="block text-sm font-medium text-gray-700">Cor da Fonte (Hover)</label>
             <input type="color" value={theme.linkFontColorHover} onChange={(e) => handleThemeChange('linkFontColorHover', e.target.value)} className="w-full h-10 mt-1 rounded-md"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fonte</label>
          <select
            value={theme.fontFamily}
            onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          >
            {fonts.map(font => <option key={font} value={font}>{font}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Estilo do Botão</label>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <button
              onClick={() => handleThemeChange('linkStyle', 'filled')}
              className={`p-4 rounded-lg text-center font-semibold border-2 ${
                theme.linkStyle === 'filled' ? 'border-primary ring-2 ring-primary' : 'border-gray-300'
              } transition-all`}
              style={{ backgroundColor: theme.linkColor, color: theme.linkFontColor }}
            >
              Filled
            </button>
            <button
              onClick={() => handleThemeChange('linkStyle', 'outline')}
              className={`p-4 rounded-lg text-center font-semibold border-2 bg-transparent ${
                theme.linkStyle === 'outline' ? 'border-primary ring-2 ring-primary' : 'border-gray-300'
              } transition-all`}
               style={{ borderColor: theme.linkColor, color: theme.linkColor }}
            >
              Outline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};