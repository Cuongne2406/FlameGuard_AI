import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

interface MainHeaderProps {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
}

const MainHeader: React.FC<MainHeaderProps> = ({ children, contentContainerStyle }) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[COLORS.gradient[0], COLORS.gradient[1], COLORS.gradient[2]] || COLORS.gradient}
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
    paddingBottom: 45,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    zIndex: 10,
  },
  content: {
    paddingHorizontal: 20,
    width: '100%',
  }
});

export default MainHeader;
