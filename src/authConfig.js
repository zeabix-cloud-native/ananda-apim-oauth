export const msalConfig = {
    auth: {
     // clientId: "0be87ed7-c822-40d6-98e0-0d6dccae6d25",
      clientId: "d51b4512-4f5a-4010-a108-a37b425bc22d",
      authority: "https://login.microsoftonline.com/d13ad595-5883-4b3a-a953-bc0f981c0c35", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
      redirectUri: "http://localhost:3000",
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };
  
  // Add scopes here for ID token to be used at Microsoft identity platform endpoints.
  export const loginRequest = {
  // scopes: ["openid", "api://0be87ed7-c822-40d6-98e0-0d6dccae6d25/profile"]
   scopes: ["openid", "api://1554aabf-40eb-4c83-a85e-748e6190d5a5/Post.Read"]
  };
  
  // Add the endpoints here for Microsoft Graph API services you'd like to use.
  export const graphConfig = {
      graphMeEndpoint: "Enter_the_Graph_Endpoint_Here/v1.0/me"
  };