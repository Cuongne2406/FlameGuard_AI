import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

interface PremiumButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

const PremiumButton: React.FC<PremiumButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  variant = 'primary'
}) => {
  const handlePress = () => {
    if (!loading && !disabled) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }
  };

  const getColors = () => {
    switch (variant) {
      case 'primary': return [COLORS.primary, '#3A0CA3'];
      case 'secondary': return [COLORS.secondary, COLORS.accent];
      case 'danger': return [COLORS.danger, '#B91C1C'];
      case 'ghost': return [COLORS.surface, COLORS.surface];
      default: return [COLORS.primary, '#3A0CA3'];
    }
  };

  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.container,
        !isGhost && SHADOWS.medium,
        isGhost && styles.ghostBorder,
        disabled && styles.disabled,
        style
      ]}
    >
      <LinearGradient
        colors={getColors() as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={isGhost ? COLORS.primary : COLORS.white} size="small" />
        ) : (
          <View style={styles.content}>
            <Text style={[
              styles.text,
              isGhost && { color: COLORS.primary },
              textStyle
            ]}>
              {title}
            </Text>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 56,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  iconContainer: {
    marginLeft: 10,
  },
  ghostBorder: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  disabled: {
    opacity: 0.6,
  }
});

export default PremiumButton;
