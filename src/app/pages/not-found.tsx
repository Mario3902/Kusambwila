import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-9xl font-bold bg-gradient-to-r from-blue-900 to-green-800 bg-clip-text text-transparent mb-4"
        >
          404
        </motion.div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Página não encontrada
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Desculpe, a página que procura não existe ou foi removida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-900 to-green-800"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Ir para Início
          </Button>
          
          <Button
            onClick={() => navigate('/search')}
            variant="outline"
            size="lg"
          >
            <Search className="w-5 h-5 mr-2" />
            Procurar Imóveis
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center opacity-20">
            <Home className="w-32 h-32 text-blue-900" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
