import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Gallery() {
  const galleryImages = PlaceHolderImages.filter((img) => img.id.startsWith('gallery-'));

  return (
    <section className="w-full py-12 md:py-20 lg:py-28 bg-secondary">
      <div className="container px-4 md:px-6 flex flex-col items-center">
        <div className="space-y-2 mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Momentos Inesquecíveis</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Veja algumas fotos de nossos retiros passados e sinta um pouco da atmosfera que te espera.
            </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-4xl"
        >
          <CarouselContent>
            {galleryImages.map((image) => (
              <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="overflow-hidden shadow-lg">
                    <CardContent className="flex aspect-video items-center justify-center p-0">
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        width={600}
                        height={400}
                        className="object-cover w-full h-full"
                        data-ai-hint={image.imageHint}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
