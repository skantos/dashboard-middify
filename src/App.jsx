import { useAuth } from "react-oidc-context";
import Index from "./pages/index";

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "1lvdmpmv6mk114gdelmn0ol8co";
    const logoutUri = "http://localhost:5173";
    const cognitoDomain = "https://us-east-2bws3t9vwm.auth.us-east-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <Index/>
    );
  }

  auth.signinRedirect();
  return <div>Redirigiendo al login...</div>;
}

export default App;