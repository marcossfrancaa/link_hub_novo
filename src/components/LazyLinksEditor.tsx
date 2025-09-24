import React, { useState, lazy, Suspense } from 'react';
import type { Link } from '@/types';
import { PlusIcon, TrashIcon, GripVerticalIcon } from './icons';

// Lazy load the icons to reduce initial bundle size
const LinkLucide = lazy(() => import('lucide-react').then(module => ({ default: module.Link })));
const Type = lazy(() => import('lucide-react').then(module => ({ default: module.Type })));
const Youtube = lazy(() => import('lucide-react').then(module => ({ default: module.Youtube })));
const Music = lazy(() => import('lucide-react').then(module => ({ default: module.Music })));

interface LazyLinksEditorProps {
  links: Link[];
  onUpdateLinks: (links: Link[]) => void;
}

export const LazyLinksEditor: React.FC<LazyLinksEditorProps> = ({ links, onUpdateLinks }) => {
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
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("draggedIndex", index.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("draggedIndex"), 10);
    const newLinks = [...links];
    const [draggedItem] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(dropIndex, 0, draggedItem);
    onUpdateLinks(newLinks);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
  };

  const renderLinkEditor = (link: Link) => {
    switch (link.type) {
      case 'header':
        return (
          <input
            type="text"
            value={link.title}
            onChange={(e) => handleUpdateLink({ ...link, title: e.target.value })}
            className="w-full bg-transparent font-bold text-lg text-gray-800 p-2 focus:outline-none"
            placeholder="Header Text"
          />
        );
      case 'youtube':
      case 'spotify':
        return (
          <input
            type="url"
            value={link.url}
            onChange={(e) => handleUpdateLink({ ...link, url: e.target.value })}
            className="w-full bg-transparent text-sm text-gray-500 p-2 focus:outline-none"
            placeholder={link.type === 'youtube' ? 'Paste YouTube video URL' : 'Paste Spotify track/playlist URL'}
          />
        );
      case 'link':
      default:
        return (
          <>
            <input
              type="text"
              value={link.title}
              onChange={(e) => handleUpdateLink({ ...link, title: e.target.value })}
              className="w-full bg-transparent font-semibold text-gray-800 p-2 focus:outline-none"
              placeholder="Title"
            />
            <input
              type="url"
              value={link.url}
              onChange={(e) => handleUpdateLink({ ...link, url: e.target.value })}
              className="w-full bg-transparent text-sm text-gray-500 p-2 focus:outline-none"
              placeholder="URL"
            />
          </>
        );
    }
  };

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors shadow-md mb-6"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Content
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg p-6 space-y-4 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-center">Add New Block</h3>
            <Suspense fallback={<div className="text-center py-2">Loading...</div>}>
              <button 
                onClick={() => handleAddContent('link')} 
                className="w-full flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <LinkLucide className="mr-3 h-5 w-5 text-primary"/> Link
              </button>
              <button 
                onClick={() => handleAddContent('header')} 
                className="w-full flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Type className="mr-3 h-5 w-5 text-primary"/> Header
              </button>
              <button 
                onClick={() => handleAddContent('youtube')} 
                className="w-full flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Youtube className="mr-3 h-5 w-5 text-red-600"/> YouTube Video
              </button>
              <button 
                onClick={() => handleAddContent('spotify')} 
                className="w-full flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Music className="mr-3 h-5 w-5 text-green-500"/> Spotify
              </button>
            </Suspense>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {links.map((link, index) => (
          <div key={link.id} 
               draggable 
               onDragStart={(e) => handleDragStart(e, index)}
               onDrop={(e) => handleDrop(e, index)}
               onDragOver={handleDragOver}
               className="bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center p-2">
                 <GripVerticalIcon className="h-5 w-5 text-gray-400 cursor-move mr-2"/>
                 <div className="flex-grow">
                  {renderLinkEditor(link)}
                 </div>
                <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete link"
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
        ))}
      </div>
    </div>
  );
};