import SignInForm from '../components/Start/Signin';

export default function SignInPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center 
                 bg-green-100 
                 font-sans"
    >
      <SignInForm />
    </main>
  );
}