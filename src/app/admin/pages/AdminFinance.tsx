import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export function AdminFinance() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const financials = await api.admin.getFinancials();
        setData(financials);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-center">Carregando dados financeiros...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Relatórios Financeiros</h1>
        <Button className="bg-blue-900">Exportar PDF</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Receita Total (Plataforma)</p>
            <p className="text-3xl font-bold text-gray-900">{data?.totalRevenue?.toLocaleString('pt-AO')} Kz</p>
            <div className="flex items-center text-green-600 text-sm mt-2">
              <ArrowUpRight className="w-4 h-4 mr-1" /> +12% este mês
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Taxas de Serviço</p>
            <p className="text-3xl font-bold text-gray-900">450.000 Kz</p>
            <div className="flex items-center text-blue-600 text-sm mt-2">
              <TrendingUp className="w-4 h-4 mr-1" /> Estável
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Impostos Estimados</p>
            <p className="text-3xl font-bold text-gray-900">120.000 Kz</p>
            <div className="flex items-center text-red-600 text-sm mt-2">
              <ArrowDownRight className="w-4 h-4 mr-1" /> -2% este mês
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Receita por Distrito</CardTitle>
          <CardDescription>Distribuição financeira por zona de Luanda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.topLandlords || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="firstName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_revenue" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
