import type { RouteObject } from 'react-router';
import AppLayout from '@/appLayout';
import Home from './pages/Home';
import Scheduling from './pages/Scheduling';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Messages from './pages/Messages';
import ToDo from './pages/ToDo';
import PortalPreview from './pages/PortalPreview';
import IntakePreview from './pages/IntakePreview';
import Consolidation from './pages/Consolidation';
import NotFound from './pages/NotFound';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home />, handle: { label: 'Home' } },
      { path: 'to-do', element: <ToDo />, handle: { label: 'To-Do' } },
      { path: 'messages', element: <Messages />, handle: { label: 'Messages' } },
      { path: 'scheduling', element: <Scheduling />, handle: { label: 'Scheduling' } },
      { path: 'patients', element: <Patients />, handle: { label: 'Patients' } },
      { path: 'patients/:slug', element: <PatientDetail /> },
      { path: 'portal-preview', element: <PortalPreview /> },
      { path: 'intake-preview', element: <IntakePreview /> },
      { path: 'consolidation', element: <Consolidation /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
