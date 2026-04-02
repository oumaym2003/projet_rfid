import React from 'react'
import Chat from './components/Chat'
import Map from './components/Map'
import heroRobot from './assets/chatbot.png'

export default function App(){
  return (
    <div className="app-scene playful">
      <header className="hero">
        <div className="hero-left">
          <h1 className="hero-title">Enetcom Copilot</h1>
          <p className="hero-sub">Assistant vocal pour guidage d'atelier — rapide, simple et amical.</p>
          <div className="hero-actions">
            <button className="btn primary">Démarrer la session</button>
            <button className="btn">Aide rapide</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="robot-wrap">
            <img src={heroRobot} alt="robot" />
          </div>
        </div>

        <div className="hero-decor hero-decor-1" />
        <div className="hero-decor hero-decor-2" />
      </header>

      <main className="workspace layout">
        <section className="panel map-panel">
          <div className="panel-head">
            <div>
              <strong>Plan de l'atelier</strong>
              <div className="muted small">Carte interactive des zones RFID</div>
            </div>
            <div className="muted small">Carte 5x5</div>
          </div>

          <div className="panel-body">
            <Map height={620} width={620} />
          </div>
        </section>

        <section className="panel chat-panel">
          <div className="panel-head">
            <div>
              <strong>Centre de dialogue</strong>
              <div className="muted small">Assistant vocal · RFID</div>
            </div>
            <div className="muted small">ENETCOM</div>
          </div>

          <div className="chat-root panel-body">
            <Chat />
          </div>
        </section>
      </main>
    </div>
  )
}
