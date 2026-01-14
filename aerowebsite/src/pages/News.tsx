import { useState } from 'react'
import enetreveal from '../img/enetreveal.jpg'
import ambassadors from '../img/ambassadors.jfif'

interface NewsItem {
  id: number
  title: string
  date: string
  category: 'announcement' | 'technicalspecifications' | 'registration'
  excerpt: string
  image: string
  link?: string
}

export default function News() {
  const [filter, setFilter] = useState<'all' | 'announcement' | 'technicalspecifications' | 'registration'>('all')

  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'THEME REVEAL 🎲✈️',
      date: 'January 14, 2026',
      category: 'announcement',
      excerpt: 'A world of strategy, smart decisions, risk, and rewards. Just like Monopoly, every move counts, every choice matters, and one decision can change the entire game.',
      image: enetreveal,
      link: 'https://www.facebook.com/share/p/1BuDeBmbhy/'
    },
    {
      id: 2,
      title: 'Call For Ambassadors',
      date: 'January 14, 2026',
      category: 'registration',
      excerpt: 'Do you want to be part of an extraordinary adventure and contribute to the success of ENET AERO CUP 5.0? 🚀✈️ Join our team of ambassadors and help us make this unique event shine!',
      image: ambassadors,
      link: 'https://docs.google.com/forms/d/e/1FAIpQLSfxKNWrZ-REV7dnan3nPFR8jCtdHPAJ42x1-_dR7-RSO8p2pg/viewform?fbclid=IwY2xjawPUz19leHRuA2FlbQIxMQBzcnRjBmFwcF9pZAwzNTA2ODU1MzE3MjgAAR5w9z3VIznouSkkoH8wEqv0So1PS6OpOLZ7Hgt8UFrlI-VT5D-wVSSWlIxeWQ_aem_JbGth97oDNKGporb09LdYQ&pli=1'
    },
  ]

  const filteredNews = filter === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === filter)

  const categoryColors = {
    announcement: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    technicalspecifications: 'bg-green-500/20 text-green-400 border-green-500/30',
    registration: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-36 pb-20 bg-gradient-to-b from-orange-600/10 to-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-6">
              Latest <span className="text-orange-400">News</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Stay tuned for all the latest announcements, official updates, and important information regarding ENET AERO CUP. This section will serve as the main communication channel for participants, teams, and partners, providing timely news about competition schedules, technical updates, registration details, and event highlights. Make sure to check this space regularly to stay informed and not miss any key updates related to the organization and progress of ENET AERO CUP.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & News Grid */}
      <section className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-orange-500 text-dark'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('announcement')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'announcement'
                  ? 'bg-orange-500 text-dark'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              Announcements
            </button>
            <button
              onClick={() => setFilter('technicalspecifications')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'technicalspecifications'
                  ? 'bg-orange-500 text-dark'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setFilter('registration')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'registration'
                  ? 'bg-orange-500 text-dark'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              Registration
            </button>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <article
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all group"
              >
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center overflow-hidden">
                  {typeof item.image === 'string' && item.image.includes('/') ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl">{item.image}</span>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[item.category]}`}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                    <span className="text-white/40 text-sm">{item.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {item.excerpt}
                  </p>
                  <button 
                    onClick={() => item.link && window.open(item.link, '_blank')}
                    className="mt-4 text-orange-400 text-sm font-medium hover:text-orange-300 transition-colors"
                  >
                    Read more →
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {filteredNews.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-xl font-bold mb-2">No news found</h3>
              <p className="text-white/60">Try selecting a different category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Highlight */}
      <section className="py-16 bg-gradient-to-r from-orange-600/20 via-orange-500/10 to-orange-600/20 border-y border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-2">
                🗓️ Mark Your Calendar
              </h2>
              <p className="text-white/70">
                ENET AERO CUP 5.0 main event: <span className="text-orange-400 font-semibold">February 15, 2026</span>
              </p>
            </div>
            <a
              href="/contact"
              className="btn-gradient text-dark px-8 py-4 rounded-xl font-bold shadow-lg transition-transform whitespace-nowrap"
            >
              Register Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
