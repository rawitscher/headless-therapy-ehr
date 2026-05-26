import { createBrowserRouter, RouterProvider } from 'react-router';
import { routes } from '@/routes';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';

// The AgentforceConversationClient reads globalThis.SFDC_ENV.orgUrl to resolve
// the Salesforce origin. The Multi-Framework runtime doesn't always populate it,
// so we set it ourselves: on localhost, use the scratch org URL directly;
// when deployed inside the org, window.location.origin IS the org origin.
const g = globalThis as unknown as { SFDC_ENV?: { orgUrl?: string; basePath?: string } };
if (typeof window !== 'undefined') {
  const isLocal = window.location.hostname === 'localhost';
  const orgUrl = isLocal
    ? 'https://java-power-7159-dev-ed.scratch.my.salesforce.com'
    : window.location.origin;
  g.SFDC_ENV = { ...g.SFDC_ENV, orgUrl: g.SFDC_ENV?.orgUrl ?? orgUrl };
}

const rawBasePath = (globalThis as any).SFDC_ENV?.basePath;
const basename =
  typeof rawBasePath === 'string' ? rawBasePath.replace(/\/+$/, '') : undefined;
const router = createBrowserRouter(routes, { basename });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
