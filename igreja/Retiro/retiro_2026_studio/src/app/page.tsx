import EventDetails from '@/components/event-details';
import Gallery from '@/components/gallery';
import LandingHero from '@/components/landing-hero';
import RegistrationSection from '@/components/registration-section';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';

const churchIcon = PlaceHolderImages.find(p => p.id === 'church-logo');

const Footer = () => (
  <footer className="w-full bg-background mt-auto">
    <Separator />
    <div className="container mx-auto py-8 px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {churchIcon && (
          <Image
            src={churchIcon.imageUrl}
            alt="Logo da Igreja"
            width={40}
            height={40}
            className="rounded-full"
            data-ai-hint={churchIcon.imageHint}
          />
        )}
        <p className="text-sm text-muted-foreground font-headline">&copy; 2024 Retiro Maranata. Todos os direitos reservados.</p>
      </div>
      <p className="text-xs text-muted-foreground text-center sm:text-right">
        Um tempo de renovação e comunhão.
      </p>
    </div>
  </footer>
);

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <main className="flex-1">
        <LandingHero />
        <Gallery />
        <EventDetails />
      </main>
      <Footer />
    </div>
  );
}
