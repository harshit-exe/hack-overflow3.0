import "./style.css";
import ClientLayout from "./clientLayout";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({ children }) {
  return (
    <GoogleOAuthProvider clientId="826677420756-nko3kgf62n3sr85l5spgduhs1qi2o0tq.apps.googleusercontent.com">
      <html lang="en">
        <body>
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </GoogleOAuthProvider>
  );
}
