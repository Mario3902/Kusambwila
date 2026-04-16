import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/auth-context';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';

export function AdminLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = isAuthenticated && user?.userType === 'admin';

  // Evita renderizar "vazio" quando o acesso falha.
  // Mostramos uma mensagem clara enquanto o utilizador ajusta o login.
  useEffect(() => {
    if (!isAdmin) return;
    // when admin is valid, no redirect needed
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Acesso ao painel</h1>
          <p className="text-gray-600 mb-4">
            {isAuthenticated
              ? 'Acesso negado: precisa ser administrador.'
              : 'Faça login para acessar o painel administrativo.'}
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate(isAuthenticated ? '/' : '/login')}
              className="bg-blue-900 text-white"
            >
              {isAuthenticated ? 'Voltar' : 'Ir para Login'}
            </Button>
            {isAuthenticated && (
              <Button variant="outline" onClick={logout}>
                Sair
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Visão Geral', path: '/admin' },
    { icon: Home, label: 'Gestão de Imóveis', path: '/admin/properties' },
    { icon: Users, label: 'Gestão de Utilizadores', path: '/admin/users' },
    { icon: BarChart3, label: 'Financeiro', path: '/admin/finance' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-blue-950 text-white">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Admin Panel</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900 transition-colors text-gray-300 hover:text-white"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-900">
          <div className="flex items-center space-x-3 p-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-400 truncate">Administrador</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout} 
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-blue-900"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair do Painel
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-blue-950 text-white">
                <div className="p-6 flex items-center space-x-3">
                  <ShieldCheck className="w-6 h-6" />
                  <span className="text-xl font-bold">Admin Panel</span>
                </div>
                <nav className="px-4 space-y-2 mt-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <h2 className="text-lg font-semibold text-gray-800 hidden lg:block">
              Painel de Gestão Kusambwila
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">Super Administrador</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300" />
          </div>
        </header>

        {/* Content Page */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
