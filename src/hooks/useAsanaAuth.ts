import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://app.asana.com/-/oauth_authorize",
};

export function useAsanaAuth() {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "gennie", // must match app.json
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_ASANA_CLIENT_ID!,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      scopes: [], // Asana does not require scopes
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const code = response.params.code;
      console.log("Asana auth code:", code);
      // 👉 send this code to backend
    }
  }, [response]);

  const connectAsana = async () => {
    await promptAsync();
  };

  return {
    connectAsana,
    request,
  };
}
