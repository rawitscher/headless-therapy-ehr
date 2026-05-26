import { Outlet, Link, useLocation } from 'react-router';
import { useState } from 'react';
import { AgentforceConversationClient } from '@salesforce/ui-bundle-template-feature-react-agentforce-conversation-client';
import { getAllRoutes } from './router-utils';

export default function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const navigationRoutes = getAllRoutes()
    .filter(
      r =>
        r.handle?.showInNavigation === true &&
        r.fullPath !== undefined &&
        r.handle?.label !== undefined
    )
    .map(r => ({ path: r.fullPath as string, label: r.handle?.label as string }));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--cg-bg)' }}>
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{
          background: 'rgba(250, 247, 242, 0.85)',
          borderBottom: '1px solid var(--cg-line)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-md font-display text-lg"
                style={{ background: 'var(--cg-ink)', color: 'var(--cg-accent)' }}
              >
                CG
              </span>
              <div className="leading-tight">
                <div className="font-display text-xl" style={{ color: 'var(--cg-ink)' }}>
                  Cult Gaia
                </div>
                <div
                  className="text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: 'var(--cg-muted)' }}
                >
                  Atelier Console
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navigationRoutes.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{
                    color: isActive(item.path) ? 'var(--cg-ink)' : 'var(--cg-muted)',
                    background: isActive(item.path) ? 'var(--cg-accent-soft)' : 'transparent',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ background: 'var(--cg-accent-soft)', color: 'var(--cg-clay)' }}
                title="Store Manager · Melrose Flagship"
              >
                IR
              </div>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md"
              style={{ color: 'var(--cg-ink)' }}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
                <span className={`block h-0.5 w-6 bg-current transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 w-6 bg-current transition-all ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-6 bg-current transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>

          {isOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-1">
                {navigationRoutes.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-2 rounded-md text-sm font-medium"
                    style={{
                      color: isActive(item.path) ? 'var(--cg-ink)' : 'var(--cg-muted)',
                      background: isActive(item.path) ? 'var(--cg-accent-soft)' : 'transparent',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      <AgentforceConversationClient
        agentId="0Xx710000000TgLCAU"
        agentLabel="Cult Gaia Copilot"
        styleTokens={{
          fabBackground: '#1a1a1a',
          headerBlockBackground: '#1a1a1a',
          headerBlockTextColor: '#faf7f2',
          headerBlockFontFamily: "'Cormorant Garamond', serif",
          headerBlockFontWeight: '600',
          headerBlockFontSize: '20px',
          containerBackground: '#faf7f2',
          chatBorderRadius: '12px',
          messageBlockOutboundBackgroundColor: '#1a1a1a',
          messageBlockOutboundTextColor: '#faf7f2',
          messageBlockInboundBackgroundColor: '#ffffff',
          messageBlockInboundTextColor: '#1a1a1a',
          messageInputFooterSendButton: '#c89b6c',
          messageInputSendButtonIconColor: '#1a1a1a',
        }}
      />

      <footer style={{ borderTop: '1px solid var(--cg-line)' }}>
        <div
          className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex flex-wrap items-center justify-between gap-3 text-xs"
          style={{ color: 'var(--cg-muted)' }}
        >
          <div className="font-display text-sm" style={{ color: 'var(--cg-ink)' }}>
            Cult Gaia · Atelier Console
          </div>
          <div className="tracking-wider uppercase">Built on Salesforce · Resort 2026</div>
        </div>
      </footer>
    </div>
  );
}
