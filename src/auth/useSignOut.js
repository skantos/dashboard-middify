import { useCallback } from "react";
import { useAuth } from "react-oidc-context";

const COGNITO_CLIENT_ID = "1lvdmpmv6mk114gdelmn0ol8co";
const COGNITO_DOMAIN ="https://us-east-2bws3t9vwm.auth.us-east-2.amazoncognito.com";
const COGNITO_LOGOUT_URI = "http://localhost:5173";

const clearStorage = () => {
  const prefixes = ["oidc.user:", "oidc.activeNavigator", "oidc.pendingSignin"];

  const removeMatching = (storage) => {
    if (!storage) {
      return;
    }

    const keysToRemove = [];
    for (let i = 0; i < storage.length; i += 1) {
      const key = storage.key(i);
      if (key && prefixes.some((prefix) => key.startsWith(prefix))) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => storage.removeItem(key));
  };

  try {
    removeMatching(window.localStorage);
    removeMatching(window.sessionStorage);
  } catch (err) {
    console.error("No se pudo limpiar el storage OIDC:", err);
  }
};

const buildLogoutUrl = (idToken) => {
  if (!COGNITO_DOMAIN) {
    return null;
  }

  const params = new URLSearchParams({
    client_id: COGNITO_CLIENT_ID,
    logout_uri: COGNITO_LOGOUT_URI,
  });

  if (idToken) {
    params.append("id_token_hint", idToken);
  }

  return `${COGNITO_DOMAIN}/logout?${params.toString()}&federated`;
};

export const useSignOut = () => {
  const auth = useAuth();

  const signOut = useCallback(async () => {
    const idToken = auth.user?.id_token;

    try {
      await auth.removeUser();
    } catch (err) {
      console.error("Error eliminando usuario local:", err);
    }

    if (typeof auth.clearStaleState === "function") {
      try {
        await auth.clearStaleState();
      } catch (err) {
        console.error("Error limpiando estado obsoleto:", err);
      }
    }

    clearStorage();

    const logoutUrl = buildLogoutUrl(idToken);

    if (logoutUrl) {
      window.location.assign(logoutUrl);
      return;
    }

    if (typeof auth.signoutRedirect === "function") {
      try {
        await auth.signoutRedirect({
          post_logout_redirect_uri: COGNITO_LOGOUT_URI,
        });
      } catch (err) {
        console.error("Error en signoutRedirect:", err);
      }
    }
  }, [auth]);

  return { signOut };
};

export default useSignOut;

