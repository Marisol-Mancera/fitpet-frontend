import Header from '../components/ui/Header.jsx'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
    return (
        <div className='min-h-dvh bg-fp-neutral-50 test-fp-text-700'>
            <Header />
            <main className='mx-auto max-w-screen-md px-4 py-6'>
                <Outlet />
            </main>
        </div>
    )
}