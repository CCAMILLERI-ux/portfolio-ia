import { useEffect, useState } from 'react';

export type Route =
  | { page: 'overview' }
  | { page: 'cards' }
  | { page: 'vehicles' }
  | { page: 'drivers' }
  | { page: 'transactions' }
  | { page: 'alerts' }
  | { page: 'alert'; id: string }
  | { page: 'reports' };

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  switch (parts[0]) {
    case 'cartes':
      return { page: 'cards' };
    case 'vehicules':
      return { page: 'vehicles' };
    case 'conducteurs':
      return { page: 'drivers' };
    case 'transactions':
      return { page: 'transactions' };
    case 'alertes':
      return parts[1] ? { page: 'alert', id: decodeURIComponent(parts[1]) } : { page: 'alerts' };
    case 'rapports':
      return { page: 'reports' };
    default:
      return { page: 'overview' };
  }
}

export function navigate(path: string) {
  window.location.hash = path;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
