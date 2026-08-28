import './styles/globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Peter Uchenna Ukpabi - DevSecOps Engineer',
  description: 'Portfolio of Peter Uchenna Ukpabi, DevSecOps & Cloud Engineer',
  keywords: 'DevSecOps, Cloud Engineer, AWS, Kubernetes, Terraform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body className={`${inter.variable}`}>
        <AuthProvider>
          <div className="container">
            <Navbar />
            <main>
              {children}
            </main>
            <footer style={{ 
              marginTop: '3rem', 
              padding: '2rem 0',
              textAlign: 'center', 
              color: 'var(--text-light)',
              borderTop: '1px solid var(--border-color)',
              transition: 'all 0.3s ease'
            }}>
              <p>© {new Date().getFullYear()} Peter Uchenna Ukpabi · DevSecOps Engineer</p>
            </footer>
          </div>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-color)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
