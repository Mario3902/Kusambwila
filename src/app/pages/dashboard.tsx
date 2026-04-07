import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Home, 
  FileText, Download, Calendar, ArrowUpRight, ArrowDownRight,
  Shield, ShieldCheck, AlertTriangle, CheckCircle, XCircle, Clock,
  Building2, MapPin, Award, Star, LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/auth-context';
import { mockProperties, marketStats, financialReports, verificationChecks } from '../lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { VerificationBadge } from '../components/verification-badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.userType !== 'admin') {
    navigate('/');
    return null;
  }

  const [reportPeriod, setReportPeriod] = useState('monthly');

  const stats = [
    {
      title: 'Total de Utilizadores',
      value: '3,247',
      change: '+12.5%',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Imóveis Publicados',
      value: '1,589',
      change: '+8.2%',
      icon: Home,
      color: 'green',
    },
    {
      title: 'Receita Mensal',
      value: `${(financialReports.platformRevenue.monthly / 1000000).toFixed(1)}M Kz`,
      change: `+${financialReports.platformRevenue.growth}%`,
      icon: DollarSign,
      color: 'purple',
    },
    {
      title: 'Taxa de Conversão',
      value: '68%',
      change: '+5.1%',
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const zoneRankColors = {
    premium: 'bg-purple-100 text-purple-700 border-purple-200',
    high: 'bg-blue-100 text-blue-700 border-blue-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-orange-100 text-orange-700 border-orange-200',
    affordable: 'bg-green-100 text-green-700 border-green-200',
  };

  const zoneRankLabels = {
    premium: 'Premium',
    high: 'Alto',
    medium: 'Médio',
    low: 'Baixo',
    affordable: 'Acessível',
  };

  const sortedByPrice = [...marketStats].sort((a, b) => b.avgPrice - a.avgPrice);
  const mostExpensive = sortedByPrice.slice(0, 5);
  const cheapest = [...sortedByPrice].reverse().slice(0, 5);

  const verifiedCount = mockProperties.filter(p => p.verification.isVerified).length;
  const pendingCount = mockProperties.filter(p => !p.verification.isVerified && (p.verification.biStatus === 'pending' || p.verification.propertyTitleStatus === 'pending')).length;
  const rejectedCount = mockProperties.filter(p => p.verification.biStatus === 'rejected' || p.verification.propertyTitleStatus === 'rejected').length;

  const pieData = [
    { name: 'Verificados', value: verifiedCount, color: '#22c55e' },
    { name: 'Pendentes', value: pendingCount, color: '#eab308' },
    { name: 'Rejeitados', value: rejectedCount, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-green-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTZWMzRoNnptMC0zMHY2aC02VjRoNnptMCAxMHY2aC02VjE0aDZ6bTAgMTB2NmgtNlYyNGg2em0tMTAgMHY2aC02VjI0aDZ6bTEwIDEwdjZoLTZWMzRoNnptLTIwIDB2NmgtNlYzNGg2em0wLTEwdjZoLTZWMjRoNnptMC0xMHY2aC02VjE0aDZ6bTAgMTB2NmgtNlYyNGg2em0xMCAwdjZoLTZWMjRoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <LayoutDashboard className="w-8 h-8" />
                <h1 className="text-3xl md:text-4xl font-bold">Dashboard Administrativo</h1>
              </div>
              <p className="text-lg text-gray-100">
                Visão geral da plataforma Kusambwila
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="zones">Zonas & Preços</TabsTrigger>
            <TabsTrigger value="financials">Relatório Financeiro</TabsTrigger>
            <TabsTrigger value="verification">Verificação</TabsTrigger>
            <TabsTrigger value="properties">Imóveis</TabsTrigger>
            <TabsTrigger value="users">Utilizadores</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Crescimento Mensal
                  </CardTitle>
                  <CardDescription>Receita, despesas e lucro nos últimos meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={financialReports.monthlyTrend}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#166534" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#166534" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `${(value / 1000000).toFixed(2)}M Kz`} />
                      <Area type="monotone" dataKey="revenue" stroke="#1e3a8a" fillOpacity={1} fill="url(#colorRevenue)" name="Receita" />
                      <Area type="monotone" dataKey="profit" stroke="#166534" fillOpacity={1} fill="url(#colorProfit)" name="Lucro" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Status de Verificação
                  </CardTitle>
                  <CardDescription>Documentos verificados na plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Top Proprietários
                  </CardTitle>
                  <CardDescription>Maior receita gerada</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {financialReports.topLandlords.slice(0, 5).map((landlord, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-green-800 flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{landlord.name}</p>
                            <p className="text-xs text-gray-500">{landlord.properties} imóveis</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{(landlord.revenue / 1000000).toFixed(2)}M Kz</p>
                          <div className="flex items-center gap-1">
                            {landlord.verified && <ShieldCheck className="w-3 h-3 text-green-500" />}
                            <span className="text-xs text-gray-500">{landlord.avgOccupancy}% ocupação</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Zonas Mais Caras
                  </CardTitle>
                  <CardDescription>Preço médio por distrito</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mostExpensive.map((zone, index) => (
                      <div key={zone.district} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                          <div>
                            <p className="font-medium">{zone.district}</p>
                            <Badge className={`text-xs ${zoneRankColors[zone.zoneRank]}`}>
                              {zoneRankLabels[zone.zoneRank]}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{(zone.avgPrice / 1000).toFixed(0)}K Kz/mês</p>
                          <p className="text-xs text-gray-500">{zone.pricePerSqm} Kz/m²</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="zones" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-red-500" />
                    Zonas Mais Caras
                  </CardTitle>
                  <CardDescription>Ranking de preços - Luanda</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={mostExpensive} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tickFormatter={(v) => `${v/1000}K`} />
                      <YAxis type="category" dataKey="district" width={80} />
                      <Tooltip formatter={(value: number) => `${value.toLocaleString('pt-AO')} Kz`} />
                      <Bar dataKey="avgPrice" fill="#1e3a8a" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-green-500" />
                    Zonas Mais Acessíveis
                  </CardTitle>
                  <CardDescription>Melhores oportunidades</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={cheapest} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tickFormatter={(v) => `${v/1000}K`} />
                      <YAxis type="category" dataKey="district" width={80} />
                      <Tooltip formatter={(value: number) => `${value.toLocaleString('pt-AO')} Kz`} />
                      <Bar dataKey="avgPrice" fill="#166534" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Análise Completa por Zona</CardTitle>
                <CardDescription>Todas as zonas ordenadas por preço</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Zona</TableHead>
                      <TableHead>Classificação</TableHead>
                      <TableHead>Preço Médio</TableHead>
                      <TableHead>Preço/m²</TableHead>
                      <TableHead>Faixa de Preço</TableHead>
                      <TableHead>Listagens</TableHead>
                      <TableHead>Demanda</TableHead>
                      <TableHead>Tendência</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedByPrice.map((zone, index) => (
                      <TableRow key={zone.district}>
                        <TableCell className="font-bold text-gray-400">{index + 1}</TableCell>
                        <TableCell className="font-medium">{zone.district}</TableCell>
                        <TableCell>
                          <Badge className={zoneRankColors[zone.zoneRank]}>
                            {zoneRankLabels[zone.zoneRank]}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{zone.avgPrice.toLocaleString('pt-AO')} Kz</TableCell>
                        <TableCell>{zone.pricePerSqm.toLocaleString('pt-AO')} Kz</TableCell>
                        <TableCell>{zone.minPrice.toLocaleString('pt-AO')} - {zone.maxPrice.toLocaleString('pt-AO')} Kz</TableCell>
                        <TableCell>{zone.listings}</TableCell>
                        <TableCell>{zone.demandLevel}</TableCell>
                        <TableCell>
                          {zone.trend === 'up' ? (
                            <span className="flex items-center text-red-500"><ArrowUpRight className="w-4 h-4 mr-1" /> Subindo</span>
                          ) : zone.trend === 'down' ? (
                            <span className="flex items-center text-green-500"><ArrowDownRight className="w-4 h-4 mr-1" /> Descendo</span>
                          ) : (
                            <span className="flex items-center text-gray-500"><Clock className="w-4 h-4 mr-1" /> Estável</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6">
                  <p className="text-sm text-blue-600 mb-1">Receita Mensal</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {financialReports.platformRevenue.monthly.toLocaleString('pt-AO')} Kz
                  </p>
                  <p className="text-sm text-blue-600 mt-2 flex items-center">
                    <ArrowUpRight className="w-4 h-4 mr-1" /> +{financialReports.platformRevenue.growth}% vs mês anterior
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6">
                  <p className="text-sm text-green-600 mb-1">Receita Anual</p>
                  <p className="text-3xl font-bold text-green-900">
                    {(financialReports.platformRevenue.yearly / 1000000).toFixed(1)}M Kz
                  </p>
                  <p className="text-sm text-green-600 mt-2">Projeção baseada em dados atuais</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6">
                  <p className="text-sm text-purple-600 mb-1">Lucro Líquido (Mar)</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {financialReports.monthlyTrend[financialReports.monthlyTrend.length - 1].profit.toLocaleString('pt-AO')} Kz
                  </p>
                  <p className="text-sm text-purple-600 mt-2 flex items-center">
                    <ArrowUpRight className="w-4 h-4 mr-1" /> +7.2% vs mês anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Receita por Distrito
                </CardTitle>
                <CardDescription>Distribuição de receita por zona</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={financialReports.revenueByDistrict}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="district" />
                    <YAxis tickFormatter={(v) => `${v/1000000}M`} />
                    <Tooltip formatter={(value: number) => `${(value / 1000000).toFixed(2)}M Kz`} />
                    <Bar dataKey="revenue" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Relatório Financeiro Mensal</CardTitle>
                <CardDescription>Receita, despesas e lucro ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={financialReports.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `${v/1000000}M`} />
                    <Tooltip formatter={(value: number) => `${(value / 1000000).toFixed(2)}M Kz`} />
                    <Line type="monotone" dataKey="revenue" stroke="#1e3a8a" strokeWidth={3} name="Receita" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Despesas" />
                    <Line type="monotone" dataKey="profit" stroke="#166534" strokeWidth={3} name="Lucro" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Top Proprietários por Receita
                </CardTitle>
                <CardDescription>Proprietários que mais geram receita</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ranking</TableHead>
                      <TableHead>Proprietário</TableHead>
                      <TableHead>Imóveis</TableHead>
                      <TableHead>Receita Total</TableHead>
                      <TableHead>Ocupação Média</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financialReports.topLandlords.map((landlord, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-green-800 flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{landlord.name}</TableCell>
                        <TableCell>{landlord.properties}</TableCell>
                        <TableCell className="font-semibold">{(landlord.revenue / 1000000).toFixed(2)}M Kz</TableCell>
                        <TableCell>{landlord.avgOccupancy}%</TableCell>
                        <TableCell>
                          {landlord.verified ? (
                            <Badge className="bg-green-100 text-green-700">
                              <ShieldCheck className="w-3 h-3 mr-1" /> Verificado
                            </Badge>
                          ) : (
                            <Badge variant="outline">Pendente</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-green-600">{verifiedCount}</p>
                  <p className="text-sm text-gray-600">Verificados</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                  <p className="text-sm text-gray-600">Pendentes</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
                  <p className="text-sm text-gray-600">Rejeitados</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-orange-600">
                    {mockProperties.filter(p => p.verification.verificationScore < 50).length}
                  </p>
                  <p className="text-sm text-gray-600">Score Baixo</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Critérios de Verificação
                </CardTitle>
                <CardDescription>Como verificamos documentos para prevenir fraudes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verificationChecks.map((check) => (
                    <div key={check.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{check.name}</p>
                        <p className="text-sm text-gray-600">{check.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Verificação de Imóveis</CardTitle>
                <CardDescription>Status de verificação de todos os imóveis</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imóvel</TableHead>
                      <TableHead>Proprietário</TableHead>
                      <TableHead>BI</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">{property.title}</TableCell>
                        <TableCell>{property.landlordName}</TableCell>
                        <TableCell>
                          <Badge className={
                            property.verification.biStatus === 'verified' ? 'bg-green-100 text-green-700' :
                            property.verification.biStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {property.verification.biStatus === 'verified' ? 'Verificado' :
                             property.verification.biStatus === 'rejected' ? 'Rejeitado' : 'Pendente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            property.verification.propertyTitleStatus === 'verified' ? 'bg-green-100 text-green-700' :
                            property.verification.propertyTitleStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {property.verification.propertyTitleStatus === 'verified' ? 'Verificado' :
                             property.verification.propertyTitleStatus === 'rejected' ? 'Rejeitado' : 'Pendente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  property.verification.verificationScore >= 80 ? 'bg-green-500' :
                                  property.verification.verificationScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${property.verification.verificationScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{property.verification.verificationScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <VerificationBadge
                            isVerified={property.verification.isVerified}
                            score={property.verification.verificationScore}
                            biStatus={property.verification.biStatus}
                            propertyTitleStatus={property.verification.propertyTitleStatus}
                            size="sm"
                            showTooltip={false}
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Ver Detalhes</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Gestão de Imóveis</CardTitle>
                <CardDescription>Todos os imóveis publicados na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Proprietário</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Verificação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">{property.title}</TableCell>
                        <TableCell>{property.landlordName}</TableCell>
                        <TableCell>{property.district}</TableCell>
                        <TableCell>{property.price.toLocaleString('pt-AO')} Kz</TableCell>
                        <TableCell>
                          <VerificationBadge
                            isVerified={property.verification.isVerified}
                            score={property.verification.verificationScore}
                            biStatus={property.verification.biStatus}
                            propertyTitleStatus={property.verification.propertyTitleStatus}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Ativo
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Ver</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Gestão de Utilizadores</CardTitle>
                <CardDescription>Todos os utilizadores registados</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data de Registo</TableHead>
                      <TableHead>Verificação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">{property.landlordName}</TableCell>
                        <TableCell>{property.landlordEmail}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Proprietário</Badge>
                        </TableCell>
                        <TableCell>{property.createdAt.toLocaleDateString('pt-AO')}</TableCell>
                        <TableCell>
                          <VerificationBadge
                            isVerified={property.verification.isVerified}
                            score={property.verification.verificationScore}
                            biStatus={property.verification.biStatus}
                            propertyTitleStatus={property.verification.propertyTitleStatus}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Ver</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
