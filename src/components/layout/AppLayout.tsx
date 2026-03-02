import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { TopNav } from './TopNav';
import { MobileTabBar } from './MobileTabBar';
import { FAB } from './FAB';
import { ToastContainer } from '../ui/Toast';

export function AppLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-[#0a1128]">
      <TopNav />
      <main className={`flex-1 ${!isLanding ? 'pb-20 lg:pb-0' : ''}`}>
        <AnimatePresence mode="wait" initial={false}>
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <MobileTabBar />
      <FAB />
      <ToastContainer />
    </div>
  );
}
