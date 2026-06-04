"use client"

import { createContext, useContext, useLayoutEffect, useState, useCallback } from "react"

type AdminTheme = "dark" | "light"

interface AdminThemeContextValue {
  theme: AdminTheme
  toggleAdminTheme: () => void
}

const AdminThemeContext = createContext<AdminThemeContextValue>({
  theme: "dark",
  toggleAdminTheme: () => {},
})

export function useAdminTheme() {
  return useContext(AdminThemeContext)
}

const STORAGE_KEY = "admin-theme"

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>("dark")

  useLayoutEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "light" || stored === "dark") {
      setTheme(stored)
    }
  }, [])

  const toggleAdminTheme = useCallback(() => {
    setTheme((prev) => {
      const next: AdminTheme = prev === "dark" ? "light" : "dark"
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  return (
    <AdminThemeContext.Provider value={{ theme, toggleAdminTheme }}>
      <div
        className={`${theme === "dark" ? "admin-dark" : "admin-light"} min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  )
}
