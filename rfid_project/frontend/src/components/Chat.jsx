import React, { useState, useRef } from 'react'
import chatbot from '../assets/chatbot.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

export default function Chat(){
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Bienvenue — appuyez sur le micro et dites l'article ou choisissez une destination." }
  ])
  const [recording, setRecording] = useState(false)
  const [dest, setDest] = useState('')
  const [startPoint, setStartPoint] = useState('')
  const [safetyMode, setSafetyMode] = useState(true)
  const [guidanceStyle, setGuidanceStyle] = useState(() => {
    try {
      const stored = localStorage.getItem('guidanceStyle')
      if (stored === 'auto' || stored === 'short' || stored === 'detailed') return stored
    } catch (e) { /* ignore */ }
    return 'auto'
  })
  const [guideStatus, setGuideStatus] = useState('En attente')
  const [showJumpToBottom, setShowJumpToBottom] = useState(false)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])
  const chatWindowRef = useRef(null)
  const shouldAutoScrollRef = useRef(true)

  // small transient toast when guidance starts
  const [toast, setToast] = useState(null)
  const showToast = (txt, ms = 3000) => {
    setToast(txt)
    setTimeout(()=> setToast(null), ms)
  }

  // navigation phrase set (default, can be replaced by user JSON)
  const defaultPhrases = {
    forward: ["Avancez d'une case.", "Allez tout droit.", "Poussez en avant."],
    back: ["Reculez d'une case.", "Faites un pas en arrière.", "Reculer, une case."],
    left: ["Tournez à gauche.", "Aller à gauche une case.", "Gauche, maintenant."],
    right: ["Tournez à droite.", "Aller à droite une case.", "Droite, maintenant."],
    arrived: ["Vous êtes arrivé.", "Arrivée — bonne continuation.", "Destination atteinte."]
  }
  const [phrases, setPhrases] = useState(defaultPhrases)
  

  // live transcript (shows what user says); also attempt Web Speech API for interim results
  const [liveTranscript, setLiveTranscript] = useState('')
  const recognitionRef = useRef(null)

  const normalizeFr = (value = '') =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[’']/g, "'")
      .trim()

  const startPoints = {
    entryC: { row: 0, col: 2, label: 'Entrée C' },
    p0: { row: 0, col: 0, label: '(0,0)' },
    p02: { row: 0, col: 2, label: '(0,2)' },
  }

  const destinationLabels = {
    armoireA: 'Armoire A',
    armoireB: 'Armoire B',
    shelfA: 'Armoire A',
    shelfB: 'Armoire B',
    workshop1: 'Atelier 1',
    workshop2: 'Atelier 2',
    workshop3: 'Atelier 3',
  }

  const safetyBlocked = ['pos-1-1', 'pos-1-2', 'pos-1-3', 'pos-2-2', 'pos-3-2']

  React.useEffect(() => {
    try {
      if (window.__mapPost && typeof window.__mapPost.safety === 'function') {
        window.__mapPost.safety(safetyMode, safetyBlocked)
      }
    } catch (e) { /* ignore */ }
  }, [safetyMode])

  React.useEffect(() => {
    try {
      localStorage.setItem('guidanceStyle', guidanceStyle)
    } catch (e) { /* ignore */ }
  }, [guidanceStyle])

  React.useEffect(() => {
    const panel = chatWindowRef.current
    if (!panel || !shouldAutoScrollRef.current) return
    panel.scrollTop = panel.scrollHeight
    setShowJumpToBottom(false)
  }, [messages])

  React.useEffect(() => {
    const panel = chatWindowRef.current
    if (!panel) return
    if (!shouldAutoScrollRef.current) {
      setShowJumpToBottom(true)
    }
  }, [messages.length])

  const processTranscription = (raw) => {
    const t = raw.trim().toLowerCase()
    const tNorm = normalizeFr(raw)
    setMessages(m => [...m, { from:'bot', text: `Transcription reçue: ${raw}` }])

    const destMap = {
      'shelf a': 'shelfA', 'shelfa': 'shelfA',
      'shelf b': 'shelfB',
      'armoire a': 'shelfA', 'armoirea': 'shelfA',
      'armoire b': 'shelfB', 'armoireb': 'shelfB',
      'workshop 1': 'workshop1', 'workshop1': 'workshop1', 'atelier 1': 'workshop1',
      'workshop 2': 'workshop2', 'workshop2': 'workshop2', 'atelier 2': 'workshop2',
      'workshop 3': 'workshop3', 'workshop3': 'workshop3', 'atelier 3': 'workshop3',
      'atelier1': 'workshop1', 'atelier2': 'workshop2', 'atelier3': 'workshop3'
    }

    const startMap = {
      "entree c": 'entryC', "entree c,": 'entryC', "c": 'entryC',
      '(0,0)': 'p0', '0,0': 'p0', '(0, 0)': 'p0',
      '(0,2)': 'p02', '0,2': 'p02', '(0, 2)': 'p02'
    }

    const pattern = /je\s+suis\s+a\s+([^,]+),?\s*je\s+veux\s+aller\s+a\s+(.+)$/i
    const mres = tNorm.match(pattern)
    if(mres){
      const rawStart = mres[1].trim()
      const rawDest = mres[2].trim()
      const normStart = normalizeFr(rawStart.replace(/["']/g, ''))
      const normDest = normalizeFr(rawDest.replace(/["']/g, ''))

      // prefer the UI-selected start if present, otherwise try to parse from voice
      let startKey = null
      if(startPoint){ startKey = startPoint }
      else {
        if(startMap[normStart]) startKey = startMap[normStart]
        else if(/0\s*,\s*0/.test(normStart)) startKey = 'p0'
        else if(/0\s*,\s*2/.test(normStart)) startKey = 'p02'
        else if(/entree\s*c|\bc\b/.test(normStart)) startKey = 'entryC'
      }

      let destKey = null
      for(const k in destMap){ if(normDest.includes(k)) { destKey = destMap[k]; break } }

      if(startKey && destKey){
        const voiceDestToGuide = {
          shelfA: 'armoireA',
          shelfB: 'armoireB',
          workshop1: 'workshop1',
          workshop2: 'workshop2',
          workshop3: 'workshop3',
        }
        const guideDest = voiceDestToGuide[destKey]
        if (!guideDest) {
          setGuideStatus('Destination invalide')
          setMessages(m => [...m, { from:'bot', text:'Destination reconnue mais non disponible pour le guidage.' }])
          return
        }
        setStartPoint(startKey)
        setDest(guideDest)
        setGuideStatus(`Prêt: ${startPoints[startKey]?.label || startKey} -> ${destinationLabels[guideDest] || guideDest}`)
        guideTo(guideDest, startKey)
        return
      }
    }

    let inferredStartKey = startPoint
    if (!inferredStartKey) {
      if (/entree\s*c/.test(tNorm)) inferredStartKey = 'entryC'
      else if (/\b0\s*,\s*0\b/.test(tNorm)) inferredStartKey = 'p0'
      else if (/\b0\s*,\s*2\b/.test(tNorm)) inferredStartKey = 'p02'
      if (inferredStartKey) setStartPoint(inferredStartKey)
    }

    // fallback keyword-only detection
    if(/armoire\s*a|shelf\s*a/.test(tNorm)) guideTo('armoireA', inferredStartKey)
    else if(/armoire\s*b|shelf\s*b/.test(tNorm)) guideTo('armoireB', inferredStartKey)
    else if(/workshop\s*1|atelier\s*1/.test(tNorm)) guideTo('workshop1', inferredStartKey)
    else if(/workshop\s*2|atelier\s*2/.test(tNorm)) guideTo('workshop2', inferredStartKey)
    else if(/workshop\s*3|atelier\s*3/.test(tNorm)) guideTo('workshop3', inferredStartKey)
    else {
      showToast('Phrase non reconnue — utilisez le format "Je suis à X, je veux aller à Y"')
      setGuideStatus('Commande non reconnue')
      setMessages(m => [...m, { from:'bot', text:'Je n\'ai pas compris. Essayez: "Je suis à entrée C, je veux aller à armoire A".' }])
    }
  }

  

  const speakAction = (action) => {
    const list = phrases[action] || defaultPhrases[action] || ['OK']
    const txt = list[Math.floor(Math.random()*list.length)]
    if('speechSynthesis' in window){ const u = new SpeechSynthesisUtterance(txt); u.lang='fr-FR'; speechSynthesis.cancel(); speechSynthesis.speak(u) }
    setMessages(m => [...m, { from:'bot', text: txt }])
    showToast(txt, 1600)
  }

  // handle clicks coming from the map iframe
  React.useEffect(()=>{
    const handler = (ev) => {
      const pos = ev.detail
      if(!pos) return
      const mapPos = {
        'pos-4-0': 'armoireA',
        'pos-2-4': 'armoireB',
        'pos-4-1': 'workshop1',
        'pos-4-2': 'workshop2',
        'pos-4-4': 'workshop3'
      }
      const key = mapPos[pos]
      if(key) guideTo(key)
    }
    window.addEventListener('mapClick', handler)
    return ()=> window.removeEventListener('mapClick', handler)
  }, [])

  const start = async () => {
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRef.current = mr
      chunksRef.current = []
      mr.ondataavailable = e => chunksRef.current.push(e.data)
      mr.onstart = () => setRecording(true)
      // start Web Speech API recognition for live interim transcription if available
      try{
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if(SpeechRecognition){
          const rec = new SpeechRecognition()
          rec.lang = 'fr-FR'
          rec.interimResults = true
          rec.continuous = true
          rec.onresult = (ev) => {
            let interim = ''
            for(let i=ev.resultIndex;i<ev.results.length;i++){
              interim += ev.results[i][0].transcript
            }
            setLiveTranscript(interim)
          }
          rec.onerror = (err) => { /* ignore */ }
          rec.start()
          recognitionRef.current = rec
        }
      }catch(e){ /* ignore */ }
      mr.onstop = async () => {
        setGuideStatus('Traitement vocal en cours')
        setRecording(false);
        // stop speech recognition if active
        try {
          if (recognitionRef.current) {
            recognitionRef.current.onresult = null;
            recognitionRef.current.stop();
            recognitionRef.current = null;
          }
        } catch (e) {}
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const fd = new FormData();
        fd.append("audio", blob, "voice.webm");
        try {
          const resp = await fetch(`${API_BASE_URL}/upload_audio`, {
            method: "POST",
            body: fd,
          });
          let data = {}
          try {
            data = await resp.json();
          } catch {
            throw new Error("Réponse serveur invalide (JSON manquant)")
          }

          if (!resp.ok) {
            const errMsg = data?.error || `Erreur HTTP ${resp.status}`
            setMessages((m) => [...m, { from: "bot", text: `Erreur serveur: ${errMsg}` }])
            showToast("Erreur de transcription", 2200)
            return
          }

          if (data?.error) {
            setMessages((m) => [...m, { from: "bot", text: `Erreur serveur: ${data.error}` }])
            showToast("Erreur de transcription", 2200)
            return
          }

          const serverText = data?.transcription || data?.text || ''
          if (serverText) {
            const raw = serverText.trim();
            setLiveTranscript(raw);
            setMessages((m) => [...m, { from: "bot", text: "Transcription reçue. Cliquez sur Envoyer pour lancer le guidage." }])
          }

          if (data?.found === false) {
            const suggestions = Array.isArray(data?.suggestions) ? data.suggestions.slice(0, 3).join(', ') : ''
            const details = suggestions ? ` Suggestions: ${suggestions}` : ''
            setMessages((m) => [
              ...m,
              { from: "bot", text: `${data?.message || "Aucun article correspondant trouvé."}${details}` },
            ])
            showToast("Aucun article trouvé", 2200)
          } else if (data?.found === true) {
            const trajet = Array.isArray(data?.trajectoire) && data.trajectoire.length ? ` Trajectoire: ${data.trajectoire.join(' -> ')}` : ''
            const armoire = data?.armoire ? `Armoire ${data.armoire}` : "Armoire inconnue"
            const niveau = data?.niveau != null ? `, niveau ${data.niveau}` : ''
            setMessages((m) => [...m, { from: "bot", text: `Article détecté: ${armoire}${niveau}.${trajet}` }])
          }
        } catch (err) {
          setMessages((m) => [
            ...m,
            { from: "bot", text: "Erreur serveur: " + err.message },
          ]);
        }
      };
      mr.start()
    }catch(e){
      setMessages(m => [...m, { from: 'bot', text: 'Impossible d\'accéder au micro: ' + e.message }])
    }
  }

  const stop = () => {
    if(mediaRef.current && mediaRef.current.state !== 'inactive') {
      setGuideStatus('Traitement vocal en cours')
      mediaRef.current.stop()
    }
  }

  const guideTo = (destKey, startKeyOverride = null) => {
    const mapping = {
      'armoireA': {row:4,col:0,pos:"pos-4-0",label:'Armoire A'},
      'armoireB': {row:2,col:4,pos:"pos-2-4",label:'Armoire B'},
      'workshop1': {row:4,col:1,pos:"pos-4-1",label:'Atelier 1'},
      'workshop2': {row:4,col:2,pos:"pos-4-2",label:'Atelier 2'},
      'workshop3': {row:4,col:4,pos:"pos-4-4",label:'Atelier 3'},
    }
    const target = mapping[destKey]
    if(!target) return

    const start = startPoints[startKeyOverride || startPoint]
    if(!start){
      showToast('Sélectionnez un point de départ', 2000)
      setGuideStatus('Départ manquant')
      setMessages(m => [...m, { from:'bot', text: 'Veuillez sélectionner un point de départ.' }])
      return
    }

    // Highlight destination on the map when available.
    try {
      if(window.__mapPost && typeof window.__mapPost.highlight === 'function'){
        window.__mapPost.highlight(target.pos)
      }
    } catch (e) { /* ignore */ }

    const toPos = (r, c) => `pos-${r}-${c}`
    const parsePos = (pos) => {
      const m = /^pos-(\d+)-(\d+)$/.exec(pos)
      if (!m) return null
      return { row: Number(m[1]), col: Number(m[2]) }
    }

    const startPos = toPos(start.row, start.col)
    const targetPos = target.pos

    const findPathBfs = (fromPos, toPosVal, blockedPos) => {
      const q = [fromPos]
      const prev = new Map()
      const seen = new Set([fromPos])

      while (q.length) {
        const cur = q.shift()
        if (cur === toPosVal) break
        const point = parsePos(cur)
        if (!point) continue

        const neighbors = [
          toPos(point.row + 1, point.col),
          toPos(point.row - 1, point.col),
          toPos(point.row, point.col + 1),
          toPos(point.row, point.col - 1),
        ]

        for (const n of neighbors) {
          const np = parsePos(n)
          if (!np) continue
          if (np.row < 0 || np.row > 4 || np.col < 0 || np.col > 4) continue
          if (blockedPos.has(n) && n !== toPosVal) continue
          if (seen.has(n)) continue
          seen.add(n)
          prev.set(n, cur)
          q.push(n)
        }
      }

      if (!seen.has(toPosVal)) return null
      const pathRev = []
      let cur = toPosVal
      while (cur) {
        pathRev.push(cur)
        if (cur === fromPos) break
        cur = prev.get(cur)
      }
      return pathRev.reverse()
    }

    let path
    if (safetyMode) {
      const blocked = new Set(safetyBlocked)
      blocked.delete(startPos)
      blocked.delete(targetPos)
      path = findPathBfs(startPos, targetPos, blocked)
      if (!path) {
        showToast('Aucun trajet sûr disponible', 2200)
        setGuideStatus(`Aucun trajet sûr vers ${target.label}`)
        setMessages(m => [...m, { from:'bot', text: `Mode sécurité actif: aucun trajet disponible vers ${target.label}.` }])
        return
      }
    } else {
      path = [startPos]
      let row = start.row
      let col = start.col
      while (row !== target.row) {
        row += row < target.row ? 1 : -1
        path.push(toPos(row, col))
      }
      while (col !== target.col) {
        col += col < target.col ? 1 : -1
        path.push(toPos(row, col))
      }
    }

    try {
      if(window.__mapPost && typeof window.__mapPost.route === 'function'){
        window.__mapPost.route(path)
      }
    } catch (e) { /* ignore */ }

    const dirName = (a, b) => {
      const pa = parsePos(a)
      const pb = parsePos(b)
      if (!pa || !pb) return 'avancer'
      if (pb.row > pa.row) return 'descendre'
      if (pb.row < pa.row) return 'monter'
      if (pb.col > pa.col) return 'droite'
      if (pb.col < pa.col) return 'gauche'
      return 'avancer'
    }

    const moveList = []
    for (let i = 0; i < path.length - 1; i++) {
      moveList.push(dirName(path[i], path[i + 1]))
    }

    const groupedMoves = []
    for (const move of moveList) {
      const last = groupedMoves[groupedMoves.length - 1]
      if (last && last.dir === move) {
        last.count += 1
      } else {
        groupedMoves.push({ dir: move, count: 1 })
      }
    }

    const humanStep = ({ dir, count }) => {
      const unit = count > 1 ? `de ${count} cases` : "d'une case"
      if (dir === 'descendre') return `descendez ${unit}`
      if (dir === 'monter') return `montez ${unit}`
      if (dir === 'droite') return `allez à droite ${unit}`
      if (dir === 'gauche') return `allez à gauche ${unit}`
      return `avancez ${unit}`
    }

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

    const stepSentence = groupedMoves.length
      ? groupedMoves.map(humanStep).join(', puis ')
      : 'vous êtes déjà sur place'

    const effectiveStyle = guidanceStyle === 'auto'
      ? ((groupedMoves.length >= 3 || safetyMode) ? 'detailed' : 'short')
      : guidanceStyle

    const intro = pick([
      `Très bien, on part de ${start.label} vers ${target.label}.`,
      `Parfait, je vous guide de ${start.label} jusqu'à ${target.label}.`,
      `C'est noté: départ ${start.label}, destination ${target.label}.`
    ])

    const routeModeSentence = safetyMode
      ? pick([
          'Je prends un trajet sécurisé pour éviter les zones à risque.',
          'Je choisis un parcours prudent en évitant les zones sensibles.',
          'On passe par un chemin sûr pour contourner les zones à éviter.'
        ])
      : pick([
          'Je prends le chemin le plus direct.',
          'Je choisis l’itinéraire le plus court.',
          'On part sur le trajet le plus rapide.'
        ])

    const end = pick([
      `Vous êtes arrivé à ${target.label}.`,
      `Voilà, vous êtes devant ${target.label}.`,
      `${target.label} est atteint.`
    ])

    const detailedSteps = groupedMoves.length
      ? groupedMoves.map((g, idx) => `${idx + 1}) ${humanStep(g)}`).join(' ; ')
      : '1) vous êtes déjà sur place'

    const detailedHint = pick([
      'Prenez votre temps et suivez les étapes dans cet ordre.',
      'Avancez calmement, je reste sur ce guidage étape par étape.',
      'Si besoin, validez chaque étape avant de passer à la suivante.'
    ])

    const reply = effectiveStyle === 'detailed'
      ? `${intro} ${routeModeSentence} Voici le guidage détaillé: ${detailedSteps}. ${detailedHint} ${end}`
      : `${intro} ${routeModeSentence} ${stepSentence}. ${end}`
    setGuideStatus(`Guidage en cours: ${start.label} -> ${target.label}`)

    showToast(`Guidage vers ${target.label}`)
    if('speechSynthesis' in window){ const u = new SpeechSynthesisUtterance(reply); u.lang='fr-FR'; speechSynthesis.cancel(); speechSynthesis.speak(u) }
    setMessages(m => [...m, { from:'bot', text: reply }])
  }

  // movement actions (vocal only)
  const moveForward = () => speakAction('forward')
  const moveBack = () => speakAction('back')
  const moveLeft = () => speakAction('left')
  const moveRight = () => speakAction('right')

  const handleMicClick = () => {
    if (recording) {
      stop();
    } else {
      setGuideStatus('Ecoute vocale en cours')
      start();
    }
  };

  const handleChatScroll = () => {
    const panel = chatWindowRef.current
    if (!panel) return
    const distanceToBottom = panel.scrollHeight - panel.scrollTop - panel.clientHeight
    const isNearBottom = distanceToBottom < 36
    shouldAutoScrollRef.current = isNearBottom
    if (isNearBottom) setShowJumpToBottom(false)
  }

  const jumpToBottom = () => {
    const panel = chatWindowRef.current
    if (!panel) return
    panel.scrollTo({ top: panel.scrollHeight, behavior: 'smooth' })
    shouldAutoScrollRef.current = true
    setShowJumpToBottom(false)
  }

  const statusTone = (() => {
    const s = normalizeFr(guideStatus)
    if (s.includes('commande non reconnue') || s.includes('invalide') || s.includes('aucun trajet')) return 'error'
    if (s.includes('manquant')) return 'warn'
    if (s.includes('pret') || s.includes('guidage en cours')) return 'success'
    return 'info'
  })()

  const startLabel = startPoint ? (startPoints[startPoint]?.label || startPoint) : 'Non sélectionné'
  const destinationLabel = dest ? (destinationLabels[dest] || dest) : 'Non sélectionnée'

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%', position:'relative'}}>
      <div className="chat-status-bar" role="status" aria-live="polite">
        <div className="chat-status-pill">
          <span className="chat-status-key">Départ</span>
          <strong className="chat-status-value">{startLabel}</strong>
        </div>
        <div className="chat-status-pill">
          <span className="chat-status-key">Destination</span>
          <strong className="chat-status-value">{destinationLabel}</strong>
        </div>
        <div className={`chat-status-pill chat-status-pill-wide chat-status-${statusTone}`}>
          <span className="chat-status-key">Statut</span>
          <strong className="chat-status-value">{guideStatus}</strong>
        </div>
      </div>

      <div ref={chatWindowRef} onScroll={handleChatScroll} className="chat-window" style={{flex:1}}>
        {messages.map((m,i)=> (
          <div key={i} className={`msg ${m.from}`}>
            <div className="avatar">{m.from==='bot'? <img src={chatbot} alt="bot" /> : 'U'}</div>
            <div className={`bubble ${m.from==='bot'? 'assistant-bubble':''}`}>{m.text}</div>
          </div>
        ))}
      </div>

      {showJumpToBottom && (
        <button type="button" className="jump-to-bottom-btn" onClick={jumpToBottom}>
          Aller en bas
        </button>
      )}

      {/* live transcript input (shows interim and final transcription) */}
      <div style={{padding:12, borderTop:'1px solid rgba(255,255,255,0.02)', display:'flex', gap:8, alignItems:'center'}}>
        <input value={liveTranscript} onChange={e=>setLiveTranscript(e.target.value)} placeholder="Transcription..." style={{flex:1, padding:10, borderRadius:8, border:'1px solid rgba(16,22,30,0.08)', background:'#fff', color:'#07101a'}} />
        <button className="btn primary" onClick={()=>{
          const txt = liveTranscript.trim()
          if(!txt) return
          setMessages(m => [...m, { from:'user', text: txt }])
          // try to interpret the sent text
          processTranscription(txt)
          setLiveTranscript('')
        }}>Envoyer</button>
      </div>

      <div className="controls">
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <button className={`btn ${recording? 'recording':''}`} onClick={handleMicClick}>
            <span className="mic-icon">🎤</span> {recording ? 'Enregistrement...' : 'Appuyez pour parler'}
          </button>
        </div>

        <div style={{marginLeft:12, display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
          <span className="muted small">Choisissez un départ puis une destination</span>

          <select className="select" value={startPoint} onChange={e=>{ setStartPoint(e.target.value); setGuideStatus('Départ sélectionné') }}>
            <option value="">-- Départ --</option>
            <optgroup label="Entrée">
              <option value="entryC">Entrée C • (0,2)</option>
            </optgroup>
            <optgroup label="Coordonnées">
              <option value="p0">Point (0,0)</option>
              <option value="p02">Point (0,2)</option>
            </optgroup>
          </select>

          <select className="select" value={dest} onChange={e=>{ setDest(e.target.value); setGuideStatus('Destination sélectionnée') }}>
            <option value="">-- Destination --</option>
            <optgroup label="Armoires">
              <option value="armoireA">Armoire A • (4,0)</option>
              <option value="armoireB">Armoire B • (2,4)</option>
            </optgroup>
            <optgroup label="Ateliers">
              <option value="workshop1">Atelier 1 • (4,1)</option>
              <option value="workshop2">Atelier 2 • (4,2)</option>
              <option value="workshop3">Atelier 3 • (4,4)</option>
            </optgroup>
          </select>
          <button className="btn primary" disabled={!startPoint || !dest} onClick={()=>{ if(dest) guideTo(dest) }} style={{marginLeft:8}}>Guider</button>
          <label style={{display:'inline-flex', alignItems:'center', gap:6, marginLeft:8, color:'#dbe7f7', fontSize:13}}>
            <input type="checkbox" checked={safetyMode} onChange={e=>setSafetyMode(e.target.checked)} />
            Mode sécurité
          </label>
          <select className="select" value={guidanceStyle} onChange={e=>setGuidanceStyle(e.target.value)}>
            <option value="auto">Style auto</option>
            <option value="short">Style rapide</option>
            <option value="detailed">Style formation</option>
          </select>
        </div>
      </div>

      

      {/* transient toast */}
      {toast && (
        <div style={{position:'absolute', right:24, top:84, background:'rgba(0,0,0,0.85)', color:'#fff', padding:'10px 14px', borderRadius:8, boxShadow:'0 6px 20px rgba(0,0,0,0.3)'}}>
          {toast}
        </div>
      )}
    </div>
  )
}

