import { useState } from 'react';
import { ViewType } from '../types';
import { ChevronRight, Heart, Star, ShieldCheck, Truck, MessageCircle } from 'lucide-react';

interface ProductViewProps {
  setView: (view: ViewType) => void;
}

export function ProductView({ setView }: ProductViewProps) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 grid grid-cols-1 lg:grid-cols-12 gap-gutter w-full">
      {/* Main Content Area */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        {/* Breadcrumbs */}
        <nav className="flex text-label-md font-label-md text-on-surface-variant gap-2 items-center">
          <button onClick={() => setView('explore')} className="hover:text-primary">Início</button>
          <ChevronRight size={16} />
          <button className="hover:text-primary">Eletrônicos</button>
          <ChevronRight size={16} />
          <span className="text-on-surface">Câmera Profissional</span>
        </nav>

        {/* Product Image Gallery */}
        <section className="flex flex-col gap-4">
          <div className="relative w-full aspect-[4/3] md:aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden bg-surface-container shadow-sm transition-opacity duration-300">
            <img 
              src={activeImage} 
              alt="Produto principal" 
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <button className="absolute top-4 right-4 p-2 bg-surface/80 backdrop-blur-md rounded-full shadow-md text-on-surface hover:text-error transition-colors">
              <Heart size={24} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {images.map((img, i) => (
              <img 
                key={i}
                src={img} 
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover cursor-pointer transition-all border-2 ${activeImage === img ? 'border-primary opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                alt="Miniatura"
              />
            ))}
          </div>
        </section>

        {/* Detailed Description */}
        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-6">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Descrição do Produto</h2>
            <p className="text-on-surface-variant font-body-md leading-relaxed">
              Câmera profissional em estado impecável, utilizada apenas em estúdio controlado. Este equipamento oferece uma resolução excepcional de 45MP, sistema de autofoco por IA e gravação de vídeo em 8K. Ideal para fotógrafos que buscam a máxima fidelidade de cores e desempenho em qualquer condição de luz.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-outline-variant">
            <div className="flex flex-col">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Marca</span>
              <span className="text-body-md font-bold text-on-surface">Vision Pro</span>
            </div>
            <div className="flex flex-col">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Estado</span>
              <span className="text-body-md font-bold text-primary">Excelente</span>
            </div>
            <div className="flex flex-col">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Localização</span>
              <span className="text-body-md font-bold text-on-surface">São Paulo, SP</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-4">
            <span className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-md font-label-md">#fotografia</span>
            <span className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-md font-label-md">#camera</span>
            <span className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-md font-label-md">#profissional</span>
            <span className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-md font-label-md">#seminovo</span>
          </div>
        </section>
      </div>

      {/* Sidebar Purchase Actions */}
      <aside className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-lg sticky top-24">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-bold">DESTAQUE</span>
              <span className="text-on-surface-variant text-label-sm font-label-sm">Postado há 2 horas</span>
            </div>
            <h1 className="font-headline-lg text-[28px] md:text-headline-lg text-on-surface mb-2 leading-tight">Câmera Profissional Vision X-Pro 45MP</h1>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <span className="font-display-lg text-[36px] md:text-[40px] text-primary leading-tight">R$ 12.500</span>
              <span className="text-on-surface-variant text-label-md font-label-md">ou 12x de R$ 1.150</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button className="w-full py-4 bg-primary text-white rounded-xl font-bold text-title-lg hover:bg-primary-container transition-all active:scale-95 shadow-md shadow-primary/20">
              Comprar Agora
            </button>
            <button 
              onClick={() => setView('chat')}
              className="w-full py-4 bg-surface text-primary border-2 border-primary rounded-xl font-bold text-title-lg hover:bg-primary-fixed transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <MessageCircle />
              Chat com Vendedor
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-outline-variant flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-tertiary" />
              <span className="text-label-md text-on-surface font-medium">Compra Protegida MarketPlace</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="text-tertiary" />
              <span className="text-label-md text-on-surface font-medium">Entrega em mãos ou Correios</span>
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-4">
          <h3 className="font-title-lg text-title-lg text-on-surface">Informações do Vendedor</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-fixed flex-shrink-0">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPn4TizD4hE35JNTip7T4lQ5RA0IeAL5gTTpr00s4u5aVolaCKmPkcnJ7o55sH70YjMDcx4PyZJNhIt7Rwvwn74BwTdJ_zDggzrTaJl85NzirR9awSf1z7hdsGselstD1hIXQIzvJhqXfQLVFwN3VkWkeCe8NMb-_yVOtzeieP9G2OSBHR5XMoHEWoQS1qZhxtdq9BbxzR2nV6otBIG5QnTgl0jFSb6Pq-EWRrTvNmDWd3vVB3q0GvEKLIzcTSMZsK1p9F7tBEyZs" 
                alt="Marcos Oliveira" className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <p className="font-bold text-body-md text-on-surface">Marcos Oliveira</p>
              <p className="text-label-md text-on-surface-variant">Membro desde Out 2021</p>
              <div className="flex items-center gap-1 mt-1">
                {[1,2,3,4].map(k => <Star key={k} size={16} fill="currentColor" className="text-secondary-container" />)}
                <Star size={16} fill="currentColor" className="text-secondary-container opacity-50" />
                <span className="text-label-sm font-bold text-on-surface ml-1">4.8 (124)</span>
              </div>
            </div>
          </div>
          <button className="w-full py-2.5 bg-surface-container-low text-on-surface-variant border border-outline-variant rounded-lg font-bold text-label-md hover:bg-surface-container transition-all">
            Ver todos os anúncios
          </button>
        </div>
      </aside>

      {/* Related Items */}
      <section className="lg:col-span-12 mt-12 w-full max-w-full overflow-hidden">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Itens Relacionados</h2>
            <p className="text-on-surface-variant font-body-md">Produtos que talvez você goste baseado na sua pesquisa</p>
          </div>
          <button className="text-primary font-bold hover:underline hidden sm:block">Ver tudo</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter w-full">
          {relatedItems.map((item, i) => (
            <div key={i} className="group bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-square overflow-hidden relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm text-on-surface-variant hover:text-error transition-colors cursor-pointer">
                  <Heart size={20} />
                </div>
              </div>
              <div className="p-4">
                <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">{item.category}</p>
                <h4 className="font-title-lg text-title-lg text-on-surface mb-2 line-clamp-1">{item.title}</h4>
                <p className="font-bold text-headline-md text-on-surface">R$ {item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const images = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD3YePeG9K8j-FgZcMtT2cmMyPABoU6gI2-hOF2yj4r0CSIalTBK2vsAg9hG1uoV-FJ8Ftl3hNk95iF6ZSLcLOktkTfmpNfPEyx5cTl4QJaHY7pJEZlUw2hCAgVzBxpeL89_9S0O9syPb6Wv-TiprehfuTZvUwIgRgCcI_avQDxCkWLGxVgztW-43BBN-IK7x01x2DsZfYhHAh5dmqovvBpNCvmfiQ5PMfeXDwkzY3ajH-RMajs0IyRnUSifUIhFH7qVdqDEN7EB-E",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBt3YmJUPUXTfFGl5euEhe94ttyYQ7L9nHAnZ5RD7ma_E6GHW1e942SiAVYei6siWc4aHHsLyAN71SxGRtUA0tYGF7rkYS2MdGMbZYkKPNgtg0qUHfj0syeMN99E607Er4LZT71EPPvdFucvD6L91rAdRDhXMljyALUasNVTzhCgH4f3mNiK8CT9REVRIeCaPLY_R-z8dzpEPSSit6heFrAirCpdCOE1WDabCgKSDAl76x09cXHSx82CVidD0zTDZJAFrI_pavILSQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBwxoWCDGb6Sm0tHrv5jLi6iUtCR3wTDsdgHoOMEjjsGG0sP-wN8r8rSp8tzo53BlZqo-VRH5wYdxkD4P5ILYmw6CxLyGtWOCqMABLPGQKLAPvDDAyDdrjBUdNxEd2s6WTbkUw8ScBkjZGMTfP9AhHsHKiFpku9LR8U5_2vwLLSNRFpKLzuCknYTbWk3xus4YFUVaaq8IhQiIlblZj78bCMPtysuV5NHR-ObmBbbUkQlngRlGp5lcglP6BoVQ5pZ5b5VeILAwpFtk0",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCfq69f0UUPWE6mHJxe9ifIWG1XTmJQ2zD-fC14FyOd5XR7Dz6gYUxneeeP1oBRqbXsx8RmGTkdjRwVJDVJo0cqhiQsfs3-ZbK-0whQz4n3Q8wnNITc_NRRQxqXYnKRMvI4AhVA03kQH_NdgUj0wK0-HAHr-3Ci1T674rYK5lU0Je3Ipe8skOPmJqvkUbZIPwe0qdGcOdHd3GimmXVjNH0Qy3bH7rg8IdlCoRhv82VNBFkCSEgCTHXdLZjHmhuJnsCkKMmsjLoDwG0"
];

const relatedItems = [
  {
    category: "Lentes",
    title: "Lente Prime 85mm f/1.4",
    price: "4.200",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPZ_qlzf3miohDqtYBQJqvDnQTQiAeXnmo-oqrtAUyqojEBQx4smVoEEI6AumsNYDWE-FoH4W75iVDeCuLADDBLWLb9yhFFB3o3_1LFTQVdq-izorSCP8uQ8pW_SumwdpAcux3NxVBWGKj2WAb_T5Z-QHR82fUlLav6oYaDciSyrsiQmcYBvGqOcFCij_j8hzWEH2KHbxEgPGlkI9KgCgJHeBw6ooIbU2zv-NkORrnd1m-HE9SrGK-UyWcfWMmioxSScWIFHhJVWI"
  },
  {
    category: "Acessórios",
    title: "Tripé Profissional Carbon",
    price: "1.850",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtUidFeGiVv38zE0O9dDGWxAY22CUVSYwuydbqLBW1GYXlFIQgY4BUmKJt8usa59LSQpRILGTIM4Grh5bWutrZJZG6df4eNmKgLrTfCiLCn0F8-eCctqFpv3MEdFBoIxfOXFbdaSqOEYGDtjv5buH69p0_MQLkTctQqnxVREmf24U-2Q8GK9HhciXTPRRaEIajDPIH3LxBdXgZONimJb0tk7vYyDsQQNN3A_-twqSolXVMByfp4dnKQoG6HX-8kVfNUsRWNZCu6LA"
  },
  {
    category: "Iluminação",
    title: "Kit Flash Wireless 300W",
    price: "2.400",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDenqBexz3gUuu_pkzSUFk5kHawz4UOvAb-pwxS9rexs0GngrkXzLmVVs1IT5TB5IlQuBVSBjWH2eaX2xlVU5rRK11AJ3EZ5GsWTHL0Uvext57xOoTJYeXg7VaeoVp--JMFXwwsSKVZ53LITlblfOmKjZS6-dRffHTS2QU2Gs_rBqOQ7YvnGWwI33-TlAnCHQlsNJB71jEVuW75UPRjYfBv34pleXBE98_eEpriC7A8KdOF-ea8tcTCj95RzqjFiObd9Q3sQEbQgQ"
  },
  {
    category: "Transporte",
    title: "Mochila Trekking Photo 40L",
    price: "890",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKs_JbBC75wmmRTkbKYs4Yjt_JUSxPdErA31hQ73L3EpGAHRZR8xAMZvVTJcLRQyYDeP73D8A9pLAOQmhW0OaXPQWL6E6AQhPLZKfsEylYLUFEz6y3pvO3w2v3c9EXs5Mrducdk4bi6PmLaQ2qAXM9sRklBLehnCXlZ0lH1ZHEkB9c-VNx_guPbnAzoyV3W_rzHumuuuLMIHfdYFEEdDISRT3um1TpCVupVKND44uQWdnvxNnLc_JLAM34u9FqQIT_cfveEPsYOCw"
  }
];
