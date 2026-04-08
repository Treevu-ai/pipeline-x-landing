/**
 * Vercel serverless function — proxy seguro hacia Notion API.
 * El token nunca se expone al browser.
 *
 * Variables de entorno requeridas en Vercel:
 *   NOTION_TOKEN  — token de la integración de Notion
 */

const DB_ID = 'c8e55705-b3ab-4e79-a977-cd4f7c64dd51'

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.NOTION_TOKEN
  if (!token) {
    return res.status(500).json({ error: 'NOTION_TOKEN not configured' })
  }

  const { nombre, whatsapp, tipo, ciudad } = req.body || {}

  if (!nombre || !whatsapp) {
    return res.status(400).json({ error: 'nombre y whatsapp son requeridos' })
  }

  // Construir propiedades para Notion
  const properties = {
    Nombre: {
      title: [{ type: 'text', text: { content: String(nombre).slice(0, 100) } }],
    },
    WhatsApp: {
      phone_number: String(whatsapp).slice(0, 50),
    },
    Estado: {
      select: { name: 'Nuevo' },
    },
  }

  if (tipo) {
    properties['Tipo de empresa'] = { select: { name: tipo } }
  }

  if (ciudad) {
    properties['Ciudad'] = {
      rich_text: [{ type: 'text', text: { content: String(ciudad).slice(0, 100) } }],
    }
  }

  try {
    const notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: DB_ID },
        properties,
      }),
    })

    if (!notionRes.ok) {
      const err = await notionRes.json().catch(() => ({}))
      console.error('Notion error:', err)
      return res.status(502).json({ error: 'Notion save failed', detail: err.message })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('save-lead error:', err)
    return res.status(500).json({ error: 'Internal error' })
  }
}
