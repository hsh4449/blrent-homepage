import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import { lazy, Suspense } from 'react'
import { AdminProvider } from './contexts/AdminContext'
import AdminLayout from './components/admin/AdminLayout'

const HomePage = lazy(() => import('./pages/HomePage'))
const NewCarPage = lazy(() => import('./pages/NewCarPage'))
const UsedCarPage = lazy(() => import('./pages/UsedCarPage'))
const MonthlyPage = lazy(() => import('./pages/MonthlyPage'))
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'))
const SupportPage = lazy(() => import('./pages/SupportPage'))
const VehicleDetailPage = lazy(() => import('./pages/VehicleDetailPage'))

const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const VehicleManagement = lazy(() => import('./pages/admin/VehicleManagement'))
const ConsultationManagement = lazy(() => import('./pages/admin/ConsultationManagement'))

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/new-car" element={<NewCarPage />} />
            <Route path="/used-car" element={<UsedCarPage />} />
            <Route path="/monthly" element={<MonthlyPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
          </Route>
          <Route path="/admin" element={<AdminProvider><AdminLayout /></AdminProvider>}>
            <Route index element={<Dashboard />} />
            <Route path="vehicles" element={<VehicleManagement />} />
            <Route path="consultations" element={<ConsultationManagement />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
