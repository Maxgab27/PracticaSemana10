import { useState, useEffect } from 'react';
import { Customer, SegmentationSummary } from './types';
import { CustomerService } from './services/customerService';
import { Layout, NavTab } from './app/index';
import { DashboardView } from './modules/dashboard';
import { CustomerListView } from './modules/customers';
import { SegmentationView } from './modules/segmentation';
import { RecommendationsView } from './modules/recommendations';
import './App.css';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [summary, setSummary] = useState<SegmentationSummary | null>(null);

  useEffect(() => {
    // Inicializar clientes desde localStorage o datos de prueba (RF-09)
    const initial = CustomerService.getAll();
    setCustomers(initial);
  }, []);

  const handleSegmentationComplete = (
    updatedCustomers: Customer[],
    newSummary: SegmentationSummary
  ) => {
    setCustomers(updatedCustomers);
    setSummary(newSummary);
  };

  return (
    <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === 'dashboard' && (
        <DashboardView
          customers={customers}
          summary={summary}
          onNavigateToSegmentation={() => setCurrentTab('segmentation')}
        />
      )}
      {currentTab === 'customers' && (
        <CustomerListView
          customers={customers}
          onCustomersUpdate={setCustomers}
        />
      )}
      {currentTab === 'segmentation' && (
        <SegmentationView
          customers={customers}
          summary={summary}
          onSegmentationComplete={handleSegmentationComplete}
        />
      )}
      {currentTab === 'recommendations' && (
        <RecommendationsView summary={summary} />
      )}
    </Layout>
  );
}

export default App;
