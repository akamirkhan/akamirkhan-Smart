import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { AssistantPage } from '@/pages/AssistantPage';
import { StandardsFinderPage } from '@/pages/StandardsFinderPage';
import { StandardDetailsPage } from '@/pages/StandardDetailsPage';
import { CertificationPage } from '@/pages/CertificationPage';
import { LaboratoryFinderPage } from '@/pages/LaboratoryFinderPage';
import { HallmarkingPage } from '@/pages/HallmarkingPage';
import { ConsumerHelpPage } from '@/pages/ConsumerHelpPage';
import { StandardsExplorerPage } from '@/pages/StandardsExplorerPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AboutPage } from '@/pages/AboutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/standards-finder" element={<StandardsFinderPage />} />
          <Route path="/standards/:id" element={<StandardDetailsPage />} />
          <Route path="/certification" element={<CertificationPage />} />
          <Route path="/laboratories" element={<LaboratoryFinderPage />} />
          <Route path="/hallmarking" element={<HallmarkingPage />} />
          <Route path="/consumer" element={<ConsumerHelpPage />} />
          <Route path="/explorer" element={<StandardsExplorerPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
