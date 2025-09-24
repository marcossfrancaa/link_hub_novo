import React, { useEffect } from 'react';
import type { UserProfile, Link as LinkType, Socials } from '@/types';
import { Instagram, Twitter, Linkedin, Github, Youtube } from 'lucide-react';

// A simple component for the TikTok icon
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 12a4 4 0 1 0 4 4V8a8 8 0 1 1-8-8"/>
  </svg>
);

interface ProfilePageProps {
  profile: UserProfile;
  onLinkClick: (linkId: string) => void;
}

const LinkCard: React.FC<{ link: LinkType, theme: UserProfile['theme'], onClick: () => void }> = ({ link, theme, onClick }) => {
  const baseClasses = "dynamic-link-card block w-full text-center py-3 px-4 rounded-xl shadow-sm transition-transform transform hover:scale-105 transition-colors duration-300 font-medium";

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
      onClick={onClick}
      className={baseClasses}
      style={currentStyle}
      aria-label={`Link to ${link.title}`}
    >
      {link.title}
    </a>
  );
};

const SocialIcons: React.FC<{ socials: Socials, theme: UserProfile['theme'] }> = ({ socials, theme }) => {
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
};

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


export const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onLinkClick }) => {
    
    useEffect(() => {
        document.body.style.backgroundColor = profile.theme.backgroundColor;
        const fontId = 'google-font-profile-link';
        let link = document.getElementById(fontId) as HTMLLinkElement;
        if (!link) {
            link = document.createElement('link');
            link.id = fontId;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        link.href = `https://fonts.googleapis.com/css2?family=${profile.theme.fontFamily.replace(/ /g, '+')}&display=swap`;
        document.body.style.fontFamily = `'${profile.theme.fontFamily}', sans-serif`;
        
        const styleId = 'dynamic-profile-styles';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        const { linkStyle, linkColorHover, linkFontColorHover } = profile.theme;

        const hoverBackgroundColor = linkColorHover || profile.theme.linkColor;
        const hoverFontColor = linkFontColorHover || profile.theme.linkFontColor;

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


    }, [profile.theme]);
    
    useEffect(() => {
        document.title = `@${profile.username} | Link Hub Creator`;

        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', profile.bio);
        
        return () => {
            document.title = 'Link Hub Creator';
            if (metaDescription) {
                metaDescription.setAttribute('content', 'A modern, beautiful, and highly optimized web frontend for a Linktree-style link hub.');
            }
             const styleTag = document.getElementById('dynamic-profile-styles');
            if(styleTag) {
                styleTag.remove();
            }
        };

    }, [profile.username, profile.bio]);
    
    const renderContentBlock = (link: LinkType) => {
        switch (link.type) {
            case 'link':
                return <LinkCard link={link} theme={profile.theme} onClick={() => onLinkClick(link.id)} />;
            case 'header':
                return <h2 className="text-xl font-bold text-center" style={{ color: profile.theme.linkColor }}>{link.title}</h2>;
            case 'youtube':
                const youtubeUrl = getYoutubeEmbedUrl(link.url);
                return youtubeUrl ? (
                    <div className="aspect-w-16 aspect-h-9">
                        <iframe src={youtubeUrl} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full rounded-lg"></iframe>
                    </div>
                ) : null;
            case 'spotify':
                const spotifyUrl = getSpotifyEmbedUrl(link.url);
                return spotifyUrl ? (
                    <iframe src={spotifyUrl} width="100%" height="80" frameBorder="0" allow="encrypted-media" className="rounded-lg"></iframe>
                ) : null;
            default:
                return null;
        }
    };

    return (
    <div className="min-h-screen w-full transition-colors duration-500" style={{ backgroundColor: profile.theme.backgroundColor, color: profile.theme.linkFontColor }}>
      <main className="max-w-md mx-auto p-4 px-6">
        <div className="flex flex-col items-center text-center pt-8 pb-6">
          <img
            src={profile.profile_picture_url}
            alt={profile.username}
            className="w-20 h-20 rounded-full object-cover shadow-lg mb-4 border-3"
            style={{ borderColor: profile.theme.linkColor }}
          />
          <h1 className="text-xl font-bold break-all" style={{ color: profile.theme.linkColor }}>@{profile.username}</h1>
          <p className="mt-2 text-sm px-4" style={{ color: profile.theme.linkColor }}>{profile.bio}</p>
          {profile.socials && <SocialIcons socials={profile.socials} theme={profile.theme} />}
        </div>

        <div className="space-y-3 pb-8">
          {profile.links.map((link) => (
            <div key={link.id}>
              {renderContentBlock(link)}
            </div>
          ))}
        </div>
        
        <footer className="text-center pb-4 text-xs" style={{color: profile.theme.linkColor, opacity: 0.6}}>
            Powered by Link Hub
        </footer>
      </main>
    </div>
  );
};