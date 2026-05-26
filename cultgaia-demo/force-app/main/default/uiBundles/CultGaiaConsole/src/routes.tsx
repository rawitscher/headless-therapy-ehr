import type { RouteObject } from 'react-router';
import AppLayout from '@/appLayout';
import Today from './pages/Today';
import Customers from './pages/Customers';
import Customer360 from './pages/Customer360';
import Orders from './pages/Orders';
import Consolidation from './pages/Consolidation';
import NotFound from './pages/NotFound';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Today />,
        handle: { showInNavigation: true, label: 'Today' },
      },
      {
        path: 'customers',
        element: <Customers />,
        handle: { showInNavigation: true, label: 'Customers' },
      },
      {
        path: 'customers/:customerId',
        element: <Customer360 />,
      },
      {
        path: 'orders',
        element: <Orders />,
        handle: { showInNavigation: true, label: 'Orders' },
      },
      {
        path: 'consolidation',
        element: <Consolidation />,
        handle: { showInNavigation: true, label: 'One Platform' },
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];
