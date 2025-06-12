import { useRef, useState, useEffect } from 'react'

export default function QuotePage() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [quotes, setQuotes] = useState([])
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)

  const currentQuote = quotes[currentQuoteIndex]

  useEffect(() => {
    fetch('/api/quotes/get')
      .then(res => res.json())
      .then(setQuotes)
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentQuoteIndex])

  const togglePlayPause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const stopAudio = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setIsPlaying(false)
  }

  const playNextQuote = () => {
    stopAudio()
    setCurrentQuoteIndex((i) => (i + 1) % quotes.length)
  }

  const playPreviousQuote = () => {
    stopAudio()
    setCurrentQuoteIndex((i) => (i - 1 + quotes.length) % quotes.length)
  }

  if (quotes.length === 0) return <p className="text-center mt-10">Loading quotes...</p>

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-xl w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quote {currentQuoteIndex + 1}</h2>
        <p className="text-xl italic text-gray-700 mb-4">"{currentQuote.text}"</p>
        <p className="text-md text-gray-600 font-semibold mb-6">- {currentQuote.author || 'Anonymous'}</p>

        <audio ref={audioRef} src={currentQuote.audioUrl} onEnded={playNextQuote} />

        <div className="flex justify-center items-center space-x-4">
          <button onClick={playPreviousQuote} className="p-2 bg-gray-200 rounded-full">⏮️</button>
          <button onClick={togglePlayPause} className="p-3 bg-blue-600 text-white rounded-full text-xl">
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button onClick={stopAudio} className="p-2 bg-red-500 text-white rounded-full">⏹️</button>
          <button onClick={playNextQuote} className="p-2 bg-gray-200 rounded-full">⏭️</button>
        </div>
      </div>
    </div>
  )
}
