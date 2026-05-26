import { ViewType } from '../types';
import { CloudUpload, CheckCircle, Star, ShieldCheck, Gem } from 'lucide-react';
import React, { useState } from 'react';

import { supabase } from '../lib/supabase';

interface CreateAdViewProps {
  setView: (view: ViewType) => void;
  editId?: string;
  onClearEdit?: () => void;
}

export function CreateAdView({ setView, editId, onClearEdit }: CreateAdViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAd, setIsLoadingAd] = useState(!!editId);
  const [initialData, setInitialData] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  React.useEffect(() => {
    if (editId) {
      setIsLoadingAd(true);
      fetch(`/api/ads/${editId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setInitialData(data);
            let imgs = [];
            try {
              imgs = typeof data.images === 'string' ? JSON.parse(data.images) : data.images;
              if (!Array.isArray(imgs)) imgs = [];
            } catch(e) {}
            setSelectedImages(imgs);
          }
        })
        .finally(() => setIsLoadingAd(false));
    } else {
      setIsLoadingAd(false);
      setInitialData(null);
      setSelectedImages([]);
    }
  }, [editId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesInfo = Array.from(e.target.files).map((file: File) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
      Promise.all(filesInfo).then(base64Images => {
        setSelectedImages(prev => [...prev, ...base64Images]);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Extract form data synchronously before any await because e.currentTarget becomes null after await
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title');
    const category = formData.get('category');
    const price = formData.get('price');
    const description = formData.get('description');
    const cep = formData.get('cep');
    const cidade = formData.get('cidade');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user_email = session?.user?.email || null;

      const data = {
        title,
        category,
        price,
        description,
        images: selectedImages.length > 0 ? selectedImages : ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"], // Fallback if no images
        location: `${cep || ''} - ${cidade || ''}`.replace(/^- |-$/g, ''),
        user_email,
      };

      const endpoint = editId ? `/api/ads/${editId}` : '/api/ads';
      const method = editId ? 'PUT' : 'POST';

      const resp = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      let result;
      try {
        result = await resp.json();
      } catch (e) {
        throw new Error("Erro no servidor (A função falhou). Verifique se você está usando a porta 6543 (Connection Pooling) no DATABASE_URL da Vercel.");
      }

      if (resp.ok && !result.error) {
        console.log('Anúncio salvo com sucesso no banco!');
        onClearEdit?.();
        setView('dashboard');
      } else {
        console.error('Erro ao publicar anúncio: ', result.error || result.message);
        alert(`Erro ao publicar anúncio: ${result.error || result.message || 'Verifique as variáveis de ambiente no Vercel (DATABASE_URL).'}`);
      }
    } catch (err: any) {
      console.error(err);
      alert('Ocorreu um erro de conexão: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingAd) {
    return (
      <div className="flex h-screen items-center justify-center -mt-20">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-on-surface-variant font-label-lg">Carregando dados...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 min-h-screen w-full">
      <div className="max-w-4xl mx-auto w-full">
        <header className="mb-10 text-center">
          <h1 className="font-display-lg text-[32px] md:text-display-lg mb-2">{editId ? 'Editar Anúncio' : 'Criar Novo Anúncio'}</h1>
          <p className="text-on-surface-variant font-body-lg text-body-lg">
            {editId ? 'Atualize as informações do seu produto abaixo.' : 'Preencha os detalhes abaixo para começar a vender hoje mesmo.'}
          </p>
        </header>

        {/* Multi-step Progress Bar */}
        <div className="flex items-center justify-center mb-12 gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm md:text-base">1</span>
            <span className="font-label-md text-label-md text-primary hidden sm:inline">Informações</span>
          </div>
          <div className="w-8 md:w-16 h-0.5 bg-outline-variant"></div>
          <div className="flex items-center gap-2 opacity-50">
            <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-sm md:text-base">2</span>
            <span className="font-label-md text-label-md hidden sm:inline">Destaque</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 md:p-12 border border-outline-variant w-full">
          <form className="space-y-12" onSubmit={handleSubmit}>
            
            {/* Step 1 */}
            <section className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="font-title-lg text-[18px] md:text-title-lg block text-on-surface">Título do Anúncio</label>
                  <input name="title" type="text" defaultValue={initialData?.title} className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-surface" placeholder="Ex: iPhone 14 Pro Max 256GB - Azul" required />
                </div>
                
                <div className="space-y-2">
                  <label className="font-title-lg text-[18px] md:text-title-lg block text-on-surface">Categoria</label>
                  <select name="category" defaultValue={initialData?.category || ''} className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-surface" required>
                    <option value="">Selecione uma categoria</option>
                    <option value="eletronicos">Eletrônicos</option>
                    <option value="veiculos">Veículos</option>
                    <option value="imoveis">Imóveis</option>
                    <option value="moda">Moda</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="font-title-lg text-[18px] md:text-title-lg block text-on-surface">Preço (R$)</label>
                  <input name="price" type="number" defaultValue={initialData?.price} className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-surface" placeholder="0,00" required />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="font-title-lg text-[18px] md:text-title-lg block text-on-surface">Descrição Detalhada</label>
                  <textarea name="description" rows={5} defaultValue={initialData?.description} className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-surface" placeholder="Descreva as condições do produto, tempo de uso e diferenciais..." required></textarea>
                </div>

                {/* Upload Zone */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="font-title-lg text-[18px] md:text-title-lg block text-on-surface">Fotos do Produto</label>

                  {selectedImages.length > 0 && (
                    <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
                      {selectedImages.map((src, i) => (
                        <div key={i} className="relative min-w-[96px] h-24 rounded-lg overflow-hidden border border-outline-variant shrink-0">
                          <img src={src} alt="Upload preview" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => setSelectedImages(prev => prev.filter((_, idx) => idx !== i))} 
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/70 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <label className="block border-2 border-dashed border-primary/30 bg-surface-container-low rounded-xl p-8 md:p-12 text-center cursor-pointer hover:bg-surface-container-high transition-all group">
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <CloudUpload className="mx-auto text-primary mb-4 w-12 h-12 md:w-16 md:h-16 group-hover:scale-110 transition-transform" />
                    <p className="font-headline-md text-[20px] md:text-headline-md text-on-surface mb-1">Arraste ou clique para enviar</p>
                    <p className="text-on-surface-variant font-label-md text-label-md">PNG, JPG até 10MB</p>
                  </label>
                </div>

                {/* Location */}
                <div className="col-span-1 md:col-span-2 space-y-4 pt-6 border-t border-outline-variant">
                  <h3 className="font-headline-md text-headline-md">Localização</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-label-md text-label-md block text-on-surface-variant">CEP</label>
                      <input name="cep" type="text" className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-surface" placeholder="00000-000" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md text-label-md block text-on-surface-variant">Cidade / Bairro</label>
                      <input name="cidade" type="text" defaultValue={initialData?.location} className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-surface" placeholder="Ex: São Paulo, SP" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2 Promotion Packages */}
            <section className="space-y-8 pt-8 border-t border-outline-variant">
              <div className="flex flex-col gap-2">
                <h3 className="font-headline-lg text-[24px] md:text-headline-lg text-on-surface">Dê um upgrade no seu anúncio</h3>
                <p className="text-on-surface-variant leading-tight">Anúncios destacados vendem até 5x mais rápido.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Diamond Option */}
                <label className="relative group cursor-pointer h-full">
                  <input type="radio" name="promo" value="diamond" className="peer sr-only" defaultChecked />
                  <div className="h-full border-2 border-outline-variant rounded-xl p-6 transition-all bg-surface hover:border-primary-container peer-checked:border-primary peer-checked:bg-primary-container peer-checked:text-on-primary-container flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Gem size={32} />
                        <span className="px-2 py-1 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider">Recomendado</span>
                      </div>
                      <h4 className="font-headline-md text-headline-md mb-2">Diamante</h4>
                      <ul className="space-y-2 text-label-md mb-6">
                        <li className="flex items-center gap-2"><CheckCircle size={16} /> Topo das buscas</li>
                        <li className="flex items-center gap-2"><CheckCircle size={16} /> Galeria Home</li>
                        <li className="flex items-center gap-2"><CheckCircle size={16} /> 30 dias ativos</li>
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-outline-variant/30 flex items-baseline gap-1 mt-auto">
                      <span className="text-label-sm">R$</span>
                      <span className="text-[32px] font-bold">89,90</span>
                    </div>
                  </div>
                </label>
                
                {/* Gold Option */}
                <label className="relative group cursor-pointer h-full">
                  <input type="radio" name="promo" value="gold" className="peer sr-only" />
                  <div className="h-full border-2 border-outline-variant rounded-xl p-6 transition-all bg-surface hover:border-primary-container peer-checked:border-primary peer-checked:bg-primary-container peer-checked:text-on-primary-container flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-4">
                        <Star size={32} fill="currentColor" />
                      </div>
                      <h4 className="font-headline-md text-headline-md mb-2">Ouro</h4>
                      <ul className="space-y-2 text-label-md mb-6 opacity-80">
                        <li className="flex items-center gap-2"><CheckCircle size={16} /> Destaque prata</li>
                        <li className="flex items-center gap-2"><CheckCircle size={16} /> 15 dias ativos</li>
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-outline-variant/30 flex items-baseline gap-1 mt-auto">
                      <span className="text-label-sm">R$</span>
                      <span className="text-[32px] font-bold">49,90</span>
                    </div>
                  </div>
                </label>

                {/* Silver Option */}
                <label className="relative group cursor-pointer h-full">
                  <input type="radio" name="promo" value="silver" className="peer sr-only" />
                  <div className="h-full border-2 border-outline-variant rounded-xl p-6 transition-all bg-surface hover:border-primary-container peer-checked:border-primary peer-checked:bg-primary-container peer-checked:text-on-primary-container flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-4">
                        <ShieldCheck size={32} />
                      </div>
                      <h4 className="font-headline-md text-headline-md mb-2">Prata</h4>
                      <ul className="space-y-2 text-label-md mb-6 opacity-80">
                        <li className="flex items-center gap-2"><CheckCircle size={16} /> Selo verificado</li>
                        <li className="flex items-center gap-2"><CheckCircle size={16} /> 7 dias ativos</li>
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-outline-variant/30 flex items-baseline gap-1 mt-auto">
                      <span className="text-label-sm">R$</span>
                      <span className="text-[32px] font-bold">19,90</span>
                    </div>
                  </div>
                </label>
              </div>

              <label className="flex items-start sm:items-center gap-3 cursor-pointer group mt-4">
                <input type="checkbox" className="mt-1 sm:mt-0 w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all flex-shrink-0" />
                <span className="text-on-surface-variant text-body-md group-hover:text-on-surface transition-colors">Desejo publicar sem destaque por enquanto (Gratuito)</span>
              </label>
            </section>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-outline-variant/30 mt-12 w-full">
              <button 
                type="button" 
                onClick={() => {
                  onClearEdit?.();
                  setView('dashboard');
                }}
                className="order-2 sm:order-1 text-primary font-bold hover:underline transition-all py-3 px-4 w-full sm:w-auto"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="order-1 sm:order-2 w-full sm:w-auto bg-primary-container text-white px-8 md:px-12 py-4 rounded-full font-headline-md text-[18px] md:text-headline-md shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </>
                ) : (editId ? 'Salvar Alterações' : 'Publicar Anúncio')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
