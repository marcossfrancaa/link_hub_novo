import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProfileAnalytics, resetLinkClicks, ProfileAnalytics, LinkAnalytics } from '@/utils/analyticsUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ isOpen, onClose }) => {
  const { profile } = useAuth();
  const [analytics, setAnalytics] = useState<ProfileAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile && isOpen) {
      loadAnalytics();
    }
  }, [profile, isOpen]);

  const loadAnalytics = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    const data = await getProfileAnalytics(profile.id);
    setAnalytics(data);
    setLoading(false);
  };

  const handleResetAllClicks = async () => {
    if (!profile?.id) return;
    
    const confirmed = window.confirm('Tem certeza que deseja resetar todos os cliques? Esta ação não pode ser desfeita.');
    if (confirmed) {
      const success = await resetLinkClicks(profile.id);
      if (success) {
        loadAnalytics(); // Recarregar os dados
        alert('Todos os cliques foram resetados com sucesso!');
      } else {
        alert('Erro ao resetar cliques. Tente novamente.');
      }
    }
  };

  const handleResetLinkClicks = async (linkId: string) => {
    if (!profile?.id) return;
    
    const success = await resetLinkClicks(profile.id, linkId);
    if (success) {
      loadAnalytics(); // Recarregar os dados
      alert('Cliques do link resetados com sucesso!');
    } else {
      alert('Erro ao resetar cliques do link. Tente novamente.');
    }
  };

  if (!isOpen) return null;

  // Preparar dados para os gráficos
  const chartData = analytics?.links.map(link => ({
    name: link.title.length > 15 ? `${link.title.substring(0, 15)}...` : link.title,
    clicks: link.clickCount
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Analytics do Perfil</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : !analytics ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum dado de analytics disponível</p>
            </div>
          ) : (
            <>
              {/* Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Total de Cliques</h3>
                  <p className="text-3xl font-bold text-blue-600">{analytics.totalClicks}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Link Mais Clicado</h3>
                  <p className="text-xl font-bold text-green-600 truncate">
                    {analytics.mostClickedLink?.title || 'Nenhum'}
                  </p>
                  <p className="text-lg text-green-500">
                    {analytics.mostClickedLink?.clickCount || 0} cliques
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Total de Links</h3>
                  <p className="text-3xl font-bold text-purple-600">{analytics.links.length}</p>
                </div>
              </div>

              {/* Gráficos */}
              {analytics.links.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Cliques por Link (Barras)</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="clicks" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição de Cliques (Pizza)</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="clicks"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de Links */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Detalhes dos Links</h3>
                  <button
                    onClick={handleResetAllClicks}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Resetar Todos Cliques
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliques</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.links.map((link) => (
                        <tr key={link.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">
                            {link.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                            {link.url}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {link.clickCount}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => handleResetLinkClicks(link.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Resetar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};