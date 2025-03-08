
import { ReactNode } from 'react';

interface AdminAuthContainerProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const AdminAuthContainer = ({ children, title, subtitle, backgroundImage }: AdminAuthContainerProps) => {
  return (
    <div 
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: `url("${backgroundImage}")` }}
    >
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
    </div>
  );
};

export default AdminAuthContainer;
