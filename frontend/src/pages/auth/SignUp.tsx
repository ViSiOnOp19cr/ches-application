import { SignUp } from "@clerk/clerk-react";

export const SignUpPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-800">
      <div className="bg-slate-700 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign Up</h1>
        <SignUp 
          routing="path" 
          path="/sign-up" 
          signInUrl="/sign-in"
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