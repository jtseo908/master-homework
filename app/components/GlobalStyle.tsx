"use client";

import { createGlobalStyle } from "styled-components";

const GlobalStyleComponent = createGlobalStyle`
  /* Reset CSS */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  html, body {
    height: 100%;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    background-color: #f0f2f5;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  input, button, textarea, select {
    font: inherit;
  }

  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }

  #root, #__next {
    isolation: isolate;
  }

  /* Focus styles */
  :focus-visible {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  /* Custom scrollbar for webkit browsers */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

export default function GlobalStyle() {
  return <GlobalStyleComponent />;
}
