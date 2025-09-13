import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import awsconfig from "@/src/aws-exports";

// Configure Amplify with multi-auth
Amplify.configure({
  ...awsconfig,
  ssr:true,
});

// Default client (Cognito or whatever is in aws-exports)
export const client = generateClient();



