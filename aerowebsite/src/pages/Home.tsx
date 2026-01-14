import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import logodrone from '../img/logodrone.png'
import gliderIcon from '../img/Glider.png'
import rcIcon from '../img/rc.png'

// Stars background component with moving particles
function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Star properties
    interface Star {
      x: number
      y: number
      size: number
      speed: number
      opacity: number
      twinkleSpeed: number
    }

    const stars: Star[] = []
    const numStars = 200

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.015 + 0.003,
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        // Twinkle effect
        star.opacity += star.twinkleSpeed
        if (star.opacity >= 1 || star.opacity <= 0.1) {
          star.twinkleSpeed = -star.twinkleSpeed
        }

        // Move star slowly upward and slightly to the side
        star.y -= star.speed
        star.x += star.speed * 0.2
        
        // Reset star when it goes off screen
        if (star.y < 0) {
          star.y = canvas.height
          star.x = Math.random() * canvas.width
        }
        if (star.x > canvas.width) {
          star.x = 0
        }

        // Draw star with glow effect
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.9})`
        ctx.fill()
        
        // Add subtle glow to larger stars
        if (star.size > 1) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.1})`
          ctx.fill()
        }
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}

// Floating Navigation Pill Component
function FloatingNav() {
  const location = useLocation()
  
  const links = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/news', label: 'News' },
    { path: '/contact', label: 'Contact Us' },
  ]

  return (
    <nav className="bg-[#2a2628]/80 backdrop-blur-xl border border-white/10 rounded-full px-3 py-2 shadow-2xl">
      <ul className="flex items-center gap-1">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`relative px-5 sm:px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 block ${
                location.pathname === link.path
                  ? 'text-orange-400'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-orange-500 rounded-full" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Dark background */}
        <div className="absolute inset-0 bg-[#1a1718]" />
        
        {/* Animated stars background */}
        <StarsBackground />
        
        {/* Orange glow arc at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[500px] pointer-events-none overflow-hidden">
          {/* Main arc glow */}
          <div className="absolute bottom-[-350px] left-1/2 -translate-x-1/2 w-[200%] h-[500px]">
            <div 
              className="absolute inset-0 rounded-[50%] bg-gradient-radial from-orange-500/15 via-orange-600/8 to-transparent"
            />
          </div>
          {/* Arc line */}
          <svg className="absolute bottom-0 left-0 w-full h-[300px]" viewBox="0 0 1440 300" preserveAspectRatio="none">
            <defs>
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="20%" stopColor="#FF8C00" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#FF6A00" stopOpacity="0.6" />
                <stop offset="80%" stopColor="#FF8C00" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M-100,300 Q720,-50 1540,300"
              stroke="url(#arcGradient)"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          {/* Glow effect under arc */}
          <div 
            className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-[80%] h-[200px] blur-3xl bg-gradient-radial from-orange-600/20 to-transparent"
          />
        </div>
        
        {/* Subtle vignette overlay */}
        <div className="absolute inset-0 pointer-events-none bg-vignette" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-[-80px]">
          <div className="animate-fade-in">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-heading leading-tight mb-2 text-white/90">
              Welcome to
            </h1>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading leading-tight mb-8">
              <span className="text-white">ENET </span>
              <span className="text-orange-500">AERO CUP 5.0</span>
            </h2>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              National event organized by
            </p>
            <p className="text-base sm:text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Club Aéromodélisime ENET'Com
            </p>
          </div>
        </div>

        {/* Floating Navigation Pill */}
        <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20">
          <FloatingNav />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#1a1718]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
              What Makes Us <span className="text-orange-400">Special</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Join the most exciting aeromodeling competition in Tunisia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-orange-500/50 transition-colors group">
              <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                <img src={logodrone} alt="Drone" className="w-10 h-10 object-contain" />
              </div>
              <h3 className="text-xl font-bold mb-3">Drone Racing</h3>
              <p className="text-white/60 leading-relaxed">
                Experience the thrill of high-speed drone racing through challenging obstacle courses.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-orange-500/50 transition-colors group">
              <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                <img src={gliderIcon} alt="Glider" className="w-10 h-10 object-contain" />
              </div>
              <h3 className="text-xl font-bold mb-3">Glider Competition</h3>
              <p className="text-white/60 leading-relaxed">
                Design and fly your own gliders in precision landing and duration challenges.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-orange-500/50 transition-colors group">
              <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                <img src={rcIcon} alt="RC Plane" className="w-10 h-10 object-contain" />
              </div>
              <h3 className="text-xl font-bold mb-3">RC Planes</h3>
              <p className="text-white/60 leading-relaxed">
                Showcase your engineering skills with custom-built RC aircraft in aerial maneuvers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600/20 via-orange-500/10 to-orange-600/20 border-y border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-orange-400 mb-2">5</div>
              <div className="text-white/60">Editions</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-orange-400 mb-2">1500+</div>
              <div className="text-white/60">Participants</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-orange-400 mb-2">25+</div>
              <div className="text-white/60">Universities</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-orange-400 mb-2">50+</div>
              <div className="text-white/60">Projects</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1a1718]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-6">
            Ready to Take <span className="text-orange-400">Flight</span>?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Join engineering students from across Tunisia in the ultimate aeromodeling competition.
            Register now and be part of ENET AERO CUP 5.0!
          </p>
          <Link
            to="/contact"
            className="btn-gradient inline-block text-dark px-10 py-4 rounded-xl font-bold text-lg shadow-2xl shadow-orange-500/25 transition-all hover:shadow-orange-500/40"
          >
            Register Your Team
          </Link>
        </div>
      </section>
    </div>
  )
}
