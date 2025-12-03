import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <div className="header-content">
        <Image
          src="/9011e5_cf796f4367f54052a843ba0ed695b544~mv2 (2).png"
          alt="Lindsay Precast"
          className="header-logo"
          width={80}
          height={80}
        />
        <div style={{ flex: 1 }}>
          <h1>Foam Sheet Tracker</h1>
          <p className="subtitle">Estimate foam sheets needed for holes</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/dashboard" className="btn-secondary" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
            📊 Dashboard
          </Link>
          <Link href="/" className="btn-secondary" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
            ➕ New Project
          </Link>
        </div>
      </div>
    </header>
  );
}

