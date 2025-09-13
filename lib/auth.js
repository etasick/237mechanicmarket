import { Auth } from "aws-amplify";

export async function getCurrentUser() {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user;
  } catch {
    return null;
  }
}
