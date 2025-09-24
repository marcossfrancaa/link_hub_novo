import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const SimpleLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { session } = useAuth();

  const testConnection = async () => {
    setLoading(true);
    setMessage('Testando conexão...');
    
    try {
      // Test 1: Basic connection
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) {
        setMessage(`Erro na conexão com DB: ${error.message} (Código: ${error.code})`);
        return;
      }
      
      // Test 2: Auth settings
      const { data: authData, error: authError } = await supabase.auth.getSettings();
      if (authError) {
        setMessage(`Erro nas configurações de auth: ${authError.message}`);
        return;
      }
      
      setMessage(`✅ Conexão OK! ✅ Auth OK! Settings: ${JSON.stringify(authData)}`);
      
    } catch (err) {
      setMessage(`Erro de conexão: ${err}`);
    }
    
    setLoading(false);
  };

  const testSignUpMinimal = async () => {
    setLoading(true);
    setMessage('Testando cadastro mínimo...');
    
    try {
      // Try the most minimal signup possible
      const testEmail = `test${Date.now()}@test.com`;
      const testPassword = '123456789';
      
      // Try direct API call as fallback
      const response = await fetch(`https://wijvqvvmpvltgjwamytg.supabase.co/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpanZxdnZtcHZsdGdqd2FteXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDcxNDQsImV4cCI6MjA3NDI4MzE0NH0.sxtO6JZ5MmFI6N_YPlHSxDZ5RoMmcRVfLgoVxB9jcOA',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        setMessage(`✅ API direta funcionou! Status: ${response.status}`);
        console.log('Direct API success:', responseData);
      } else {
        setMessage(`❌ API direta falhou: ${response.status} - ${responseData.message || 'Erro desconhecido'}`);
        console.error('Direct API error:', responseData);
      }
      
    } catch (err) {
      setMessage(`❌ Erro catch: ${err}`);
      console.error('Catch error:', err);
    }
    
    setLoading(false);
  };

  const checkAuthConfig = async () => {
    setLoading(true);
    setMessage('Verificando configurações de auth...');
    
    try {
      // Test the actual signup endpoint with a POST request
      const response = await fetch(`https://wijvqvvmpvltgjwamytg.supabase.co/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpanZxdnZtcHZsdGdqd2FteXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDcxNDQsImV4cCI6MjA3NDI4MzE0NH0.sxtO6JZ5MmFI6N_YPlHSxDZ5RoMmcRVfLgoVxB9jcOA',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@test.com',
          password: '123456789'
        })
      });
      
      const data = await response.text();
      
      if (response.status === 422) {
        setMessage(`✅ Signup habilitado! Status: ${response.status} (Erro de validação esperado)`);
      } else if (response.status === 405) {
        setMessage(`❌ Signup DESABILITADO! Status: ${response.status} - Method Not Allowed`);
      } else if (response.status === 200 || response.status === 201) {
        setMessage(`✅ Signup funcionando! Status: ${response.status}`);
      } else {
        setMessage(`⚠️ Status inesperado: ${response.status} - ${data}`);
      }
      
    } catch (err) {
      setMessage(`❌ Erro verificando auth: ${err}`);
      console.error('Auth check error:', err);
    }
    
    setLoading(false);
  };

  const testPasswordPolicy = async () => {
    setLoading(true);
    setMessage('Testando diferentes políticas de senha...');
    
    const passwords = [
      { pwd: '123456', desc: 'Simples (6 dígitos)' },
      { pwd: '12345678', desc: 'Simples (8 dígitos)' },
      { pwd: 'Test123!', desc: 'Complexa (maiúscula, número, especial)' },
      { pwd: 'TestPassword2024!', desc: 'Muito forte' }
    ];
    
    for (const { pwd, desc } of passwords) {
      try {
        const testEmail = `test${Date.now()}${Math.random()}@test.com`;
        const { data, error } = await supabase.auth.signUp({
          email: testEmail,
          password: pwd
        });
        
        if (!error) {
          setMessage(`✅ Funcionou com senha ${desc}!`);
          return;
        } else {
          console.log(`Senha ${desc} falhou:`, error.message);
        }
      } catch (err) {
        console.log(`Erro com senha ${desc}:`, err);
      }
    }
    
    setMessage(`❌ Todas as senhas falharam - pode ser rate limiting ou outro problema`);
    setLoading(false);
  };

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
        }
      } else {
        // Try to sign up with email confirmation disabled
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/admin'
          }
        });
        
        if (error) {
          setMessage(`Erro no cadastro: ${error.message}`);
          console.error('SignUp error details:', error);
        } else {
          console.log('SignUp success:', data);
          if (data.user && !data.user.email_confirmed_at) {
            setMessage('Cadastro realizado! Verifique seu email para confirmação.');
          } else {
            setMessage('Cadastro realizado com sucesso!');
          }
        }
      }
    } catch (err) {
      console.error('Erro:', err);
      setMessage(`Erro inesperado: ${err}`);
    }
    
    setLoading(false);
  };

  if (session) {
    return (
      <div className="p-4">
        <p>Logado como: {session.user.email}</p>
        <button 
          onClick={() => supabase.auth.signOut()}
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

        <button
          type="button"
          onClick={testConnection}
          className="w-full mt-2 bg-gray-500 text-white py-1 px-4 rounded text-sm"
        >
          Testar Conexão Supabase
        </button>

        <button
          type="button"
          onClick={testSignUpMinimal}
          className="w-full mt-2 bg-purple-500 text-white py-1 px-4 rounded text-sm"
        >
          Testar Cadastro Mínimo
        </button>

        <button
          type="button"
          onClick={checkAuthConfig}
          className="w-full mt-2 bg-orange-500 text-white py-1 px-4 rounded text-sm"
        >
          Verificar Config Auth
        </button>

        <button
          type="button"
          onClick={testPasswordPolicy}
          className="w-full mt-2 bg-green-500 text-white py-1 px-4 rounded text-sm"
        >
          Testar Política de Senha
        </button>

        <div className="mt-6 p-3 bg-gray-100 rounded text-sm">
          <h3 className="font-bold">Configuração do Supabase:</h3>
          <p>URL: {process.env.NODE_ENV === 'development' ? 'https://wijvqvvmpvltgjwamytg.supabase.co' : 'Oculta'}</p>
          <p>Status da conexão: {supabase ? 'Conectado' : 'Erro'}</p>
          <p>Versão: {typeof supabase.auth !== 'undefined' ? 'Auth OK' : 'Auth Error'}</p>
        </div>
      </form>
    </div>
  );
};