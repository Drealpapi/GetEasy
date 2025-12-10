import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useTheme } from "../context/ThemeContext";

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { colors } = useTheme();
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Fallback timer in case video doesn't load or play
    const fallbackTimer = setTimeout(() => {
      onFinish();
    }, 8000); // 8 seconds fallback

    return () => clearTimeout(fallbackTimer);
  }, [onFinish]);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleVideoEnd = () => {
    onFinish();
  };

  const handleVideoError = (error: any) => {
    console.log("Video error:", error);
    // If video fails to load, show splash for 7 seconds then continue
    setTimeout(() => {
      onFinish();
    }, 7000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <Video
        source={require('../../assets/splash.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={true}
        isLooping={false}
        isMuted={false}
        onLoad={handleVideoLoad}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && status.didJustFinish) {
            handleVideoEnd();
          }
        }}
        onError={handleVideoError}
      />
      
      {/* Fallback content if video doesn't load */}
      {!videoLoaded && (
        <View style={[styles.fallbackContainer, { backgroundColor: colors.PRIMARY }]}>
          {/* You can add a logo or loading animation here */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width,
    height: height,
  },
  fallbackContainer: {
    position: 'absolute',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
});