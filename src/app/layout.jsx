import "./globals.css";

export const metadata = {
  title: "Ibis",
  description: "Hub for all things IB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
