import React, { useRef, useState } from "react";
import {
  PixelRatio,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Canvas,
  Group,
  Image,
  Mask,
  Rect,
  SkImage,
  makeImageFromView,
} from "@shopify/react-native-skia";
import { SystemBars } from "react-native-bars";
import { useSharedValue, withTiming } from "react-native-reanimated";

const sleep = async (timer: number) =>
  new Promise((resolve) => setTimeout(resolve, timer));

export default function Page() {
  const ref = useRef();
  const pd = PixelRatio.get();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [theme, setTheme] = useState("light");
  const [overlay, setOverlay] = useState<SkImage | null>(null);
  const themeStyles = theme === "light" ? lightTheme : darkTheme;
  const mask = useSharedValue(0);
  const [active, setActive] = useState(false);
  const handlePress = async () => {
    if (active) return;
    setActive(true);
    setTheme(theme === "light" ? "dark" : "light");
    const snapshot = await makeImageFromView(ref);
    setOverlay(snapshot);
    await sleep(80);
    mask.value = withTiming(SCREEN_WIDTH, { duration: 800 });
    await sleep(800);
    setOverlay(null);
    mask.value = 0;
    setActive(false);
  };
  return (
    <View
      className="flex flex-1"
      style={[{ paddingTop: insets.top }, themeStyles.container]}
      ref={ref}
      collapsable={false}
    >
      <SystemBars
        animated={true}
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <Header theme={theme} handlePress={handlePress} />
      {overlay && (
        <Canvas pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          <Mask
            mode="luminance"
            mask={
              <Group>
                <Rect
                  height={SCREEN_HEIGHT}
                  width={SCREEN_WIDTH}
                  color="white"
                />
                <Rect height={SCREEN_HEIGHT} width={mask} color="black" />
              </Group>
            }
          >
            <Image
              image={overlay}
              width={overlay.width() / pd}
              height={overlay.height() / pd}
              x={0}
              y={0}
            />
          </Mask>
        </Canvas>
      )}
    </View>
  );
}

const Header = ({ theme, handlePress }) => {
  return (
    <View className="p-5 border-b border-gray-200">
      <TouchableOpacity onPress={handlePress} activeOpacity={1}>
        <MaterialIcons
          name={theme === "light" ? "dark-mode" : "light-mode"}
          size={24}
          color={theme === "light" ? "black" : "white"}
        />
      </TouchableOpacity>
    </View>
  );
};

const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: "#000",
  },
});
const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
});
