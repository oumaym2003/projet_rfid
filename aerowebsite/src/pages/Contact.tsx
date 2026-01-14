import { useState, FormEvent } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Form will be handled by Netlify Forms
    // For now, show success message
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">✈️</div>
          <h2 className="text-3xl font-bold font-heading mb-4">
            Message <span className="text-orange-400">Sent!</span>
          </h2>
          <p className="text-white/70 mb-8">
            Thank you for reaching out! We'll get back to you as soon as possible.
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setFormData({ name: '', email: '', university: '', subject: '', message: '' })
            }}
            className="btn-gradient text-dark px-6 py-3 rounded-lg font-semibold"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#1a1718]">
      {/* ANIMATED BACKGROUND */}
      <div className="fixed inset-0 z-0">
        {/* Moving gradient orbs */}
        <div className="absolute w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl -top-20 -left-20 animate-float1"></div>
        <div className="absolute w-[400px] h-[400px] bg-orange-600/8 rounded-full blur-3xl bottom-10 right-10 animate-float2"></div>

        {/* Subtle floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-orange-400/40 rounded-full"
          />
        ))}
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
      {/* Hero Section */}
      <section className="pt-36 pb-20 bg-gradient-to-b from-orange-600/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-6">
              Contact <span className="text-orange-400">Us</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Have questions about ENET AERO CUP 5.0? Interested in registering your team, becoming a sponsor, or learning more about the competition? We'd love to hear from you.
            </p>
            <p className="text-lg text-white/60 leading-relaxed mt-4">
              This section is dedicated to answering all your inquiries regarding participation, technical specifications, partnerships, sponsorship opportunities, and event logistics. Whether you are a student, a team leader, an institution, or a company, feel free to reach out to us. Our organizing team will be happy to assist you and provide all the information you need to be part of ENET AERO CUP 5.0.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              
              {/* Netlify Forms: add data-netlify="true" and name attribute for production */}
              <form
                onSubmit={handleSubmit}
                name="contact"
                method="POST"
                data-netlify="true"
                className="space-y-6"
              >
                {/* Hidden field for Netlify */}
                <input type="hidden" name="form-name" value="contact" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="university" className="block text-sm font-medium mb-2">
                    University / Institution
                  </label>
                  <input
                    type="text"
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="e.g., ENETCOM, ENIS, INSAT..."
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="" className="bg-dark">Select a subject</option>
                    <option value="registration" className="bg-dark">Team Registration</option>
                    <option value="sponsorship" className="bg-dark">Sponsorship Inquiry</option>
                    <option value="partnership" className="bg-dark">Partnership Proposal</option>
                    <option value="media" className="bg-dark">Media / Press</option>
                    <option value="general" className="bg-dark">General Question</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-gradient text-dark py-4 rounded-lg font-bold text-lg shadow-lg transition-transform"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Info Cards */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:enet.aero.cup@gmail.com" className="text-orange-400 hover:text-orange-300 transition-colors">
                      enet.aero.cup@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-white/60">
                      ENETCOM - École Nationale d'Électronique<br />
                      et des Télécommunications de Sfax<br />
                      Route de Tunis, Sfax, Tunisia
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Event Date</h3>
                    <p className="text-white/60">
                      ENET AERO CUP 5.0<br />
                      <span className="text-orange-400 font-semibold">February 15, 2026</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.facebook.com/ENETAeroCup/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors group"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5 text-white group-hover:text-dark" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/enet.aerocup/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors group"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5 text-white group-hover:text-dark" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/74510913/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors group"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5 text-white group-hover:text-dark" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-transparent">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-heading mb-8 text-center">
            Frequently Asked <span className="text-orange-400">Questions</span>
          </h2>
          <div className="space-y-4">
            <details className="bg-white/5 border border-white/10 rounded-xl group">
              <summary className="p-6 cursor-pointer font-semibold hover:text-orange-400 transition-colors list-none flex justify-between items-center">
                How can I register my team?
                <span className="text-orange-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-white/70">
                Fill out the contact form above with "Team Registration" as the subject, or email us directly at enet.aero.cup@gmail.com. Include your team name, members, university, and the competition category you're interested in.
              </div>
            </details>
            <details className="bg-white/5 border border-white/10 rounded-xl group">
              <summary className="p-6 cursor-pointer font-semibold hover:text-orange-400 transition-colors list-none flex justify-between items-center">
                What are the competition categories?
                <span className="text-orange-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-white/70">
                We have three main categories: Drone Racing (FPV racing through obstacle courses), Glider Competition (precision landing and duration), and RC Planes (aerial maneuvers and design evaluation).
              </div>
            </details>
            <details className="bg-white/5 border border-white/10 rounded-xl group">
              <summary className="p-6 cursor-pointer font-semibold hover:text-orange-400 transition-colors list-none flex justify-between items-center">
                Is there a registration fee?
                <span className="text-orange-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-white/70">
                Registration fees vary by category. Contact us for the current pricing and any available discounts for early registration or multiple team entries.
              </div>
            </details>
            <details className="bg-white/5 border border-white/10 rounded-xl group">
              <summary className="p-6 cursor-pointer font-semibold hover:text-orange-400 transition-colors list-none flex justify-between items-center">
                Can international teams participate?
                <span className="text-orange-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-white/70">
                Yes! While ENET AERO CUP is primarily a national event, we welcome international participants. Contact us for special arrangements and requirements.
              </div>
            </details>
          </div>
        </div>
      </section>
      </div>

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(20px, 30px); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
