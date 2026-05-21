import { useState } from 'react';
import { ViewType } from '../types';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginViewProps {
  setView: (view: ViewType) => void;
  onLoginSuccess: () => void;
}

export function LoginView({ setView, onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha email e senha.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        alert('Cadastro realizado! Verifique seu email ou tente fazer login.');
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setError(err.message || `Erro ao conectar com ${provider}.`);
    }
  };

  return (
    <div className="flex-grow flex flex-col bg-surface-container-lowest min-h-screen">
      {/* Simple Header for Login */}
      <header className="flex items-center px-6 py-4 border-b border-outline-variant/30 bg-surface">
        <button 
          onClick={() => setView('explore')}
          className="mr-4 p-2 rounded-full hover:bg-surface-container-low transition-colors"
        >
          <ArrowLeft size={24} className="text-on-surface-variant" />
        </button>
        <span 
          onClick={() => setView('explore')}
          className="font-display-lg text-[24px] font-bold text-primary cursor-pointer"
        >
          MarketPlace
        </span>
      </header>

      {/* Main Login Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-[480px] bg-white rounded-xl shadow-sm border border-outline-variant/20 p-8 text-center">
          
          <h1 className="text-[28px] font-semibold text-gray-900 mb-2 leading-tight">
            Entre na sua conta e negocie com segurança!
          </h1>
          <p className="text-gray-500 mb-8 text-[15px]">
            Acesse e aproveite uma experiência segura dentro da MarketPlace.
          </p>

          {/* Social Logins */}
          <div className="flex justify-center gap-4 mb-8">
            <button 
              className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white"
              onClick={() => handleOAuth('google')}
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
            <button 
              className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1877F2] text-white shadow-sm hover:shadow-md transition-shadow hover:bg-[#166fe5]"
              onClick={() => handleOAuth('facebook')}
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative px-4 bg-white text-sm text-gray-400">
              Ou conecte com email
            </div>
          </div>

          <form onSubmit={handleAuth} className="text-left">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                placeholder="seu@email.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-md rounded-full transition-colors mb-6 flex justify-center items-center h-[48px]"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (isSignUp ? 'Criar Conta' : 'Acessar')}
            </button>
          </form>

          <div className="text-sm text-gray-600 mb-6">
            {isSignUp ? (
              <>Já tem uma conta? <button onClick={() => setIsSignUp(false)} className="text-primary hover:underline font-medium">Faça login</button></>
            ) : (
              <>Não tem uma conta? <button onClick={() => setIsSignUp(true)} className="text-primary hover:underline font-medium">Cadastre-se</button></>
            )}
          </div>

          <a href="#" className="inline-block text-sm text-gray-500 hover:text-gray-700 hover:underline mb-8">
            Preciso de ajuda &gt;
          </a>
        </div>
      </div>

      <footer className="py-6 px-4 text-center border-t border-outline-variant/20 bg-surface text-xs text-gray-400 max-w-3xl mx-auto w-full">
        Ao continuar, você concorda com os <a href="#" className="underline hover:text-gray-600">Termos de Uso</a> e a <a href="#" className="underline hover:text-gray-600">Política de Privacidade</a> da MarketPlace e seus parceiros, e em receber comunicações da MarketPlace.
      </footer>
    </div>
  );
}

