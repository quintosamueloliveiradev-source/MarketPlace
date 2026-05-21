import { MessageCircle } from 'lucide-react';

export function ChatView() {
  return (
    <div className="flex-grow flex w-full max-w-container-max mx-auto overflow-hidden bg-surface-container-lowest shadow-sm h-[calc(100vh-80px)] items-center justify-center text-center p-6 flex-col">
       <MessageCircle size={64} className="mx-auto mb-4 text-outline" />
       <h2 className="font-bold text-headline-sm mb-2 text-on-surface">Central de Mensagens</h2>
       <p className="text-body-lg text-on-surface-variant max-w-md">
         Selecione uma conversa ou inicie um bate-papo a partir da página de um anúncio (Funcionalidade em desenvolvimento).
       </p>
    </div>
  );
}
