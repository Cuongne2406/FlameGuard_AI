import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, MapPin, Award } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const EventCard = ({ event, onPress, horizontal = false }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        horizontal ? styles.horizontalCard : styles.fullCard,
        SHADOWS.light
      ]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: event.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.tagContainer}>
          <View style={[styles.tag, { backgroundColor: event.status === 'Upcoming' ? COLORS.secondary : COLORS.success }]}>
            <Text style={styles.tagText}>{event.status}</Text>
          </View>
          <View style={styles.pointsTag}>
            <Award size={14} color={COLORS.primary} />
            <Text style={styles.pointsText}>+{event.points}đ</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
        <Text style={styles.organizer} numberOfLines={1}>{event.organizer}</Text>

        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <Calendar size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{event.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>{event.location}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: SIZES.base * 2,
  },
  horizontalCard: {
    width: 280,
    marginRight: SIZES.base * 2,
  },
  fullCard: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  content: {
    padding: SIZES.base * 1.5,
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pointsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  pointsText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  organizer: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.base,
    marginTop: SIZES.base / 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  }
});

export default EventCard;
