import { useState, useEffect } from 'react'

// Import all images/videos from src/img so Vite bundles them during build
const _assets: Record<string, any> = (import.meta as any).globEager('../img/*.{jpg,jpeg,png,jfif,svg,webp,mp4,HEIC}')
const assets: Record<string, string> = Object.fromEntries(
  Object.entries(_assets).map(([k, m]) => [k.replace('../img/', ''), (m && (m.default || m))])
)

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const memories = [
    { type: 'image', src: assets['maalej.jpg'], caption: 'Unforgettable Moments' },
    { type: 'image', src: assets['drone.jpg'], caption: 'Innovation in Flight' },
    { type: 'image', src: assets['4dition.jpg'], caption: 'ENET AERO CUP 4.0' },
    { type: 'image', src: assets['enetaero4.jpg'], caption: 'Team Spirit' },
    { type: 'image', src: assets['planneur.jpg'], caption: 'Glider Excellence' },
    { type: 'image', src: assets['aero4.jpg'], caption: 'Aero Passion' },
    { type: 'image', src: assets['kidsjpg.jpg'], caption: 'Inspiring Youth' },
    { type: 'image', src: assets['poly.jpg'], caption: 'Engineering Skills' },
    { type: 'image', src: assets['amjpg.jpg'], caption: 'Cherished Memories' },
    { type: 'image', src: assets['happ.jpg'], caption: 'Happy Moments' },
    { type: 'image', src: assets['prix.jpg'], caption: 'Winning Together' },
    { type: 'image', src: assets['iset.jpg'], caption: 'ISET Partnership' },
    { type: 'image', src: assets['omar.jpg'], caption: 'Team Moments' },
    { type: 'image', src: assets['enima.jpg'], caption: 'Event Highlights' },
    { type: 'image', src: assets['av.jpg'], caption: 'Competition Spirit' },
    { type: 'image', src: assets['douma.jpg'], caption: 'Celebration' },
    { type: 'image', src: assets['48iss.jpg'], caption: 'Partnership Success' },
    { type: 'image', src: assets['fjpg.jpg'], caption: 'Final Moments' },
    { type: 'image', src: assets['adjpg.jpg'], caption: 'Proud Achievement' },
    { type: 'image', src: assets['jury.jpg'], caption: 'Jury Moments' },
  ]

  const videos = [
    assets['FDownloader.Net_AQO99qoBAgVuDKj2QWU86_Ti9Wc20-bzu4MV2_VP-C8EIVDIObZl0CP93GnuKvlueUYpWAfE6hlIlSE7sOH7tPIkvQpG1dEcNvUAE3RtWkIbJQ_720p_(HD).mp4'],
  ]

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % memories.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, memories.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % memories.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + memories.length) % memories.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const teamMembers = [
    { name: 'Takwa Chebbi', role: 'President', image: assets['takwa.jpg'], email: 'president@enetaerocup.tn' },
    { name: 'Ahmed Hammemi', role: 'Vice President', image: assets['hamemmi.jpg'], email: 'vicepresident@enetaerocup.tn' },
    { name: 'Rahma Smeoui', role: 'Secretary', image: assets['rahma smeoui.jpg'], email: 'secretary@enetaerocup.tn' },
    { name: 'Ahmed Abida', role: 'Events Manager', image: assets['bida.jpg'], email: 'events@enetaerocup.tn' },
    { name: 'Haitham Cherif & Roua Kammoun', role: 'Media Lead', image: assets['haithem.jpg'], email: 'media@enetaerocup.tn' },
    { name: 'Oussema Bensalah', role: 'Sponsorship Lead', image: assets['oussema.jpg'], email: 'sponsorship@enetaerocup.tn' },
    { name: 'Project Manager', role: 'Project Manager', image: assets['bourmech.jpg'], email: 'project@enetaerocup.tn' },
    { name: 'Technical Manager', role: 'Technical Manager', image: assets['karim.jpg'], email: 'technical@enetaerocup.tn' },
    { name: 'Tresorier', role: 'Tresorier', image: assets['kaabi.jpg'], email: 'finance@enetaerocup.tn' },
    { name: 'Human Ressources Manager', role: 'Human Ressources Manager', image: assets['nesrine.jpg'], email: 'hr@enetaerocup.tn' },
  ]

  const achievements = [
    { year: '2022', title: 'First Edition Launch', description: 'Pioneers of the First Edition in South Tunisia. Successfully organized the inaugural ENET AERO CUP with 100+ participants.', image: assets['firstedition.jpg'] },
    { year: '2023', title: 'ENET AERO CUP 2.0', description: 'Our second edition, inspired by the Harry Potter universe, brought together 300+ participants from across Tunisia, turning the event into a true national gathering of innovation and passion.', image: assets['155.jpg'] },
    { year: '2024', title: 'ENET AERO CUP 3.0', description: 'With an Attack on Titan-inspired concept, the third edition delivered an unforgettable theme and an outstanding design experience bringing together more than 250 participants from across Tunisia.', image: assets['thirdedition.jpg'] },
    { year: '2025', title: 'ENET AERO CUP 4.0', description: 'The fourth edition, themed Twilight, stood out for its flawless organization and an outstanding drone show that left a lasting impression.', image: assets['4dition.jpg'] },
  ]

  return (
    <div className="relative min-h-screen bg-[#1a1718]">
      {/* SIMPLE ANIMATED BACKGROUND */}
      <div className="fixed inset-0 z-0">
        
        {/* 2 Moving gradient orbs - subtle and elegant */}
        <div className="absolute w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl -top-20 -left-20 animate-float1"></div>
        <div className="absolute w-[400px] h-[400px] bg-orange-600/8 rounded-full blur-3xl bottom-10 right-10 animate-float2"></div>

        {/* Subtle floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-orange-400/40 rounded-full"
          ></div>
        ))}
      </div>

      {/* SIMPLE ANIMATIONS */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(100px, 60px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-80px, -50px); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>

      {/* Content with higher z-index */}
      <div className="relative z-10">
      {/* Hero Section with Memories Carousel */}
      <section className="pt-36 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Title and Description */}
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-6">
              About <span className="text-orange-400">Us</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              ENET AERO CUP is a national aeromodelling competition and the first of its kind organized in southern Tunisia. Since its launch, the event has brought together participants from all over the country, promoting innovation, teamwork, and aeronautical engineering. This year marks the 5th edition of ENET AERO CUP, reflecting its growth, credibility, and continued success. The competition is proudly organized by Club Aéromodélisme NK.
            </p>
          </div>

          {/* Memories Carousel */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-heading mb-6 text-center">
              ✨ Cherish Our <span className="text-orange-400">Memories</span>
            </h2>
            
            {/* Main Carousel */}
            <div 
              className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-white/10"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {/* Main Image Display */}
              <div className="relative h-[500px] md:h-[650px] lg:h-[700px] overflow-hidden">
                {memories.map((memory, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentSlide 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-105'
                    }`}
                  >
                    <img
                      src={memory.src}
                      alt={memory.caption}
                      className="w-full h-full object-contain bg-black/40"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <p className="text-2xl md:text-3xl font-bold text-white mb-2">{memory.caption}</p>
                      <p className="text-orange-400">Memory {index + 1} of {memories.length}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-orange-500 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-orange-500 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Thumbnail Strip - Swipeable */}
            <div className="mt-6 relative">
              <div className="flex gap-3 overflow-x-auto pb-4 px-2 scrollbar-hide">
                {memories.map((memory, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      index === currentSlide
                        ? 'border-orange-500 scale-110 shadow-lg shadow-orange-500/30'
                        : 'border-white/20 hover:border-orange-400/50 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={memory.src}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-white/50 text-sm mt-2">👆 Swipe or click to browse memories</p>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {memories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 bg-orange-500'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Featured Video + Mission Section - Side by Side */}
          <div className="mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left: Video Reel */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-center lg:text-left">
                  🎬 Featured <span className="text-orange-400">Video</span>
                </h3>
                <div className="flex justify-center lg:justify-start">
                  <div className="relative rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl shadow-orange-500/10 max-w-sm w-full">
                    <div className="relative aspect-[9/16]">
                      <video
                        key={0}
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        className="w-full h-full object-contain bg-black"
                      >
                        <source src={videos[0]} type="video/mp4" />
                      </video>
                      
                      {/* Video Overlay */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-orange-500/30">
                          <p className="text-orange-400 text-xs font-semibold">▶ Now Playing</p>
                        </div>
                        <div className="bg-orange-500 px-2 py-1 rounded-full">
                          <p className="text-white text-xs font-bold">HD</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Video Info */}
                    <div className="bg-gradient-to-r from-black via-gray-900 to-black p-3 text-center">
                      <p className="text-white font-semibold text-sm mb-1">ENET AERO CUP Highlights</p>
                      <p className="text-white/50 text-xs">🔊 Unmute for sound</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Mission Section */}
              <div>
                <h2 className="text-3xl font-bold font-heading mb-6">
                  Our <span className="text-orange-400">Mission</span>
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  Our club is built around three main axes:
                </p>
                <ul className="text-white/70 leading-relaxed mb-6 list-disc list-inside space-y-1">
                  <li>Gliders (Sailplanes)</li>
                  <li>PolyClub Aircraft</li>
                  <li>Drones</li>
                </ul>
                <p className="text-white/70 leading-relaxed mb-6">
                  Through these axes, members develop both technical and practical skills in aerodynamics, electronics, embedded systems, design, and teamwork.
                </p>
                <p className="text-white/70 leading-relaxed mb-6">
                  Aero ENET'Com is also known for its competitions, workshops, training sessions, and national events, encouraging creativity, collaboration, and excellence.
                  Beyond technical skills, the club promotes leadership, responsibility, and innovation, preparing its members for academic, professional, and entrepreneurial challenges.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium">
                    Aeromodeling
                  </span>
                  <span className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium">
                    Drone Technology
                  </span>
                  <span className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium">
                    RC Aircraft
                  </span>
                  <span className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium">
                    Gliders
                  </span>
                </div>

                {/* Stats - Under Mission */}
                <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400 mb-1">2014</div>
                      <div className="text-white/60 text-xs">Founded</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400 mb-1">+80</div>
                      <div className="text-white/60 text-xs">Active Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400 mb-1">+20</div>
                      <div className="text-white/60 text-xs">Projects Built</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Timeline */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold font-heading mb-12 text-center">
            Our <span className="text-orange-400">Journey</span>
          </h2>
          <div className="space-y-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center overflow-hidden">
                  {achievement.image ? (
                    <img 
                      src={achievement.image} 
                      alt={achievement.year} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-dark font-bold text-lg">{achievement.year}</span>
                  )}
                </div>
                <div className="flex-grow bg-white/5 border border-white/10 rounded-xl p-6 hover:border-orange-500/30 transition-colors">
                  <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                  <p className="text-white/60">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold font-heading mb-4 text-center">
            Meet the <span className="text-orange-400">Team</span>
          </h2>
          <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
            The dedicated individuals behind ENET AERO CUP 4.0
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-orange-500/30 transition-colors group"
              >
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center text-3xl group-hover:bg-orange-500/30 transition-colors overflow-hidden">
                    {member.image.includes('/') ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.image
                    )}
                  </div>
                  {/* Email icon overlay on hover */}
                  <a 
                    href={`mailto:${member.email}`}
                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    title={`Contacter ${member.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
                <h3 className="font-semibold text-sm mb-1">{member.name}</h3>
                <p className="text-orange-400 text-xs">{member.role}</p>
              </div>
            ))}
          </div>
          {/* Spacer for aesthetic offset on the second row on large screens */}
          <div className="hidden lg:block"></div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-600/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold font-heading mb-4 text-center">
            They <span className="text-orange-400">Trusted</span> Us
          </h2>
          <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
            Our partners and sponsors who have supported ENET AERO CUP over the years
          </p>
          <div className="flex justify-center">
            <div className="rounded-2xl overflow-hidden max-w-4xl">
              <img 
                src={assets['Design sans titre (1).png']} 
                alt="Nos partenaires et sponsors" 
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>


      </div>
    </div>
  )
}
