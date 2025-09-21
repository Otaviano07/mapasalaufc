import RegistrationSection from '@/components/registration-section';

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <main className="flex-1">
        <RegistrationSection />
      </main>
    </div>
  );
}
