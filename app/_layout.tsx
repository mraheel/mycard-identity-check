import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export default function RootLayout() {

  const onlyShowVerificationScreen: boolean = true;
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      {
        onlyShowVerificationScreen ? (
          <Stack
            initialRouteName="index"
            screenOptions={{
              headerShown: true,
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                title: "Card Verification",
              }}
            />
          </Stack>
        ):(
          <Drawer>
            <Drawer.Screen
              name="index"
              options={{
                drawerLabel: "Card Verification",
                title: "Card Verification",
              }}
            />
            
            <Drawer.Screen
              name="card/CardsList"
              options={{
                drawerLabel: "Cards Listing",
                title: "Cards Listing",
                drawerItemStyle: { display: 'none' }
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
        )
      }
    </GestureHandlerRootView>
  );
}
