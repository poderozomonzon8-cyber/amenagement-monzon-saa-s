import { readFileSync } from 'fs'
const content = readFileSync('/vercel/share/v0-project/components/marketing-header.tsx', 'utf8')
const lines = content.split('\n').slice(0, 15)
lines.forEach((l, i) => {
  console.log(`${i + 1}: ${JSON.stringify(l)}`)
})
