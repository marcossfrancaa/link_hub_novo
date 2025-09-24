import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const ManualSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('Starting manual signup process...');
      
      // Step 1: Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setMessage(`Erro na criação do usuário: ${authError.message}`);
        setLoading(false);
        return;
      }

      console.log('Auth user created:', authData);

      // Step 2: Wait a bit and then create the profile manually
      if (authData.user) {
        setMessage('Usuário criado! Criando perfil...');
        
        // Wait for auth to be fully processed
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const username = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
        
        const profileData = {
          id: authData.user.id,
          username: username,
          bio: 'Bem-vindo ao Link Hub Creator!',
          profile_picture_url: '',
          links: [],
          theme: {
            backgroundColor: '#ffffff',
            linkColor: '#3b82f6',
            linkFontColor: '#ffffff',
            fontFamily: 'Inter',
            linkStyle: 'filled',
            linkColorHover: '#2563eb',
            linkFontColorHover: '#ffffff',
          },
          socials: {},
          updated_at: new Date().toISOString(),
        };

        console.log('Creating profile:', profileData);

        const { data: profileResult, error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select();

        if (profileError) {
          console.error('Profile error:', profileError);
          setMessage(`Usuário criado, mas erro no perfil: ${profileError.message}`);
        } else {
          console.log('Profile created:', profileResult);
          setMessage('✅ Conta criada com sucesso! Fazendo login...');
          
          // Auto login
          setTimeout(() => {
            navigate('/admin');
          }, 1000);
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      setMessage(`Erro inesperado: ${err}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-2xl shadow-xl w-96 max-w-md transform transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">🔧</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Cadastro Manual</h2>
          <p className="text-gray-600 text-sm mt-2">Método alternativo para criar sua conta</p>
        </div>
        
        {message && (
          <div className={`p-4 mb-4 rounded-lg text-sm ${
            message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 
            message.includes('Erro') ? 'bg-red-50 text-red-700 border border-red-200' : 
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📧 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔒 Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : (
              <>🛠️ Criar Conta Manual</>
            )}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            ← Voltar ao login normal
          </a>
        </div>
      </form>
    </div>
  );
};