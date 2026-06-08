import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, UI } from '../../constants/theme';

interface MainHeaderProps {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
  /** compact mode reduces bottom padding — use on screens without sub-text */
  compact?: boolean;
}

const MainHeader: React.FC<MainHeaderProps> = ({ children, contentContainerStyle, compact = false }) => {
  const insets = useSafeAreaInsets();

  return (
    <View>
      <LinearGradient
        colors={[COLORS.gradient[0], COLORS.gradient[1], COLORS.gradient[2]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          { paddingTop: insets.top + 15 },
          compact && styles.headerCompact,
        ]}
      >
        <View style={[styles.content, contentContainerStyle]}>
          {children}
        </View>
      </LinearGradient>

      {/* Fade-out bottom edge — creates a soft visual bridge to the content below */}
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.12)', 'rgba(99, 102, 241, 0)']}
        style={styles.fadeEdge}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    zIndex: 10,
  },
  headerCompact: {
    paddingBottom: 14,
  },
  content: {
    paddingHorizontal: UI.screenPadding,
    width: '100%',
  },
  // A thin gradient strip rendered on top of the section immediately below the header,
  // providing a smooth color transition instead of a hard border-radius cut.
  fadeEdge: {
    height: 20,
    marginTop: -10,
    zIndex: 5,
  },
});

export default MainHeader;
