import { Amplify } from "aws-amplify";
import { generateClient } from 'aws-amplify/api';
import awsconfig from "./aws-exports";

Amplify.configure({
  ...awsconfig,
  aws_appsync_authenticationType: "API_KEY", 
  ssr:true,
});

// Create and export the GraphQL client
const publicClient = generateClient();

export default publicClient;
