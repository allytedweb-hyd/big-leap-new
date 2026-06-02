'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollPage } from '../../utils/Scroll';
import { ToastContainer } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";
import 'react-toastify/dist/ReactToastify.css';

interface ProvidersProps {
  children: React.ReactNode;
}

// All /lms/* routes are considered LMS routes
function useIsLmsRoute() {
  const pathname = usePathname();
  return pathname?.startsWith('/lms');
}

// Watch localStorage for token changes (login / logout events)
function useHasStudentToken() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Read initial value
    setHasToken(!!localStorage.getItem('student_token'));

    // Listen for storage events fired from other tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'student_token') {
        setHasToken(!!e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);

    // Poll every 500 ms to catch same-tab login / logout
    const interval = setInterval(() => {
      setHasToken(!!localStorage.getItem('student_token'));
    }, 500);

    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  return hasToken;
}

export default function Providers({ children }: ProvidersProps) {
  const isLmsRoute = useIsLmsRoute();
  const hasToken   = useHasStudentToken();

  // Hide website Header & Footer when the user is logged in OR on an LMS route
  const hideChromeUI = hasToken || isLmsRoute;

  return (
    <ScrollPage>
      {!hideChromeUI && <Header />}

      <main>{children}</main>

      {!hideChromeUI && <Footer />}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ScrollPage>
  );
}