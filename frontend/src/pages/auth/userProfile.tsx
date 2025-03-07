import { UserProfile } from "@clerk/clerk-react";

export const ProfilePage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-800 p-4">
      <div className="bg-slate-700 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Your Profile</h1>
        <UserProfile 
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-slate-700',
              navbar: 'bg-slate-700 text-white',
              navbarButton: 'text-white hover:text-blue-300',
              pageScrollBox: 'bg-slate-700',
              formButtonPrimary: 'bg-blue-500 hover:bg-blue-700 text-white',
              formFieldLabel: 'text-white',
              formFieldInput: 'bg-slate-600 text-white border-slate-500',
              profileSectionTitle: 'text-white',
              profileSectionTitleText: 'text-white',
              userPreviewMainIdentifier: 'text-white',
              userPreviewSecondaryIdentifier: 'text-gray-300',
            }
          }}
        />
      </div>
    </div>
  );
};