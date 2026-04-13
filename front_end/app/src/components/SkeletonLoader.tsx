import React from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

interface SkeletonProps {
  width?: any;
  height?: any;
  borderRadius?: number;
  style?: any;
}

const SkeletonLoader = ({ width, height, borderRadius, style }: SkeletonProps) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width: width,
          height: height,
          backgroundColor: '#E1E9EE',
          borderRadius: borderRadius || 4,
          opacity: opacity,
        },
        style,
      ]}
    />
  );
};

export const EventSkeleton = ({ horizontal }: { horizontal?: boolean }) => (
  <View style={[styles.eventCard, horizontal && styles.horizontalCard]}>
    <SkeletonLoader 
      width={horizontal ? 200 : 80} 
      height={horizontal ? 120 : 80} 
      borderRadius={15} 
      style={{ marginRight: horizontal ? 0 : 15, marginBottom: horizontal ? 10 : 0 }} 
    />
    <View style={{ flex: 1, gap: 8 }}>
      <SkeletonLoader width={horizontal ? "80%" : "60%"} height={16} />
      <SkeletonLoader width={horizontal ? "100%" : "90%"} height={20} />
      <SkeletonLoader width={horizontal ? "50%" : "40%"} height={14} />
    </View>
  </View>
);

export const NotificationSkeleton = () => (
  <View style={styles.notifCard}>
    <SkeletonLoader width={48} height={48} borderRadius={16} style={{ marginRight: 16 }} />
    <View style={{ flex: 1, gap: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <SkeletonLoader width="50%" height={16} />
        <SkeletonLoader width={30} height={12} />
      </View>
      <SkeletonLoader width="90%" height={14} />
      <SkeletonLoader width="70%" height={14} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  eventCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  horizontalCard: {
    flexDirection: 'column',
    width: 250,
    marginRight: 20,
    padding: 12,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  }
});

export default SkeletonLoader;
