// Importando os módulos necessários
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// Configurando os cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função principal
serve(async (req) => {
  // Tratando requisições OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Obtendo dados do corpo da requisição
    const { profileId, linkId } = await req.json();

    if (!profileId || !linkId) {
      return new Response(JSON.stringify({ error: 'Profile ID and Link ID are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Criando cliente Supabase (usando service role para acesso irrestrito)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Obtendo o perfil
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('links')
      .eq('id', profileId)
      .single();

    if (profileError) {
      return new Response(JSON.stringify({ error: profileError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Atualizando o contador de cliques no link específico
    const updatedLinks = profile.links.map((link: any) => {
      if (link.id === linkId) {
        return { ...link, clickCount: (link.clickCount || 0) + 1 };
      }
      return link;
    });

    // Atualizando o perfil com os links atualizados
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ links: updatedLinks })
      .eq('id', profileId);

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Retornando sucesso
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});