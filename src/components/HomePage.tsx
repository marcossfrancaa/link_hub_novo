import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { LinkIcon } from './icons';
import { SEOHead } from './SEOHead';

const FeatureCard = memo(({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
));

const ActionButton = memo(({ to, children, primary }: { to: string, children: React.ReactNode, primary: boolean }) => (
  <Link
    to={to}
    className={`group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      primary 
        ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-500' 
        : 'text-blue-600 bg-white border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 focus:ring-blue-500'
    }`}
  >
    {children}
    {primary && (
      <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    )}
  </Link>
));

export const HomePage: React.FC = () => {
  return (
    <>
      <SEOHead 
        title="Link Hub Creator - Todos seus links em um só lugar"
        description="Crie uma página personalizada e facilmente customizável para abrigar todos os links importantes que você quer compartilhar com sua audiência."
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center p-4 text-center">
        <main className="animate-fade-in space-y-8">
          {/* Logo */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
            <LinkIcon className="h-10 w-10 text-white"/>
          </div>
          
          {/* Título */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            Todos seus links, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              em um só lugar.
            </span>
          </h1>
          
          {/* Descrição */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
            Crie uma página personalizada e facilmente customizável para abrigar todos os links importantes que você quer compartilhar com sua audiência.
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <FeatureCard 
              icon="🔗" 
              title="Links Ilimitados" 
              description="Adicione quantos links quiser" 
            />
            <FeatureCard 
              icon="🎨" 
              title="Totalmente Personalizável" 
              description="Customize cores, fontes e estilos" 
            />
            <FeatureCard 
              icon="📊" 
              title="Analytics Integrado" 
              description="Veja quantas pessoas clicaram" 
            />
          </div>
          
          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
            <ActionButton to="/register" primary>
              <span>🚀 Começar Grátis</span>
            </ActionButton>
            <ActionButton to="/login" primary={false}>
              👋 Entrar
            </ActionButton>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="mt-16 pt-8 text-gray-500 text-sm flex items-center justify-center">
          <span>Feito com</span>
          <span className="mx-1 text-red-500">❤️</span>
          <span>por Link Hub Creator</span>
        </footer>
      </div>
    </>
  );
};