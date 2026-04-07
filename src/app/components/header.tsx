import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Search, 
  PlusCircle, 
  MessageCircle, 
  User, 
  LogOut, 
  Menu, 
  X,
  LayoutDashboard,
  TrendingUp,
  Shield,
  ChevronDown,
  BarChart3,
  FileText,
  Building2,
  MapPin,
  Phone
} from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { marketStats } from '../lib/mock-data';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sortedZones = [...marketStats].sort((a, b) => b.avgPrice - a.avgPrice);
  const expensiveZones = sortedZones.slice(0, 4);
  const affordableZones = sortedZones.slice(-4).reverse();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-900 to-green-700 flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-900 to-green-700 bg-clip-text text-transparent">
                Kusambwila
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all"
            >
              Início
            </Link>
            
            <Link 
              to="/search" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all"
            >
              Procurar Imóveis
            </Link>

            {/* Zones Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowZoneDropdown(true)}
              onMouseLeave={() => setShowZoneDropdown(false)}
            >
              <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1">
                Zonas
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {showZoneDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-[600px] bg-white rounded-xl shadow-xl border border-gray-200 p-6 z-50"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Zonas Mais Caras
                        </h4>
                        <div className="space-y-2">
                          {expensiveZones.map((zone) => (
                            <Link
                              key={zone.district}
                              to={`/search?district=${zone.district}`}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div>
                                <p className="text-sm font-medium">{zone.district}</p>
                                <p className="text-xs text-gray-500">{zone.listings} imóveis</p>
                              </div>
                              <p className="text-sm font-semibold text-blue-900">
                                {(zone.avgPrice / 1000).toFixed(0)}K Kz
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 rotate-180" />
                          Zonas Mais Acessíveis
                        </h4>
                        <div className="space-y-2">
                          {affordableZones.map((zone) => (
                            <Link
                              key={zone.district}
                              to={`/search?district=${zone.district}`}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div>
                                <p className="text-sm font-medium">{zone.district}</p>
                                <p className="text-xs text-gray-500">{zone.listings} imóveis</p>
                              </div>
                              <p className="text-sm font-semibold text-green-700">
                                {(zone.avgPrice / 1000).toFixed(0)}K Kz
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link 
                        to="/search" 
                        className="text-sm text-blue-900 hover:underline font-medium"
                      >
                        Ver todas as zonas →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isAuthenticated && user?.userType === 'landlord' && (
              <Link 
                to="/publish" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all"
              >
                Publicar
              </Link>
            )}
            
            {isAuthenticated && user?.userType === 'admin' && (
              <Link 
                to="/dashboard" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate('/chat')}
                  className="relative"
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-green-700 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm">{user?.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="w-4 h-4 mr-2" />
                      Meu Perfil
                    </DropdownMenuItem>
                    {user?.userType === 'admin' && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Relatórios
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-sm"
                >
                  Entrar
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-900 to-green-700 hover:from-blue-800 hover:to-green-600 text-sm"
                  onClick={() => navigate('/register')}
                >
                  Cadastrar
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-900 to-green-700 flex items-center justify-center">
                      <Home className="w-4 h-4 text-white" />
                    </div>
                    Kusambwila
                  </SheetTitle>
                </div>
              </SheetHeader>
              
              <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
                <Link 
                  to="/" 
                  className="flex items-center space-x-3 p-3 text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Início</span>
                </Link>
                <Link 
                  to="/search" 
                  className="flex items-center space-x-3 p-3 text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="w-5 h-5" />
                  <span className="font-medium">Procurar Imóveis</span>
                </Link>
                
                {/* Mobile Zones Section */}
                <div className="pt-2">
                  <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Zonas Populares</p>
                  <div className="space-y-1">
                    {expensiveZones.slice(0, 3).map((zone) => (
                      <Link
                        key={zone.district}
                        to={`/search?district=${zone.district}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{zone.district}</span>
                        </div>
                        <span className="text-sm font-semibold text-blue-900">
                          {(zone.avgPrice / 1000).toFixed(0)}K Kz
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {isAuthenticated ? (
                  <>
                    <div className="pt-2 border-t border-gray-100">
                      <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Minha Conta</p>
                      {user?.userType === 'landlord' && (
                        <Link 
                          to="/publish" 
                          className="flex items-center space-x-3 p-3 text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <PlusCircle className="w-5 h-5" />
                          <span className="font-medium">Publicar Imóvel</span>
                        </Link>
                      )}
                      <Link 
                        to="/chat" 
                        className="flex items-center space-x-3 p-3 text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">Mensagens</span>
                      </Link>
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-3 p-3 text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Meu Perfil</span>
                      </Link>
                      {user?.userType === 'admin' && (
                        <Link 
                          to="/dashboard" 
                          className="flex items-center space-x-3 p-3 text-gray-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          <span className="font-medium">Dashboard</span>
                        </Link>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <div className="pt-4 space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        navigate('/login');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Entrar
                    </Button>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-900 to-green-700"
                      onClick={() => {
                        navigate('/register');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Cadastrar
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
