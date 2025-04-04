import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster, toast } from 'sonner'


export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <GoogleOAuthProvider clientId="826677420756-nko3kgf62n3sr85l5spgduhs1qi2o0tq.apps.googleusercontent.com">
      <html lang="en">
        <body
          className={`antialiased`}
        >
          {children}
          <Toaster />
          <ToastContainer />
        </body>
      </html>
    </GoogleOAuthProvider>
  );
}
