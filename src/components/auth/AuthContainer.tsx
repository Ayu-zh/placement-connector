
import { ReactNode } from 'react';

interface AuthContainerProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthContainer = ({ children, title, subtitle }: AuthContainerProps) => {
  return (
    <div className="w-full max-w-md space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          {title}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  );
};

export default AuthContainer;
