import { useState } from 'react'

export default function SubirQuote() {
  const [quoteText, setQuoteText] = useState('')
  const [audioFile, setAudioFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!quoteText || !audioFile) return alert('Falta texto o audio')

    const formData = new FormData()
    formData.append('quoteText', quoteText)
    formData.append('audio', audioFile)

    setLoading(true)
    const res = await fetch('/api/upload-quote', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      setSuccess(true)
      setQuoteText('')
      setAudioFile(null)
    } else {
      alert('Error al subir')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">Subir nueva quote</h1>

        <textarea
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          placeholder="Escribe tu quote aquí..."
          rows={4}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files[0])}
          className="w-full"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? 'Subiendo...' : 'Subir Quote'}
        </button>

        {success && (
          <p className="text-green-600 text-center font-semibold">¡Quote subida con éxito!</p>
        )}
      </form>
    </div>
  )
}
