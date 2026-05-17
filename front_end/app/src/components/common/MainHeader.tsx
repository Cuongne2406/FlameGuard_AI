import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, UI } from '../../constants/theme';

interface MainHeaderProps {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
}

const MainHeader: React.FC<MainHeaderProps> = ({ children, contentContainerStyle }) => {
  const insets = useSafeAreaInsets();
  const gradientColors: readonly [string, string, string] = [
    COLORS.gradient[0],
    COLORS.gradient[1],
    COLORS.gradient[2],
  ];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.header,
        { paddingTop: insets.top + 15 }
      ]}
    >
      <View style={[styles.content, contentContainerStyle]}>
        {children}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    zIndex: 10,
  },
  content: {
    paddingHorizontal: UI.screenPadding,
    width: '100%',
  }
});

export default MainHeader;
