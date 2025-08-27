// /layout.tsx
import DevOverlay from "./components/DevOverlay";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./globals.css";


export const metadata = {
  title: "davidboo",
  description: "Personal Website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <DevOverlay/>
        <Footer />
      </body>
    </html>
  );
}
