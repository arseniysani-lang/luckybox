'use client';

import { createContext, useContext } from 'react';

export const LeadModalContext = createContext<{ openLeadModal: () => void }>({
  openLeadModal: () => {},
});

export function useLeadModal() {
  return useContext(LeadModalContext);
}
