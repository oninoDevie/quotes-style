import formidable from 'formidable'
import fs from 'fs'
import { PrismaClient } from '@prisma/client'
import { supabase } from '../../lib/supabase' // lo crearás en el siguiente paso

// Desactivamos el body parser de Next.js para poder manejar archivos
export const config = {
  api: {
    bodyParser: false,
  },
}

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method is allowed' })
  }

  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: 'Form parsing error' })

    const { quoteText } = fields
    const audio = files.audio

    if (!quoteText || !audio) {
      return res.status(400).json({ message: 'Missing quoteText or audio file' })
    }

    const fileExt = audio.originalFilename.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const fileBuffer = fs.readFileSync(audio.filepath)

    const { error: uploadError } = await supabase.storage
      .from('quotes-audios') // asegúrate de haber creado este bucket en Supabase
      .upload(fileName, fileBuffer, {
        contentType: audio.mimetype,
      })

    if (uploadError) {
      return res.status(500).json({ message: 'Failed to upload to Supabase Storage', error: uploadError })
    }

    const { data } = supabase.storage.from('quotes-audios').getPublicUrl(fileName)

    const quote = await prisma.quote.create({
      data: {
        text: quoteText,
        audioUrl: data.publicUrl,
      },
    })

    return res.status(200).json({ message: 'Quote created', quote })
  })
}
