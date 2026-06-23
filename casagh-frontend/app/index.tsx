import { Redirect } from 'expo-router';

// In a real app, you would check auth state and whether the user has completed onboarding here.
export default function Index() {
  return <Redirect href="/onboarding" />;
}
