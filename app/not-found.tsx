// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '4rem', margin: '0' }}>404</h1>
      <h2 style={{ margin: '20px 0' }}>Page Not Found</h2>
      <p style={{ margin: '10px 0', color: '#666' }}>
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link 
        href="/" 
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}
      >
        Go Back Home
      </Link>
    </div>
  );
}