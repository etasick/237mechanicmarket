// lib/fetchUser.js
import { fetchAuthSession } from 'aws-amplify/auth';
import { AwsClient } from 'aws4fetch';

const API_ENDPOINT = 'https://a6en7riyzk.execute-api.us-east-1.amazonaws.com/default/getuserbyid';

export async function fetchUserProfile(userId) {
  try {
    // Get Cognito identity credentials for IAM-authenticated API access
    const { credentials } = await fetchAuthSession();

const client = new AwsClient({
  accessKeyId: credentials.accessKeyId,
  secretAccessKey: credentials.secretAccessKey,
  sessionToken: credentials.sessionToken,
  service: 'execute-api',
  region: 'us-east-1'
});

    if (!credentials) {
      throw new Error('No valid AWS credentials found');
    }

   const response = await client.fetch(API_ENDPOINT, {
  method: 'POST',
  body: JSON.stringify({ userId }),
  headers: { 'Content-Type': 'application/json' }
});

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    return result; 

  } catch (err) {
    console.error('❌ Error fetching user profile from Lambda:', err);
    throw err;
  }
}
