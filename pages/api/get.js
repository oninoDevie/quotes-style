import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET allowed' })
  }

  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: 'desc' },
  })

  res.status(200).json(quotes)
}
