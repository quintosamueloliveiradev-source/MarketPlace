import { Globe, Trophy, PlaySquare } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full px-margin-mobile md:px-margin-desktop py-12 flex flex-col items-center border-t border-outline-variant bg-surface-container-low dark:bg-on-background mt-auto">
      <div className="w-full max-w-container-max grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-1">
          <div className="font-headline-md font-bold text-on-surface mb-6">MarketPlace</div>
          <p className="text-on-surface-variant font-label-md">
            A maior plataforma de compra e venda do Brasil. Conectando pessoas e criando oportunidades desde 2024.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6">Comprar</h4>
          <ul className="space-y-4 text-on-surface-variant font-label-md">
            <li><a href="#comprar" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors">Como funciona</a></li>
            <li><a href="#comprar" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors">Segurança</a></li>
            <li><a href="#comprar" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors">Mapa do site</a></li>
            <li><a href="#comprar" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors">Localidades</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Vender</h4>
          <ul className="space-y-4 text-on-surface-variant font-label-md">
            <li><a href="#vender" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors">Dicas para vender</a></li>
            <li><a href="#vender" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors">Planos de destaque</a></li>
            <li><a href="#vender" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors">Venda Profissional</a></li>
            <li><a href="#vender" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors">Taxas e Regras</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Institucional</h4>
          <div className="flex flex-wrap gap-x-6 gap-y-4 text-on-surface-variant font-label-md">
            <a href="#institucional" onClick={(e) => e.preventDefault()} className="hover:underline">Sobre nós</a>
            <a href="#institucional" onClick={(e) => e.preventDefault()} className="hover:underline">Ajuda</a>
            <a href="#institucional" onClick={(e) => e.preventDefault()} className="hover:underline">Privacidade</a>
            <a href="#institucional" onClick={(e) => e.preventDefault()} className="hover:underline">Termos de Uso</a>
            <a href="#institucional" onClick={(e) => e.preventDefault()} className="hover:underline">Blog</a>
            <a href="#institucional" onClick={(e) => e.preventDefault()} className="hover:underline">Carreiras</a>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-container-max flex flex-col md:flex-row items-center justify-between pt-8 border-t border-outline-variant/30 text-on-surface-variant font-label-md">
        <p>© 2026 MarketPlace. Todos os direitos reservados.</p>
        <div className="flex gap-6 mt-6 md:mt-0">
          <a href="#footer" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors"><Globe size={24} /></a>
          <a href="#footer" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors"><Trophy size={24} /></a>
          <a href="#footer" onClick={(e) => e.preventDefault()} className="hover:text-primary transition-colors"><PlaySquare size={24} /></a>
        </div>
      </div>
    </footer>
  );
}
