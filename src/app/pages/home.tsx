import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Search, Home as HomeIcon, TrendingUp, Shield, Clock, Users, MapPin, ArrowRight, Star, CheckCircle2, Building2, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { PropertyCard } from '../components/property-card';
import { mockProperties, districts, propertyTypes, marketStats } from '../lib/mock-data';
import { useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';

export function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchPrice, setSearchPrice] = useState('');

  const featuredProperties = mockProperties.filter(p => p.featured).slice(0, 3);
  const sortedZones = [...marketStats].sort((a, b) => b.avgPrice - a.avgPrice);
  const topZones = sortedZones.slice(0, 4);
  const affordableZones = sortedZones.slice(-4).reverse();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.set('location', searchLocation);
    if (searchType) params.set('type', searchType);
    if (searchPrice) params.set('maxPrice', searchPrice);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full">
      {/* Hero Section with gradient background */}
      <section className="relative min-h-[650px] flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-green-800">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoLTFWMzRoMXptMCAxMHY2aC0xVjQ0aDF6bS0xMCAwdjZoLTFWMzRoMXptMCAxMHY2aC0xVjQ0aDF6bS0xMCAwdjZoLTFWMzRoMXptMCAxMHY2aC0xVjQ0aDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container mx-auto px-4 text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-1.5">
              <Shield className="w-3.5 h-3.5 mr-1.5" />
              Plataforma Verificada e Segura
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Encontre a Casa dos Seus{' '}
              <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                Sonhos
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-200">
              Ligue-se diretamente com proprietários. Sem intermediários.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={searchLocation} onValueChange={setSearchLocation}>
                <SelectTrigger className="h-12 border-gray-200">
                  <SelectValue placeholder="Localização" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map(district => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="h-12 border-gray-200">
                  <SelectValue placeholder="Tipo de Imóvel" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input 
                type="number" 
                placeholder="Preço Máximo (Kz)" 
                value={searchPrice}
                onChange={(e) => setSearchPrice(e.target.value)}
                className="h-12 border-gray-200"
              />

              <Button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-900 to-green-700 hover:from-blue-800 hover:to-green-600 h-12 text-base"
              >
                <Search className="w-5 h-5 mr-2" />
                Procurar
              </Button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 mt-10 text-sm"
          >
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Documentos Verificados</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Sem Fraudes</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Avaliações Reais</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge className="mb-3 bg-blue-100 text-blue-700 border-0">Por que escolher-nos</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher Kusambwila?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simplificamos o processo de arrendamento com tecnologia moderna
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Sem Intermediários',
                description: 'Contacto direto entre proprietários e inquilinos',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Clock,
                title: 'Rápido e Fácil',
                description: 'Encontre ou publique imóveis em minutos',
                color: 'from-green-500 to-green-600',
              },
              {
                icon: Users,
                title: 'Comunidade Ativa',
                description: 'Milhares de utilizadores confiam em nós',
                color: 'from-purple-500 to-purple-600',
              },
              {
                icon: TrendingUp,
                title: 'Transparência',
                description: 'Preços claros e informações verificadas',
                color: 'from-orange-500 to-orange-600',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zone Price Overview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge className="mb-3 bg-green-100 text-green-700 border-0">Análise de Mercado</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Preços por Zona em Luanda
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Compare preços e encontre a zona ideal para o seu orçamento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Most Expensive */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Zonas Mais Caras
                </h3>
              </div>
              <CardContent className="p-0">
                {topZones.map((zone, index) => (
                  <button
                    key={zone.district}
                    onClick={() => navigate(`/search?district=${zone.district}`)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="text-left">
                        <p className="font-semibold">{zone.district}</p>
                        <p className="text-xs text-gray-500">{zone.listings} imóveis disponíveis</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-900">{zone.avgPrice.toLocaleString('pt-AO')} Kz</p>
                      <p className="text-xs text-gray-500">média/mês</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Most Affordable */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 rotate-180" />
                  Zonas Mais Acessíveis
                </h3>
              </div>
              <CardContent className="p-0">
                {affordableZones.map((zone, index) => (
                  <button
                    key={zone.district}
                    onClick={() => navigate(`/search?district=${zone.district}`)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="text-left">
                        <p className="font-semibold">{zone.district}</p>
                        <p className="text-xs text-gray-500">{zone.listings} imóveis disponíveis</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-700">{zone.avgPrice.toLocaleString('pt-AO')} Kz</p>
                      <p className="text-xs text-gray-500">média/mês</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/search')}
              className="border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
            >
              Ver Análise Completa
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <Badge className="mb-3 bg-purple-100 text-purple-700 border-0">Selecionados</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Imóveis em Destaque
              </h2>
              <p className="text-lg text-gray-600">
                Selecionados especialmente para você
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/search')}
              className="hidden md:flex border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
            >
              Ver Todos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Button
              variant="outline"
              onClick={() => navigate('/search')}
              className="w-full border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
            >
              Ver Todos os Imóveis
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gradient-to-br from-blue-950 via-blue-900 to-green-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoLTFWMzRoMXptMCAxMHY2aC0xVjQ0aDF6bS0xMCAwdjZoLTFWMzRoMXptMCAxMHY2aC0xVjQ0aDF6bS0xMCAwdjZoLTFWMzRoMXptMCAxMHY2aC0xVjQ0aDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-14">
            <Badge className="mb-3 bg-white/10 text-white border-white/20">Segurança</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como Protegemos Você
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Sistema de verificação em múltiplas camadas para prevenir fraudes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            {[
              {
                icon: Shield,
                title: 'Verificação de BI',
                description: 'Validamos o Bilhete de Identidade de todos os proprietários com algoritmos de segurança',
              },
              {
                icon: Building2,
                title: 'Registo Predial',
                description: 'Confirmamos a propriedade através do conservatório do registo predial',
              },
              {
                icon: DollarSign,
                title: 'Transparência Financeira',
                description: 'Relatórios detalhados de receitas e despesas para total transparência',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10"
              >
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-700 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para começar?
            </h2>
            <p className="text-xl mb-8 text-green-100">
              Cadastre-se agora e encontre a casa perfeita ou publique o seu imóvel
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-green-700 hover:bg-gray-100 border-white text-base px-8"
                onClick={() => navigate('/register')}
              >
                Cadastrar Agora
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-base px-8"
                onClick={() => navigate('/search')}
              >
                Explorar Imóveis
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '1,500+', label: 'Imóveis Listados', icon: HomeIcon },
              { value: '3,200+', label: 'Utilizadores Ativos', icon: Users },
              { value: '850+', label: 'Contratos Fechados', icon: CheckCircle2 },
              { value: '98%', label: 'Satisfação', icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6"
              >
                <stat.icon className="w-8 h-8 text-blue-900 mx-auto mb-3" />
                <div className="text-4xl md:text-5xl font-bold text-blue-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
