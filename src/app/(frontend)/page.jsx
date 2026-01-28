// src/app/page.jsx
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/en') // أو /ar حسب default بتاعك
}
