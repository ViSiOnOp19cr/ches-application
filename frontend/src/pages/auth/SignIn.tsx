import { SignIn } from "@clerk/clerk-react";

export const SignInPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-800">
      <div className="bg-slate-700 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h1>
        <SignIn 
          routing="path" 
          path="/sign-in" 
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-500 hover:bg-blue-700 text-white',
              card: 'bg-slate-700',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-300',
              formFieldLabel: 'text-white',
              formFieldInput: 'bg-slate-600 text-white border-slate-500',
              footerActionLink: 'text-blue-400 hover:text-blue-300',
              identityPreview: 'bg-slate-600 text-white',
            }
          }}
        />
      </div>
    </div>
  );
};