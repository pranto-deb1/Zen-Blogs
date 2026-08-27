"use client";

import { ThemeProvider as NextThemeProvider} from 'next-themes'
import React from 'react'

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      defaultTheme="dark"
      enableSystem={false}
    >
      {children}
    </NextThemeProvider>
  )
}

export default ThemeProvider;