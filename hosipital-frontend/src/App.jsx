import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Footeer from './components/Footeer'

const LifeLineCare = lazy(() => import('./components/Home'))
const SignUp = lazy(() => import('./components/SignUp'))
const RegisterPage = lazy(() => import('./components/RegisterPage'))
const About = lazy(() => import('./components/About'))
const Doctors = lazy(() => import('./components/Docters'))
const Patients = lazy(() => import('./components/patients'))
const Departments = lazy(() => import('./components/Departments'))
const Contact = lazy(() => import('./components/Contacts'))
const Faq = lazy(() => import('./components/Faq'))
const Appointments = lazy(() => import('./components/Appointments'))
const NotFound = lazy(() => import('./components/Notfound'))
const Dashboard = lazy(() => import('./components/Dashboard'))
const MyAppointments = lazy(() => import('./components/MyAppointments'))
const ProfileSettings = lazy(() => import('./components/ProfileSetting'))
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'))
// const TermsOfService = lazy(() => import('./components/TermsOfService'))
const PatientSupport = lazy(() => import('./components/PatientSupport'))

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center text-sm font-semibold text-slate-500">
    Loading...
  </div>
)

const ScrollToTop = () => {
  const { pathname, search } = useLocation()

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, search])

  return null
}

const App = () => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path='/' element={<LifeLineCare />} />
            <Route path='/about' element={<About />} />
            <Route path='/departments' element={<Departments />} />
            <Route path='/doctors' element={<Doctors />} />
            <Route path='/patients' element={<Patients />} />
            <Route path='/appointments' element={<Appointments />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/my-appointments' element={<MyAppointments />} />
            <Route path='/profile' element={<ProfileSettings />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/faq' element={<Faq />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          {/* <Route path='/terms-of-service' element={<TermsOfService />} />  */}
            <Route path='/patient-support' element={<PatientSupport />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footeer />
      </BrowserRouter> 
    </div>
  )
}

export default App;
