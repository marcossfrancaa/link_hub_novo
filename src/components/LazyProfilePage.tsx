import React, { useEffect, useState, memo } from 'react';
import type { UserProfile, Link as LinkType, Socials } from '@/types';
import { Instagram, Twitter, Linkedin, Github, Youtube } from 'lucide-react';
import { LazyImage } from './LazyImage';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// A simple component for the TikTok icon
const TikTokIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 12a4 4 0 1 0 4 4V8a8 8 0 1 1-8-8"/>
  </svg>
));

interface LazyProfilePageProps {
  profile: UserProfile;
  onLinkClick?: (linkId: string) => void;
}

const LinkCard = memo(({ link, theme, onClick }: { link: LinkType, theme: UserProfile['theme'], onClick: () => void }) => {
  const baseClasses = "dynamic-link-card block w-full text-center py-3 px-4 rounded-xl shadow-sm transition-transform transform hover:scale-105 transition-colors duration-200 font-medium";

  const styles = {
    filled: {
      backgroundColor: theme.linkColor,
      color: theme.linkFontColor,
    },
    outline: {
      backgroundColor: 'transparent',
      color: theme.linkColor,
      border: `2px solid ${theme.linkColor}`,
    }
  };

  const currentStyle = styles[theme.linkStyle as keyof typeof styles] || styles.filled;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.preventDefault();
        onClick();
        // Abrir o link em uma nova aba após registrar o clique
        window.open(link.url, '_blank', 'noopener,noreferrer');
      }}
      className={baseClasses}
      style={currentStyle}
      aria-label={`Link to ${link.title}`}
    >
      {link.title}
    </a>
  );
});

