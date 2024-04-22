import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { Slot } from "expo-router";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
