import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Copy, Share2 } from 'lucide-react';

export const ShareProfile: React.FC = () => {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!profile) return;
    
    const profileUrl = `${window.location.origin}/profile/${profile.username}`;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareProfile = async () => {
    if (!profile) return;
    
    const profileUrl = `${window.location.origin}/profile/${profile.username}`;
    
    // Usar Web Share API se disponível
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de ${profile.username}`,
          text: profile.bio,
          url: profileUrl
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
        // Fallback para copiar
        copyToClipboard();
      }
    } else {
      // Fallback para copiar
      copyToClipboard();
    }
  };

  if (!profile) return null;

  return (
    <div className="mt-4">
      <button
        onClick={shareProfile}
        className="flex items-center justify-center w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Share2 className="h-5 w-5 mr-2" />
        Compartilhar Perfil
      </button>
      
      {copied && (
        <div className="mt-2 text-green-600 text-sm text-center">
          Link copiado para a área de transferência!
        </div>
      )}
    </div>
  );
};