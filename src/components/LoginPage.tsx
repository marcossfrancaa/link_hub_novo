import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LinkIcon } from './icons';

export const LoginPage: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session) {
      navigate('/admin');
    }
  }, [session, navigate]);

  useEffect(() => {
    setIsSignUp(location.pathname === '/register');
    setMessage('');
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) {
          setMessage(`Erro no cadastro: ${error.message}`);
        } else {
          setMessage('✅ Conta criada com sucesso! Verifique seu email para confirmação.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          setMessage(`Erro no login: ${error.message}`);
        } else {
          // Navegação automática acontece via AuthContext
        }
      }
    } catch (err) {
      setMessage(`Erro inesperado: ${err}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 transform transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <LinkIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Link Hub Creator
          </h2>
          <p className="text-gray-600 text-sm">
            {isSignUp ? '🚀 Crie sua conta e comece já!' : '👋 Entre na sua conta'}
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg text-sm ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📧 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder={isSignUp ? "Mínimo 6 caracteres" : "Sua senha"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105"
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
              <>
                {isSignUp ? '✨ Criar Conta' : '🚀 Entrar'}
              </>
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage('');
              navigate(isSignUp ? '/login' : '/register');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {isSignUp ? (
              <>
                <span className="text-gray-600">Já tem conta?</span> 👆 Entre aqui
              </>
            ) : (
              <>
                <span className="text-gray-600">Ainda não tem conta?</span> 🆕 Crie uma
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};