import { Outlet } from 'react-router-dom'
import "../styles/themes.css"; 

export default function CredentialsLayout() {
  return (
    <div className="min-h-dvh bg-[var(--bg-app)] text-[var(--text-base)]">
      <main className="mx-auto max-w-md px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}