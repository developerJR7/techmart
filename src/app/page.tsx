"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import { CustomerChatbot } from "@/components/customer-chatbot";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  isFeatured: boolean;
}

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1500&h=400&fit=crop",
    title: "Eletrônicos em Oferta",
    subtitle: "Até 50% OFF"
  },
  {
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1500&h=400&fit=crop",
    title: "Moda e Estilo",
    subtitle: "Novas coleções"
  },
  {
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1500&h=400&fit=crop",
    title: "Casa e Decoração",
    subtitle: "Renove seu lar"
  }
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get("/products?limit=30");
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        const mockProducts: Product[] = Array.from({ length: 30 }, (_, i) => ({
          id: `mock-${i + 1}`,
          name: `Produto ${i + 1}`,
          slug: `produto-${i + 1}`,
          price: 99.99 + (i * 30),
          image: `https://images.unsplash.com/photo-${1500000000000 + i}?w=400&h=400&fit=crop`,
          isFeatured: i < 10,
        }));
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A' }}>
      {/* Hero Carousel */}
      <div style={{ position: 'relative', background: 'linear-gradient(135deg, #7F5AF0 0%, #5a3fb8 100%)' }}>
        <div className="embla" ref={emblaRef} style={{ overflow: 'hidden' }}>
          <div className="embla__container" style={{ display: 'flex' }}>
            {carouselImages.map((slide, index) => (
              <div key={index} className="embla__slide" style={{ flex: '0 0 100%', minWidth: 0 }}>
                <div style={{ position: 'relative', height: '400px', backgroundColor: '#1a1a1a' }}>
                  <Image
                    src={slide.url}
                    alt={slide.title}
                    fill
                    style={{ objectFit: 'cover', opacity: 0.7 }}
                    priority={index === 0}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '60px',
                    color: '#fff',
                    textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
                    zIndex: 10
                  }}>
                    <h2 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' }}>{slide.title}</h2>
                    <p style={{ fontSize: '24px' }}>{slide.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollPrev}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '4px',
            padding: '10px',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <ChevronLeft size={30} />
        </button>

        <button
          onClick={scrollNext}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '4px',
            padding: '10px',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <ChevronRight size={30} />
        </button>
      </div>

      {/* Category Cards */}
      <div style={{ maxWidth: '1500px', margin: '-80px auto 0', padding: '0 20px', position: 'relative', zIndex: 5 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {/* Card 1 */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}>
            <h3 style={{ fontSize: '21px', fontWeight: 'bold', marginBottom: '15px' }}>Compre presentes por preço</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <Image src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=150&h=150&fit=crop" alt="Produto" width={150} height={150} style={{ borderRadius: '4px' }} />
                <p style={{ fontSize: '12px', marginTop: '8px' }}>Até US$ 10</p>
              </div>
              <div>
                <Image src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop" alt="Produto" width={150} height={150} style={{ borderRadius: '4px' }} />
                <p style={{ fontSize: '12px', marginTop: '8px' }}>Até US$ 25</p>
              </div>
            </div>
            <Link href="/products" style={{ color: '#007185', fontSize: '13px', textDecoration: 'none' }}>Ver todas as ofertas</Link>
          </div>

          {/* Card 2 */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}>
            <h3 style={{ fontSize: '21px', fontWeight: 'bold', marginBottom: '15px' }}>Ligue seu jogo</h3>
            <Image src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=350&h=250&fit=crop" alt="Gaming" width={350} height={250} style={{ borderRadius: '4px', marginBottom: '15px' }} />
            <Link href="/products?category=gaming" style={{ color: '#007185', fontSize: '13px', textDecoration: 'none' }}>Ver mais</Link>
          </div>

          {/* Card 3 */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}>
            <h3 style={{ fontSize: '21px', fontWeight: 'bold', marginBottom: '15px' }}>Atualizações para o lar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <Image src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=150&h=150&fit=crop" alt="Casa" width={150} height={150} style={{ borderRadius: '4px' }} />
                <p style={{ fontSize: '12px', marginTop: '8px' }}>Decoração</p>
              </div>
              <div>
                <Image src="https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=150&h=150&fit=crop" alt="Móveis" width={150} height={150} style={{ borderRadius: '4px' }} />
                <p style={{ fontSize: '12px', marginTop: '8px' }}>Móveis</p>
              </div>
            </div>
            <Link href="/products" style={{ color: '#007185', fontSize: '13px', textDecoration: 'none' }}>Compre agora</Link>
          </div>

          {/* Card 4 */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}>
            <h3 style={{ fontSize: '21px', fontWeight: 'bold', marginBottom: '15px' }}>Grandes ofertas</h3>
            <Image src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=350&h=250&fit=crop" alt="Ofertas" width={350} height={250} style={{ borderRadius: '4px', marginBottom: '15px' }} />
            <Link href="/products" style={{ color: '#007185', fontSize: '13px', textDecoration: 'none' }}>Ver ofertas</Link>
          </div>
        </div>

        {/* Products Grid */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '21px', fontWeight: 'bold', marginBottom: '20px' }}>Produtos em destaque</h2>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {[...Array(12)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-square w-full mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {products.slice(0, 12).map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  slug={product.slug}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Customer Chatbot */}
      <CustomerChatbot />
    </div>
  );
}

