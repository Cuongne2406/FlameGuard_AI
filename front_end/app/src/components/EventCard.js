import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
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
    borderRadius: SIZES.radius * 1.5,
    overflow: 'hidden',
    marginBottom: SIZES.padding,
    ...Platform.select({
      ios: SHADOWS.light,
      android: { elevation: 3 }
    })
  },
  horizontalCard: {
    width: 260,
    marginRight: SIZES.padding,
  },
  fullCard: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  pointsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 82, 212, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  pointsText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  organizer: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 4,
    gap: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  }
});

export default EventCard;
