import RegistrationForm from './registration-form';

export default function RegistrationSection() {
  return (
    <section id="inscricao" className="w-full py-12 md:py-20 lg:py-28 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Faça sua Inscrição</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Garanta sua vaga preenchendo o formulário abaixo. As vagas são limitadas!
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-2xl mt-12">
            <RegistrationForm />
        </div>
      </div>
    </section>
  );
}
