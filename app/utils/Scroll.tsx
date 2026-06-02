// utilities/Scroll.tsx
'use client';

import React, { createContext, useRef, RefObject, ReactNode } from "react";

export type SectionRef = RefObject<HTMLDivElement | null>; 
export interface ScrollContextValue {
  // Refs now correctly use the SectionRef type
  scrollToSection: SectionRef
  faqSectionRef: SectionRef;
  trainerSectionRef: SectionRef;
  choiceSectionRef: SectionRef;
  clientSectionRef: SectionRef;
  voiceSectionRef: SectionRef;
  getInSectionRef: SectionRef;
  
  // Functions
  scrollToFaq: () => void;
  scrollToTrainer: () => void;
  scrollToChoice: () => void;
  scrollToClients: () => void;
  scrollToVoices: () => void;
  getInTouch: () => void;
}

// Define the properties for the Provider component
interface ScrollPageProps {
  children: ReactNode;
}

// --- 2. Create Context ---

// Initialize the context as undefined, explicitly typing the possible value
export const ScrollContext = createContext<ScrollContextValue | undefined>(undefined); 

// --- 3. Scroll Provider Component ---

export const ScrollPage = ({ children }: ScrollPageProps) => { 
  // Initialization remains the same, but the type matches the new SectionRef
  const scrollToSection = useRef<HTMLDivElement>(null);
  const faqSectionRef = useRef<HTMLDivElement>(null);
  const trainerSectionRef = useRef<HTMLDivElement>(null);
  const choiceSectionRef = useRef<HTMLDivElement>(null);
  const clientSectionRef = useRef<HTMLDivElement>(null);
  const voiceSectionRef = useRef<HTMLDivElement>(null);
  const getInSectionRef = useRef<HTMLDivElement>(null);

  /**
   * Scrolls to a specific ref element with an offset, adjusting for mobile vs. desktop.
   * @param ref The RefObject pointing to the target HTMLDivElement.
   */
  const scrollWithOffset = (ref: SectionRef) => {
    // Check if the ref.current exists before accessing DOM properties
    if (ref.current) {
      const isMobile: boolean = window.innerWidth <= 768;
      const offset: number = isMobile ? 50 : 100; 
      
      const elementPosition: number =
        ref.current.getBoundingClientRect().top + window.scrollY;
        
      window.scrollTo({ 
        top: elementPosition - offset, 
        behavior: "smooth" 
      });
    }
  };

  // Wrapper functions are now correct because `scrollWithOffset` accepts the type SectionRef
  const scrollToFaq = (): void => scrollWithOffset(faqSectionRef);
  const scrollToTrainer = (): void => scrollWithOffset(trainerSectionRef);
  const scrollToChoice = (): void => scrollWithOffset(choiceSectionRef);
  const scrollToClients = (): void => scrollWithOffset(clientSectionRef);
  const scrollToVoices = (): void => scrollWithOffset(voiceSectionRef);
  const getInTouch = (): void => scrollWithOffset(getInSectionRef);

  // The value object holds all the refs and functions
  const contextValue: ScrollContextValue = {
    faqSectionRef,
    scrollToFaq,
    scrollToSection,
    trainerSectionRef,
    scrollToTrainer,
    choiceSectionRef,
    scrollToChoice,
    clientSectionRef,
    scrollToClients,
    voiceSectionRef,
    scrollToVoices,
    getInSectionRef,
    getInTouch,
  };

  return (
    <>
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  </>
  );
};