const SocialIcons = memo(({ socials, theme }: { socials: Socials, theme: UserProfile['theme'] }) => {
  const socialPlatforms = {
    instagram: { icon: <Instagram size={20} />, url: `https://instagram.com/${socials.instagram}` },
    twitter: { icon: <Twitter size={20} />, url: `https://twitter.com/${socials.twitter}` },
    tiktok: { icon: <TikTokIcon style={{width: 20, height: 20}} />, url: `https://tiktok.com/@${socials.tiktok}` },
    linkedin: { icon: <Linkedin size={20} />, url: `https://linkedin.com/in/${socials.linkedin}` },
    github: { icon: <Github size={20} />, url: `https://github.com/${socials.github}` },
    youtube: { icon: <Youtube size={20} />, url: `https://youtube.com/${socials.youtube}` },
  };

  return (
    <div className="flex justify-center items-center space-x-4 mt-4">
      {Object.entries(socialPlatforms).map(([key, value]) => {
        if (socials[key as keyof Socials]) {
          return (
            <a
              key={key}
              href={value.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform transform hover:scale-110"
              style={{ color: theme.linkColor }}
              aria-label={`Link to ${key}`}
            >
              {value.icon}
            </a>
          );
        }
        return null;
      })}
    </div>
  );
});

const getYoutubeEmbedUrl = (url: string): string | null => {
    let videoId = null;
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            videoId = match[1];
            break;
        }
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const getSpotifyEmbedUrl = (url: string): string | null => {
    const match = url.match(/https?:\/\/open\.spotify\.com\/(track|playlist|album|artist)\/([a-zA-Z0-9]+)/);
    if (match && match[1] && match[2]) {
        return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
    }
    return null;
};

const ContentBlock = memo(({ link, theme, onLinkClick }: { link: LinkType, theme: UserProfile['theme'], onLinkClick: (id: string) => void }) => {
  switch (link.type) {
    case 'link':
      return <LinkCard link={link} theme={theme} onClick={() => onLinkClick(link.id)} />;
    case 'header':
      return <h2 className="text-xl font-bold text-center" style={{ color: theme.linkColor }}>{link.title}</h2>;
    case 'youtube':
      const youtubeUrl = getYoutubeEmbedUrl(link.url);
      return youtubeUrl ? (
        <div className="aspect-w-16 aspect-h-9">
          <iframe 
            src={youtubeUrl} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen 
            className="w-full h-full rounded-lg"
            loading="lazy"
          ></iframe>
        </div>
      ) : null;
    case 'spotify':
      const spotifyUrl = getSpotifyEmbedUrl(link.url);
      return spotifyUrl ? (
        <iframe 
          src={spotifyUrl} 
          width="100%" 
          height="80" 
          frameBorder="0" 
          allow="encrypted-media" 
          className="rounded-lg"
          loading="lazy"
        ></iframe>
      ) : null;
    default:
      return null;
  }
});

export const LazyProfilePage: React.FC<LazyProfilePageProps> = ({ profile, onLinkClick }) => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isIntersecting && !isLoaded) {
      // Apply theme when component is in view
      document.body.style.backgroundColor = profile.theme.backgroundColor;
      document.body.style.fontFamily = `'${profile.theme.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
      
      const styleId = 'dynamic-profile-styles';
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      const { linkStyle, linkColorHover, linkFontColorHover, linkColor, linkFontColor } = profile.theme;

      const hoverBackgroundColor = linkColorHover || linkColor;
      const hoverFontColor = linkFontColorHover || linkFontColor;

      let hoverCss = '';
      if (linkStyle === 'filled') {
        hoverCss = `
          .dynamic-link-card:hover {
            background-color: ${hoverBackgroundColor} !important;
            color: ${hoverFontColor} !important;
          }
        `;
      } else { // outline
        hoverCss = `
          .dynamic-link-card:hover {
            background-color: ${hoverBackgroundColor} !important;
            color: ${hoverFontColor} !important;
            border-color: ${hoverBackgroundColor} !important;
          }
        `;
      }

      styleElement.innerHTML = hoverCss;
      
      setIsLoaded(true);
    }
  }, [isIntersecting, profile.theme, isLoaded]);

  const handleLinkClick = async (linkId: string) => {
    // Chamar a função edge para contar o clique
    try {
      const response = await fetch('/functions/v1/link-click-counter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          profileId: profile.id, 
          linkId 
        })
      });
      
      if (!response.ok) {
        console.error('Erro ao contar clique:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao contar clique:', error);
    }
    
    // Chamar o callback se fornecido
    if (onLinkClick) {
      onLinkClick(linkId);
    }
  };

  return (
    <div 
      ref={ref}
      className="min-h-screen w-full transition-colors duration-300"
      style={{ 
        backgroundColor: isLoaded ? profile.theme.backgroundColor : '#ffffff',
        color: isLoaded ? profile.theme.linkFontColor : '#000000'
      }}
    >
      {isLoaded ? (
        <main className="max-w-md mx-auto p-4 px-6">
          <div className="flex flex-col items-center text-center pt-8 pb-6">
            <LazyImage
              src={profile.profile_picture_url}
              alt={profile.username}
              className="w-20 h-20 rounded-full object-cover shadow-lg mb-4 border-3"
              style={{ borderColor: profile.theme.linkColor }}
              decoding="async"
            />
            <h1 className="text-xl font-bold break-all" style={{ color: profile.theme.linkColor }}>@{profile.username}</h1>
            <p className="mt-2 text-sm px-4" style={{ color: profile.theme.linkColor }}>{profile.bio}</p>
            {profile.socials && <SocialIcons socials={profile.socials} theme={profile.theme} />}
          </div>

          <div className="space-y-3 pb-8">
            {profile.links.map((link) => (
              <div key={link.id}>
                <ContentBlock link={link} theme={profile.theme} onLinkClick={handleLinkClick} />
              </div>
            ))}
          </div>
          
          <footer className="text-center pb-4 text-xs" style={{color: profile.theme.linkColor, opacity: 0.6}}>
            Powered by Link Hub
          </footer>
        </main>
      ) : (
        // Skeleton loading state
        <div className="max-w-md mx-auto p-4 px-6">
          <div className="flex flex-col items-center text-center pt-8 pb-6">
            <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="space-y-3 pb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};