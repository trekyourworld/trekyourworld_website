import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AutoScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Automatically scroll to top when pathname changes, with smooth behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
  
  return null; // This component doesn't render anything
};

export default AutoScrollToTop;