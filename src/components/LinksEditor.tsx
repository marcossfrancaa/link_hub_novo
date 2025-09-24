import React, { useState, memo } from 'react';
import type { Link } from '@/types';
import { PlusIcon, TrashIcon, GripVerticalIcon } from './icons';
import { Link as LinkLucide, Type, Youtube, Music } from 'lucide-react';

interface LinksEditorProps {
  links: Link[];
  onUpdateLinks: (links: Link[]) => void;
}

const AddContentModal = memo(({ isOpen, onClose, onAddContent }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAddContent: (type: 'link' | 'header' | 'youtube' | 'spotify') => void 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 space-y-4 w-full max-w-xs" 
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-center">Adicionar Novo Bloco</h3>
        <button 
          onClick={() => onAddContent('link')} 
          className="w-full flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Adicionar link"
        >
          <LinkLucide className="mr-3 h-5 w-5 text-blue-500"/> Link
        </button>
        <button 
          onClick={() => onAddContent('header')} 
          className="w-full flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Adicionar cabeçalho"
        >
          <Type className="mr-3 h-<dyad-write path="src/components/LinksEditor.tsx" description="Otimizando o editor de links">
import React, { useState, memo } from 'react';
import type { Link } from '@/types';
import { PlusIcon, TrashIcon, GripVerticalIcon } from './icons';
import { Link as LinkLucide, Type, Youtube, Music } from 'lucide-react';

interface LinksEditorProps {
  links: Link[];
  onUpdateLinks: (links: Link[]) => void;
}

const AddContentModal = memo(({ isOpen, onClose, onAddContent }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAddContent: (type: 'link' | 'header' | 'youtube' | 'spotify') => void 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 space-y-4 w-full max-w-xs" 
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-center">Adicionar Novo Bloco</h3>
        <button 
          onClick={() => onAddContent('link')} 
          className="w-full flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Adicionar link"
        >
          <LinkLucide className="mr-3 h-5 w-5 text-blue-500"/> Link
        </button>
        <button 
          onClick={() => onAddContent('header')} 
          className="w-full flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Adicionar cabeçalho"
        >
          <Type className="mr-3 h-5 w-5 text-blue-500"/> Cabeçalho
        </button>
        <button 
          onClick={() => onAddContent('youtube')} 
          className="w-full flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Adicionar vídeo do YouTube"
        >
          <Youtube className="mr-3 h-5 w-5 text-red-500"/> Vídeo do YouTube
        </button>
        <button 
          onClick={() => onAddContent('spotify')} 
          className="w-full flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Adicionar player do Spotify"
        >
          <Music className="mr-3 h-5 w-5 text-green-500"/> Player do Spotify
        </button>
      </div>
    </div>
  );
});

const LinkEditor = memo(({ link, onUpdateLink, onDeleteLink }: { 
  link: Link; 
  onUpdateLink: (updatedLink: Link) => void; 
  onDeleteLink: (id: string) => void;
}) => {
  const renderEditor = () => {
    switch (link.type) {
      case 'header':
        return (
          <input
            type="text"
            value={link.title}
            onChange={(e) => onUpdateLink({ ...link, title: e.target.value })}
            className="w-full bg-transparent font-bold text-lg text-gray-800 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            placeholder="Texto do Cabeçalho"
            aria-label="Texto do cabeçalho"
          />
        );
      case 'youtube':
      case 'spotify':
        return (
          <input
            type="url"
            value={link.url}
            onChange={(e) => onUpdateLink({ ...link, url: e.target.value })}
            className="w-full bg-transparent text-sm text-gray-500 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            placeholder={link.type === 'youtube' ? 'Cole a URL do vídeo do YouTube' : 'Cole a URL do Spotify'}
            aria-label={link.type === 'youtube' ? 'URL do vídeo do YouTube' : 'URL do Spotify'}
          />
        );
      case 'link':
      default:
        return (
          <>
            <input
              type="text"
              value={link.title}
              onChange={(e) => onUpdateLink({ ...link, title: e.target.value })}
              className="w-full bg-transparent font-semibold text-gray-800 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              placeholder="Título"
              aria-label="Título do link"
            />
            <input
              type="url"
              value={link.url}
              onChange={(e) => onUpdateLink({ ...link, url: e.target.value })}
              className="w-full bg-transparent text-sm text-gray-500 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              placeholder="URL"
              aria-label="URL do link"
            />
          </>
        );
    }
  };

  return (
    <div 
      draggable
      className="bg-gray-50 rounded-lg border border-gray-200 mb-3 transition-all duration-200 hover:shadow-md"
    >
      <div className="flex items-center p-3">
        <GripVerticalIcon className="h-5 w-5 text-gray-400 cursor-move mr-2" />
        <div className="flex-grow">
          {renderEditor()}
        </div>
        <button
          onClick={() => onDeleteLink(link.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-2"
          aria-label={`Excluir ${link.type === 'header' ? 'cabeçalho' : link.type === 'youtube' ? 'vídeo do YouTube' : link.type === 'spotify' ? 'player do Spotify' : 'link'}`}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
      {link.type === 'link' && (
        <div className="text-right px-4 pb-2 text-xs text-gray-400">
          Cliques: {link.clickCount}
        </div>
      )}
    </div>
  );
});

export const LinksEditor: React.FC<LinksEditorProps> = memo(({ links, onUpdateLinks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddContent = (type: 'link' | 'header' | 'youtube' | 'spotify') => {
    let newContent: Link;
    switch (type) {
      case 'header':
        newContent = { id: Date.now().toString(), type, title: 'Cabeçalho', url: '', clickCount: 0 };
        break;
      case 'youtube':
        newContent = { id: Date.now().toString(), type, title: 'Vídeo do YouTube', url: '', clickCount: 0 };
        break;
      case 'spotify':
        newContent = { id: Date.now().toString(), type, title: 'Player do Spotify', url: '', clickCount: 0 };
        break;
      case 'link':
      default:
        newContent = { id: Date.now().toString(), type: 'link', title: 'Novo Link', url: 'https://example.com', clickCount: 0 };
        break;
    }
    onUpdateLinks([newContent, ...links]);
    setIsModalOpen(false);
  };

  const handleUpdateLink = (updatedLink: Link) => {
    onUpdateLinks(links.map((link) => (link.id === updatedLink.id ? updatedLink : link)));
  };

  const handleDeleteLink = (id: string) => {
    onUpdateLinks(links.filter((link) => link.id !== id));
  };

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Adicionar conteúdo"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Adicionar Conteúdo
      </button>

      <AddContentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddContent={handleAddContent} 
      />

      <div>
        {links.map((link) => (
          <LinkEditor 
            key={link.id} 
            link={link} 
            onUpdateLink={handleUpdateLink} 
            onDeleteLink={handleDeleteLink} 
          />
        ))}
      </div>
    </div>
  );
});