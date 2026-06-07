'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ScrollPage } from '../../utils/Scroll';
import { ToastContainer } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";
import 'react-toastify/dist/ReactToastify.css';

interface ProvidersProps {
  children: React.ReactNode;
}

function useIsLmsRoute() {
  const pathname = usePathname();
  return pathname?.startsWith('/lms');
}

export default function Providers({ children }: ProvidersProps) {
  const hideChromeUI = useIsLmsRoute();

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