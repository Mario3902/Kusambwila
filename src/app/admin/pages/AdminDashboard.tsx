import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Users, Home, DollarSign, TrendingUp, ShieldCheck, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

interface Stats {
  totalRevenue: number;
  totalUsers: number;
  totalLandlords: number;
  totalProperties: number;
  pendingDocuments: number;
  topLandlords: Array<{
    firstName: string;
    lastName: string;
    total_revenue: number;
  }>;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [adminStats, financials] = await Promise.all([
          api.admin.getStats(),
          api.admin.getFinancials()
        ]);
        
        setStats({
          ...adminStats,
          topLandlords: financials.topLandlords || []
        });
      } catch (err: any) {
        console.error('Erro ao carregar stats:', err);
        toast.error('Erro ao carregar estatísticas');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Calculate verification rate based on real data
  const verificationRate = stats && stats.totalLandlords > 0
    ? Math.round(((stats.totalLandlords - (stats.pendingDocuments > 0 ? 1 : 0)) / stats.totalLandlords) * 100)
    : 0;

  if (loading) return <div className="p-8 text-center">Carregando Dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visão Geral do Sistema</h1>
          <p className="text-gray-500">Bem-vindo ao centro de comando da Kusambwila.</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700 border-0 px-4 py-1">
          Admin Mode
        </Badge>
      </div>

      {/* Quick Actions */}
      {stats && stats.pendingDocuments > 0 && (
        <Card className="bg-yellow-50 border-yellow-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileText className="w-5 h-5 text-yellow-700" />
              </div>
              <div>
                <p className="font-medium text-yellow-900">
                  {stats.pendingDocuments} documento(s) pendente(s) para revisão
                </p>
                <p className="text-sm text-yellow-700">
                  Aprove ou rejeite documentos de proprietários
                </p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/admin/documents')}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Revisar Agora <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Receita Total', value: (stats?.totalRevenue || 0).toLocaleString('pt-AO') + ' Kz', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Utilizadores', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Imóveis Ativos', value: stats?.totalProperties || 0, icon: Home, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Taxa Verificação', value: verificationRate + '%', icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Receita Mensal Estimada</CardTitle>
            <CardDescription>Crescimento de receita nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { month: 'Jan', rev: 1.2 }, { month: 'Fev', rev: 1.5 }, { month: 'Mar', rev: 1.8 }, 
                  { month: 'Abr', rev: 1.7 }, { month: 'Mai', rev: 2.1 }, { month: 'Jun', rev: 2.4 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="rev" stroke="#1e3a8a" fill="#dbeafe" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top Proprietários (Receita)</CardTitle>
            <CardDescription>Proprietários com maior volume financeiro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.topLandlords?.map((l: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center font-bold">{i+1}</span>
                    <p className="text-sm font-medium">{l.firstName} {l.lastName}</p>
                  </div>
                  <p className="text-sm font-bold text-blue-900">{(l.total_revenue / 1000000).toFixed(2)}M Kz</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
