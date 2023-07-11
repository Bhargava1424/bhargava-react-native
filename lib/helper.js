import * as React from 'react';
import { Button, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { supabase, supabaseUrl } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  // This will create a redirectUri
  // This should be the URL you added to "Redirect URLs" in Supabase URL Configuration
  // If they are different add the value of redirectUrl to your Supabase Redirect URLs
  const redirectUrl = makeRedirectUri({
    scheme: 'mycoolredirect',
    path: 'exp://192.168.0.106:19000/--/auth/callback',
  });

  // authUrl: https://{YOUR_PROJECT_REFERENCE_ID}.supabase.co
  // returnURL: the redirectUrl you created above.
  const [request, response, promptAsync] = useAuthRequest(
    {
      authUrl: `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`,
      returnUrl: redirectUrl,
    },
    null
  );

  React.useEffect(() => {
    // If the user successfully signs in
    // we will have access to an accessToken and an refreshToken
    // and then we'll use setSession (https://supabase.com/docs/reference/javascript/auth-setsession)
    // to create a Supabase-session using these token
    if (response?.type === 'success') {
      supabase.auth.setSession({
        access_token: response.params.access_token,
        refresh_token: response.params.refresh_token,
      });
    }
  }, [response]);

  return (
    <Button
      disabled={!request} // disable the button until request is ready
      title="Login"
      onPress={() => {
        googleSignIn(request, promptAsync);
      }}
    />
  );
};

export const googleSignIn = async (request, promptAsync) => {
  // Check if request is not null before calling promptAsync
  if (request) {
    // Call promptAsync with the request object
    const authResponse = await promptAsync(request);

    // If the user successfully signs in
    // we will have access to an accessToken and an refreshToken
    // and then we'll use setSession (https://supabase.com/docs/reference/javascript/auth-setsession)
    // to create a Supabase-session using these token
    if (authResponse.type === 'success') {
      supabase.auth.setSession({
        access_token: authResponse.params.access_token,
        refresh_token: authResponse.params.refresh_token,
      });
    }
  }
};
