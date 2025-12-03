'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
