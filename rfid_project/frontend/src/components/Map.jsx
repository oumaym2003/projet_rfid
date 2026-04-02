import React, { useEffect, useRef, useState } from 'react'

export default function Map({height=520, width=520}){
  const iframeRef = useRef(null)
  const [scale, setScale] = useState(1)

  // send a command to the iframe map
  const post = (msg) => {
    const frame = iframeRef.current
    if(!frame) return
    try{ frame.contentWindow.postMessage(JSON.stringify(msg), '*') }catch(e){ console.warn('post to map', e) }
  }

  const postHighlight = (pos) => post({type:'highlight', pos})
  const postRoute = (path) => post({type:'route', path})
  const postSafety = (enabled, blocked = []) => post({type:'safety', enabled, blocked})
  const postZoomIn = () => { post({type:'zoomIn'}); setScale(s => Math.min(2.5, s + 0.1)) }
  const postZoomOut = () => { post({type:'zoomOut'}); setScale(s => Math.max(0.4, s - 0.1)) }
  const postFit = () => { post({type:'fit'}); setScale(1) }

  useEffect(()=>{
    window.__mapPost = {
      highlight: postHighlight,
      route: postRoute,
      safety: postSafety,
      zoomIn: postZoomIn,
      zoomOut: postZoomOut,
      fit: postFit,
      setScale: (s)=>post({type:'setScale', scale: s})
    }
    // listen for clicks from the map and emit a CustomEvent so other components can consume it
    const onMessage = (ev) => {
      try{
        const data = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data
        if(!data || !data.type) return
        if(data.type === 'mapClick'){
          const ev2 = new CustomEvent('mapClick', { detail: data.pos })
          window.dispatchEvent(ev2)
        }
      }catch(e){ console.warn('map message parse', e) }
    }
    window.addEventListener('message', onMessage)
    return ()=>{ window.__mapPost = null; window.removeEventListener('message', onMessage) }
  },[])

  return (
    <div style={{width:width, height:height, borderRadius:12, overflow:'hidden', boxShadow:'0 18px 60px rgba(0,0,0,0.5)', position:'relative'}}>
      <iframe ref={iframeRef} title="site-map" src="/map.html" style={{border:0, width:'100%', height:'100%', pointerEvents:'auto'}} />

      {/* Zoom controls overlay */}
      <div style={{position:'absolute', left:8, top:8, display:'flex', flexDirection:'column', gap:8}}>
        <button className="btn" onClick={postZoomIn} title="Zoom in">＋</button>
        <button className="btn" onClick={postZoomOut} title="Zoom out">－</button>
        <button className="btn" onClick={postFit} title="Reset">⤢</button>
      </div>
    </div>
  )
}
