import RegisterForm from '@/components/RegisterForm';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6', padding: 20 }}>
      <RegisterForm />
    </div>
  );
}
