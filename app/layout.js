import './globals.css';

export const metadata = {
  title: 'Foam Sheet Tracker',
  description: 'Estimate foam sheets needed for holes',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

