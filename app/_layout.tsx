import { useFonts } from "expo-font";
// import { Stack } from 'expo-router';
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer>
        <Drawer.Screen
            name="card/CardsList"
            options={{
              drawerLabel: "Cards Listing",
              title: "Cards Listing",
            }}
          />
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: "Verification",
              title: "Verification",
            }}
          />
          <Drawer.Screen
            name="card/AddCard"
            options={{
              drawerLabel: "Add Card",
              title: "Add Card",
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
  );
}
