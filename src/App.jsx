import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import PlaceholderPage from './pages/PlaceholderPage';
import JobAnalysis from './pages/analysis/JobAnalysis';
import AnalysisHistory from './pages/analysis/AnalysisHistory';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="practice" element={<PlaceholderPage title="Practice Problems" />} />
                    <Route path="assessments" element={<PlaceholderPage title="Assessments" />} />
                    <Route path="resources" element={<PlaceholderPage title="Learning Resources" />} />
                    <Route path="profile" element={<PlaceholderPage title="User Profile" />} />
                    <Route path="analyze" element={<JobAnalysis />} />
                    <Route path="history" element={<AnalysisHistory />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
