import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  MessageCircle, 
  Send, 
  Search, 
  User,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../contexts/auth-context';
import { Badge } from '../components/ui/badge';

interface ChatMessage {
  id: number;
  senderId: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar?: string;
  online: boolean;
}

export function Chat() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Maria Costa',
      lastMessage: 'O apartamento ainda está disponível?',
      timestamp: '10:30',
      unread: 2,
      online: true,
    },
    {
      id: '2',
      name: 'António Fernandes',
      lastMessage: 'Podemos marcar uma visita para amanhã?',
      timestamp: 'Ontem',
      unread: 0,
      online: false,
    },
    {
      id: '3',
      name: 'Isabel Santos',
      lastMessage: 'Obrigado pela informação!',
      timestamp: 'Seg',
      unread: 0,
      online: true,
    },
    {
      id: '4',
      name: 'Carlos Pereira',
      lastMessage: 'Qual é o valor da caução?',
      timestamp: 'Dom',
      unread: 1,
      online: false,
    },
  ];

  const messages: ChatMessage[] = [
    {
      id: 1,
      senderId: '1',
      text: 'Olá! Vi o seu anúncio do apartamento T3 na Talatona.',
      timestamp: new Date('2026-03-20T10:00:00'),
      isOwn: false,
    },
    {
      id: 2,
      senderId: user.id,
      text: 'Olá Maria! Sim, o apartamento está disponível.',
      timestamp: new Date('2026-03-20T10:05:00'),
      isOwn: true,
    },
    {
      id: 3,
      senderId: '1',
      text: 'Ótimo! Gostaria de saber mais detalhes sobre o condomínio.',
      timestamp: new Date('2026-03-20T10:10:00'),
      isOwn: false,
    },
    {
      id: 4,
      senderId: user.id,
      text: 'Claro! O condomínio tem segurança 24h, piscina, ginásio e área de lazer. A taxa de condomínio é de 15.000 Kz mensais.',
      timestamp: new Date('2026-03-20T10:15:00'),
      isOwn: true,
    },
    {
      id: 5,
      senderId: '1',
      text: 'Perfeito! O apartamento ainda está disponível?',
      timestamp: new Date('2026-03-20T10:30:00'),
      isOwn: false,
    },
  ];

  const selectedConversation = conversations.find((c) => c.id === selectedChat);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // In a real app, send message to server
    setMessage('');
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-80px)] bg-gray-50">
      <div className="container mx-auto px-4 py-6 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Conversations List */}
          <Card className="lg:col-span-1 flex flex-col h-full">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Mensagens
                </h2>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Procurar conversas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Separator className="mb-4" />

              {/* Conversation List */}
              <ScrollArea className="flex-1">
                <div className="space-y-2">
                  {filteredConversations.map((conversation) => (
                    <motion.button
                      key={conversation.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedChat(conversation.id)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedChat === conversation.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-blue-900 to-green-800 text-white">
                              {conversation.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {conversation.name}
                            </p>
                            <span className="text-xs text-gray-500">
                              {conversation.timestamp}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage}
                            </p>
                            {conversation.unread > 0 && (
                              <Badge className="bg-blue-900 ml-2">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col h-full">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-blue-900 to-green-800 text-white">
                          {selectedConversation.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversation.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.isOwn
                              ? 'bg-gradient-to-r from-blue-900 to-green-800 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.isOwn ? 'text-gray-200' : 'text-gray-500'
                            }`}
                          >
                            {msg.timestamp.toLocaleTimeString('pt-AO', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Input
                      placeholder="Escreva uma mensagem..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon">
                      <Smile className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-blue-900 to-green-800"
                      size="icon"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Selecione uma conversa
                  </h3>
                  <p className="text-gray-600">
                    Escolha uma conversa para começar a mensagem
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
