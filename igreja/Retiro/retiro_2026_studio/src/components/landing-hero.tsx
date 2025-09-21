import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { MoveDown } from 'lucide-react';

export default function LandingHero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-retreat');

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center text-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute top-4 right-4 z-20"> {/* Added for login button */}
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/login">Login Administrativo</Link>
        </Button>
      </div>
      <div className="relative z-10 p-4 animate-fade-in-up">
        <h1 className="text-4xl font-extrabold tracking-tight font-headline sm:text-5xl md:text-6xl lg:text-7xl">
          Retiro Maranata 2024
        </h1>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight font-headline sm:text-3xl md:text-4xl text-primary-foreground/90">
          ™Juntos em Movimento
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-primary-foreground/90">
          Um tempo para renovar a fé, fortalecer a comunhão e se aproximar de Deus.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform duration-300 hover:scale-105">
            <Link href="/register">
              Inscreva-se Agora
              <MoveDown className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
