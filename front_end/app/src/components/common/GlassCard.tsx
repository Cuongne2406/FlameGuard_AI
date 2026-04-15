import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradientColors?: string[];
  opacity?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  style, 
  gradientColors = ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
  opacity = 0.9
}) => {
  return (
    <View style={[styles.container, SHADOWS.light, style]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  gradient: {
    padding: 20,
    flex: 1,
  }
});

export default GlassCard;
