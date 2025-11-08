import SignInForm from '../components/Start/Signin';

export default function SignInPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center 
                 bg-gradient-to-br from-green-100 via-emerald-200 to-lime-200 
                 font-sans"
    >
      <SignInForm />
    </main>
  );
}