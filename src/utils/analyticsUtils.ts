import { supabase } from '@/integrations/supabase/client';

export interface LinkAnalytics {
  id: string;
  title: string;
  url: string;
  clickCount: number;
  type: string;
}

export interface ProfileAnalytics {
  totalClicks: number;
  mostClickedLink: LinkAnalytics | null;
  links: LinkAnalytics[];
  createdAt: string;
}

export const getProfileAnalytics = async (profileId: string): Promise<ProfileAnalytics | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('links, created_at')
      .eq('id', profileId)
      .single();

    if (error) {
      console.error('Erro ao obter perfil para analytics:', error);
      return null;
    }

    if (!profile || !profile.links) {
      return null;
    }

    // Converter links para o formato de analytics
    const links: LinkAnalytics[] = profile.links.map((link: any) => ({
      id: link.id,
      title: link.title,
      url: link.url,
      clickCount: link.clickCount || 0,
      type: link.type
    }));

    // Calcular totais
    const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0);
    
    // Encontrar o link mais clicado
    const mostClickedLink = links.length > 0 
      ? links.reduce((prev, current) => 
          (prev.clickCount > current.clickCount) ? prev : current
        ) 
      : null;

    return {
      totalClicks,
      mostClickedLink,
      links,
      createdAt: profile.created_at
    };
  } catch (error) {
    console.error('Erro ao calcular analytics:', error);
    return null;
  }
};

export const resetLinkClicks = async (profileId: string, linkId?: string): Promise<boolean> => {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('links')
      .eq('id', profileId)
      .single();

    if (fetchError) {
      console.error('Erro ao obter perfil:', fetchError);
      return false;
    }

    if (!profile || !profile.links) {
      return false;
    }

    // Resetar cliques de um link específico ou de todos os links
    const updatedLinks = profile.links.map((link: any) => {
      if (linkId) {
        // Resetar apenas o link específico
        if (link.id === linkId) {
          return { ...link, clickCount: 0 };
        }
        return link;
      } else {
        // Resetar todos os links
        return { ...link, clickCount: 0 };
      }
    });

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ links: updatedLinks })
      .eq('id', profileId);

    if (updateError) {
      console.error('Erro ao resetar cliques:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao resetar cliques:', error);
    return false;
  }
};

export const getTopPerformingLinks = (analytics: ProfileAnalytics, limit: number = 5): LinkAnalytics[] => {
  return [...analytics.links]
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, limit);
};

export const getLinkTypeDistribution = (analytics: ProfileAnalytics): Record<string, number> => {
  const distribution: Record<string, number> = {};
  
  analytics.links.forEach(link => {
    distribution[link.type] = (distribution[link.type] || 0) + 1;
  });
  
  return distribution;
};