import { Be_Vietnam_Pro } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "./StoreProvider";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
});

export const metadata = {
  title: "Green Mart. - Shop smarter",
  description: "Green Mart. - Shop smarter",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${beVietnamPro.className} antialiased`}>
        <AuthProvider>
          <StoreProvider>
            <Toaster />
            {children}
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
