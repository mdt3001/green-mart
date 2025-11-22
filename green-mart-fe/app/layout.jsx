import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "./StoreProvider";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
  title: "Green Mart. - Shop smarter",
  description: "Green Mart. - Shop smarter",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
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
