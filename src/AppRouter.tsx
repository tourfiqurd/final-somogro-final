import { useEffect, useState } from 'react';
import App from '@/App';
import { useAppData } from '@/context/AppDataContext';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

export default function AppRouter() {
  const { currentUser } = useAppData();
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  if (hash === '#/login') return <LoginPage />;
  if (hash === '#/register') return <RegisterPage />;
  if (hash === '#/dashboard') return currentUser ? <DashboardPage /> : <LoginPage />;
  return <App />;
}
