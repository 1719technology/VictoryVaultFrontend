"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Flag, DollarSign, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HamburgerMenu } from "./hamburger-menu"

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const navigationLinks = [
    { href: "/candidates", label: "Candidates", description: "Support conservative leaders" },
    { href: "/causes", label: "Causes", description: "Back important issues" },
    { href: "/about", label: "About", description: "Learn about our mission" },
    { href: "/signin", label: "Sign In", description: "Access your account" },
  ]

  const quickLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/contact", label: "Contact Support" },
    { href: "/faq", label: "Help Center" },
  ]

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-red-100 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              
              <Link href="/" className="text-2xl font-bold text-navy-900">
                VictoryVault
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    isActive(link.href) ? "text-red-600" : "text-gray-700 hover:text-red-600"
                  } font-medium transition-colors`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/donate">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Donate Now
                </Button>
              </Link>
            </div>

            {/* Hamburger Menu Button */}
            <HamburgerMenu isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 md:hidden ${
          isMobileMenuOpen ? "opacity-50 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-blue-50">
            <div className="flex items-center space-x-3">
              {/*<div className="bg-red-600 p-2 rounded-lg">
                <Flag className="h-5 w-5 text-white" />
              </div>*/}
              <div>
                <img src="https://www.jasonbyer.com/WinRed_logo.webp" width="100" height="auto" />
                <p className="text-sm text-gray-600">Conservative Platform</p>
              </div>
            </div>
            <HamburgerMenu isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(false)} />
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Primary Navigation */}
            <div className="px-6 py-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Navigation</h3>
              <div className="space-y-2">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? "bg-red-50 text-red-600 border-l-4 border-red-600 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div>
                      <div className="font-semibold">{link.label}</div>
                      <div className="text-sm text-gray-500 mt-1">{link.description}</div>
                    </div>
                    <ChevronRight
                      className={`h-5 w-5 transition-transform duration-200 ${
                        isActive(link.href) ? "text-red-600" : "text-gray-400 group-hover:text-red-600"
                      }`}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Donate Section */}
            <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-red-100 mx-6 rounded-xl">
              <h3 className="text-sm font-semibold text-red-900 mb-3">Make an Impact</h3>
              <Link href="/donate" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3 shadow-lg">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Donate Now
                </Button>
              </Link>
              <p className="text-xs text-red-700 mt-2 text-center">Support conservative candidates and causes</p>
            </div>

            {/* Quick Links */}
            <div className="px-6 py-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Quick Links</h3>
              <div className="space-y-1">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center px-4 py-3 text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ChevronRight className="h-4 w-4 mr-2 text-gray-400" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="px-6 py-4 bg-blue-50 mx-6 rounded-xl">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">Our Impact</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-900">$24.8M</div>
                  <div className="text-xs text-blue-700">Raised</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-900">156K</div>
                  <div className="text-xs text-blue-700">Donors</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Empowering Conservative Leadership</p>
              <div className="flex justify-center space-x-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  aria-label="Follow us on Twitter"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.897.897 1.387 2.048 1.387 3.345s-.49 2.448-1.297 3.323c-.897.897-2.048 1.387-3.345 1.387zm7.718 0c-1.297 0-2.448-.49-3.323-1.297-.897-.897-1.387-2.048-1.387-3.345s.49-2.448 1.297-3.323c.897-.897 2.048-1.387 3.345-1.387s2.448.49 3.323 1.297c.897.897 1.387 2.048 1.387 3.345s-.49 2.448-1.297 3.323c-.897.897-2.048 1.387-3.345 1.387z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
