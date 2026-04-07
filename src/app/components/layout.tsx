import { Outlet } from 'react-router';
import { AuthProvider } from '../contexts/auth-context';
import { Header } from './header';
import { Footer } from './footer';

export function Layout() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
