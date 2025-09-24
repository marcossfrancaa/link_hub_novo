import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserProfile, Link as LinkType, Theme, Socials } from '@/types';
import { LinksEditor } from './LinksEditor';
import { AppearanceEditor } from './AppearanceEditor';
import { ProfilePage } from './ProfilePage';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ShareProfile } from './ShareProfile';
import { LinkIcon, LogoutIcon, PaletteIcon, BarChartIcon } from './icons';

type AdminTab = 'links' | 'appearance' | 'analytics';

export const AdminDashboard: React.FC = () => {
  const { profile, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('links');
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Carregando perfil...</div>;
  }

  const handleUpdateLinks = async (newLinks: LinkType[]) => {
    try {
      await updateProfile({ ...profile, links: newLinks });
    } catch (error) {
      console.error('Erro ao atualizar links:', error);
    }
  };

  const handleUpdateTheme = async (newTheme: Theme) => {
    try {
      await updateProfile({ ...profile, theme: newTheme });
    } catch (error) {
      console.error('Erro ao atualizar tema:', error);
    }
  };
  
  const handleUpdateProfileInfo = async (info: { username: string; bio: string; profile_picture_url: string; }) => {
    try {
      await updateProfile({ ...profile, ...info });
    } catch (error) {
      console.error('Erro ao atualizar informações do perfil:', error);
    }
  };

  const handleUpdateSocials = async (newSocials: Socials) => {
    try {
      await updateProfile({ ...profile, socials: newSocials });
    } catch (error) {
      console.error('Erro ao atualizar redes sociais:', error);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar / Editor */}
      <div className="w-full md:w-2/5 lg:w-1/3 bg-white p-6 shadow-lg flex flex-col overflow-y-auto">
        <header className="flex justify-between items-center mb-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-800">Painel Admin</h1>
          <button
            onClick={logout}
            className="flex items-center text-sm text-gray-600 hover:text-primary transition-colors"
            aria-label="Sair"
          >
            <LogoutIcon className="h-5 w-5 mr-1" />
            Sair
          </button>
        </header>
        
        <div className="flex border-b border-gray-200 mb-6 flex-shrink-0">
          <TabButton
            icon={<LinkIcon className="h-5 w-5 mr-2" />}
            label="Links"
            isActive={activeTab === 'links'}
            onClick={() => setActiveTab('links')}
          />
          <TabButton
            icon={<PaletteIcon className="h-5 w-5 mr-2" />}
            label="Aparência"
            isActive={activeTab === 'appearance'}
            onClick={() => setActiveTab('appearance')}
          />
          <TabButton
            icon={<BarChartIcon className="h-5 w-5 mr-2" />}
            label="Analytics"
            isActive={activeTab === 'analytics'}
            onClick={() => {
              setActiveTab('analytics');
              setIsAnalyticsOpen(true);
            }}
          />
        </div>

        <div className="flex-grow">
          {activeTab === 'links' && (
            <LinksEditor links={profile.links} onUpdateLinks={handleUpdateLinks} />
          )}
          {activeTab === 'appearance' && (
            <AppearanceEditor
              profileInfo={{ username: profile.username, bio: profile.bio, profile_picture_url: profile.profile_picture_url }}
              theme={profile.theme}
              socials={profile.socials || {}}
              onUpdateProfileInfo={handleUpdateProfileInfo}
              onUpdateTheme={handleUpdateTheme}
              onUpdateSocials={handleUpdateSocials}
            />
          )}
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <button
                onClick={() => setIsAnalyticsOpen(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Ver Analytics Completo
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-6 border-t pt-4 flex-shrink-0 space-y-3">
          <a
            href={`/profile/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center block bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Ver Perfil Público
          </a>
          <ShareProfile />
        </div>
      </div>

      {/* Preview */}
      <div className="hidden md:flex flex-1 items-center justify-center p-8 bg-gray-200">
        <div className="w-full max-w-sm mx-auto">
          <div className="relative border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
            <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white">
               <div className="h-full w-full overflow-y-auto">
                 <ProfilePage profile={profile} onLinkClick={() => {}} />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard Modal */}
      <AnalyticsDashboard 
        isOpen={isAnalyticsOpen} 
        onClose={() => setIsAnalyticsOpen(false)} 
      />
    </div>
  );
};

const TabButton: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center p-3 text-sm font-semibold border-b-2 transition-all duration-300 ${
      isActive
        ? 'border-primary text-primary'
        : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
    }`}
  >
    {icon}
    {label}
  </button>
);