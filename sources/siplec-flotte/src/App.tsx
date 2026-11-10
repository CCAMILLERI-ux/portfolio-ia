import { Layout } from './components/Layout';
import { Toasts } from './components/ui';
import { AlertDetail } from './pages/AlertDetail';
import { Alerts } from './pages/Alerts';
import { Dashboard } from './pages/Dashboard';
import { Cards, Drivers, Reports, Transactions, Vehicles } from './pages/Secondary';
import { useRoute } from './router';

export default function App() {
  const route = useRoute();

  let page;
  switch (route.page) {
    case 'cards':
      page = <Cards />;
      break;
    case 'vehicles':
      page = <Vehicles />;
      break;
    case 'drivers':
      page = <Drivers />;
      break;
    case 'transactions':
      page = <Transactions />;
      break;
    case 'alerts':
      page = <Alerts />;
      break;
    case 'alert':
      page = <AlertDetail key={route.id} id={route.id} />;
      break;
    case 'reports':
      page = <Reports />;
      break;
    default:
      page = <Dashboard />;
  }

  return (
    <>
      <Layout route={route}>{page}</Layout>
      <Toasts />
    </>
  );
}
