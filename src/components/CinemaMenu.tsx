import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface CinemaMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

const MENU_ITEMS = [
  { key: 'hero', label: 'HOME' },
  { key: 'work', label: 'WORK' },
  { key: 'about', label: 'ABOUT' },
  { key: 'commits', label: 'REPOSITORIES' },
  { key: 'journey', label: 'JOURNEY' },
  { key: 'signal', label: 'SIGNAL' },
  { key: 'contact', label: 'CONTACT' },
];

export const CinemaMenu: React.FC<CinemaMenuProps> = ({ open, onClose, onNavigate }) => {
  useEffect(() => {
    if (open) {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="cx-menu" role="dialog" aria-modal="true" aria-label="Navigation Menu">
      <div className="cx-menu-shell">
        <aside className="cx-menu-aside">
          <div className="cx-menu-brand">
            <span className="cx-menu-brand-mark">STW</span>
          </div>
          <div className="cx-menu-orbit" aria-hidden="true">
            <span />
            <i />
            <b />
          </div>
          <p className="cx-menu-aside-note">A collection of systems, experiments, and selected work.</p>
        </aside>

        <div className="cx-menu-main">
          <div className="cx-menu-topline">
            <span>MENU</span>
            <button type="button" className="cx-menu-close" onClick={onClose} aria-label="Close menu">
              <span>CLOSE</span><b>×</b>
            </button>
          </div>
          <ol>
            {MENU_ITEMS.map((item, idx) => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate(item.key);
                    onClose();
                  }}
                >
                  <span className="cx-menu-number">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="cx-menu-label">{item.label}</span>
                  <span className="cx-menu-arrow">↗</span>
                </button>
              </li>
            ))}
            <li>
              <Link href="/projects" onClick={onClose}>
                <span className="cx-menu-number">08</span>
                <span className="cx-menu-label">ALL PROJECTS</span>
                <span className="cx-menu-arrow">↗</span>
              </Link>
            </li>
          </ol>
          <div className="cx-menu-foot">
            <p><i /> SYSTEM ONLINE <span>·</span> AVAILABLE FOR ROLES</p>
            <div>
              <a href={PORTFOLIO_DATA.person.github} target="_blank" rel="noreferrer">GITHUB ↗</a>
              <a href="https://stwlinkconnect.kdns.fr" target="_blank" rel="noreferrer">LINKCONNECT ↗</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
