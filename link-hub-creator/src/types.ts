export interface Link {
  id: string;
  type: 'link' | 'header' | 'youtube' | 'spotify';
  title: string;
  url: string;
  clickCount: number;
}

export interface Theme {
  backgroundColor: string;
  linkColor: string;
  linkFontColor: string;
  fontFamily: string;
  linkStyle: 'filled' | 'outline';
  linkColorHover: string;
  linkFontColorHover: string;
}

export interface Socials {
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
}

export interface UserProfile {
  id?: string; // This will be the user's UUID from Supabase auth
  username: string;
  profile_picture_url: string;
  bio: string;
  links: Link[];
  theme: Theme;
  socials?: Socials;
}