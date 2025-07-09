"use client";

import React from "react";
import StyledComponentsRegistry from "./StyledComponentsRegistry";
import GlobalStyle from "./GlobalStyle";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <StyledComponentsRegistry>
      <GlobalStyle />
      {children}
    </StyledComponentsRegistry>
  );
};
