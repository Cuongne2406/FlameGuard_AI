import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SHADOWS } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  gradientColors?: string[];
  opacity?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  style, 
  contentStyle,
  gradientColors = ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
}) => {
  return (
    <View style={[styles.container, SHADOWS.light, style]}>
      <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, contentStyle]}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF', // Use solid white to prevent Android shadow block from bleeding through
    borderWidth: 1,
    borderColor: '#FFFFFF', // Solid edge
  },
  gradient: {
    padding: 20,
    flex: 1,
  }
});

export default GlassCard;
