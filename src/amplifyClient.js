import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import awsconfig from "./aws-exports";

// Configure Amplify with multi-auth
Amplify.configure({
  ...awsconfig,
  aws_appsync_authenticationType: "API_KEY", 
  ssr:true,
});

// Default client (Cognito or whatever is in aws-exports)
//export const authClient = generateClient({authMode:"userPool"});

// Public client (API key)
//export const publicClient = generateClient({ authMode: "API_KEY" });

