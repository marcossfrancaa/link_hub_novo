import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const SimpleLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          setMessage(`Erro no login: ${error.message}`);
        } else {
          setMessage('Login realizado com sucesso!');
          // Redirecionar para o dashboard após login
          setTimeout(() => {
            navigate('/admin');
          }, 1000);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) {
          setMessage(`Erro no cadastro: ${error.message}`);
        } else {
          setMessage('Cadastro realizado com sucesso! Verifique seu email para confirmação.');
          // Redirecionar para login após cadastro
          setTimeout(() => {
            setIsLogin(true);
          }, 2000);
        }
      }
    } catch (err) {
      setMessage(`Erro inesperado: ${err}`);
    }
    
    setLoading(false);
  };

  if (session) {
    return (
      <div className="p-4">
        <p>Logado como: {session.user.email}</p>
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            navigate('/');
          }}
          className="bg-red-500 text-white px-4 py-2 rounded mt-2"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleAuth} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Cadastro'}
        </h2>
        
        {message && (
          <div className={`p-3 mb-4 rounded ${
            message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="seu@email.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Sua senha"
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
        </button>

        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-blue-500 hover:underline"
        >
          {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
        </button>
      </form>
    </div>
  );
};