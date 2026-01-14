import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import enetcomlogo from '../img/enetcomlogo.png'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'News', path: '/news' },
  { name: 'Contact Us', path: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28 sm:h-32">
          {/* Logos */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="ENET AERO CUP" 
                className="h-28 sm:h-32 w-auto"
              />
            </Link>
            <div className="hidden sm:block h-12 w-px bg-white/20"></div>
            <img 
              src={enetcomlogo} 
              alt="ENET'Com" 
              className="hidden sm:block h-12 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-orange-400 ${
                  location.pathname === link.path
                    ? 'text-orange-400'
                    : 'text-white/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {/* Search icon */}
            <button className="text-white/60 hover:text-white transition-colors" type="button" title="Search" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 bg-[#1a1718]/95 backdrop-blur-lg rounded-2xl mt-2 border border-white/10">
            <div className="flex flex-col gap-2 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-medium transition-colors py-2 px-3 rounded-lg hover:bg-white/5 ${
                    location.pathname === link.path
                      ? 'text-orange-400 bg-orange-500/10'
                      : 'text-white/80'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
