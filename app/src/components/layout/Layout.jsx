import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../ui/ScrollToTop';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Layout;