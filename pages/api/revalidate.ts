export default async function handler(req, res) {
  if (req.query.secret !== process.env.SUPABASE_SERVICE_ROLE_KEY as string) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    await res.revalidate('/')
    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send(`${err}\nError revalidating`)
  }
}