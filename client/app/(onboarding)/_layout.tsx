import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signUp" options={{ title: "" }} />
      <Stack.Screen name="signIn" options={{ title: "" }} />
    </Stack>
  );
}
