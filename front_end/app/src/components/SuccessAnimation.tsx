import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { CheckCircle2, Sparkles } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

interface SuccessAnimationProps {
  message?: string;
  onAnimationEnd?: () => void;
}

const SuccessAnimation = ({ message, onAnimationEnd }: SuccessAnimationProps) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const sparkles = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(sparkles, {
        toValue: 1,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onAnimationEnd) {
        setTimeout(onAnimationEnd, 2000);
      }
    });
  }, []);

  const sparkleTranslate = sparkles.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, { transform: [{ scale }], opacity }]}>
        <CheckCircle2 size={100} color={COLORS.success} strokeWidth={3} />
        
        {/* Animated Sparkles */}
        <Animated.View style={[styles.sparkle, { transform: [{ translateY: sparkleTranslate }], opacity: sparkles }]}>
          <Sparkles size={30} color="#FFD700" fill="#FFD700" />
        </Animated.View>
        <Animated.View style={[styles.sparkleRight, { transform: [{ translateY: sparkleTranslate }], opacity: sparkles }]}>
          <Sparkles size={24} color="#FFD700" fill="#FFD700" />
        </Animated.View>
      </Animated.View>
      
      {message && (
        <Animated.Text style={[styles.message, { opacity }]}>
          {message}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  message: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.success,
    textAlign: 'center',
  },
  sparkle: {
    position: 'absolute',
    top: -10,
    left: 20,
  },
  sparkleRight: {
    position: 'absolute',
    top: 50,
    right: -10,
  }
});

export default SuccessAnimation;
