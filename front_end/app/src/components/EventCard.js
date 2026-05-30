import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform } from 'react-native';
import { Calendar, MapPin, Award } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS, UI } from '../constants/theme';

const statusLabels = {
  PUBLISHED: 'Sắp tới',
  LIVE: 'Đang diễn ra',
  ENDED: 'Đã kết thúc',
  Upcoming: 'Sắp tới',
  Ended: 'Đã kết thúc',
};

const statusColors = {
  'Sắp tới': COLORS.secondary,
  'Đang diễn ra': COLORS.success,
  'Đã kết thúc': COLORS.textMuted,
};

const EventCard = ({ event, onPress, horizontal = false }) => {
  const title = event.name || event.title;
  const image =
    event.image_url ||
    event.image ||
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=500';
  const points = event.points || 15;
  const location = event.location || 'Hội trường A';
  const organizer = event.organization_name || event.organizer || 'Đoàn trường';
  const type = event.type || event.category || 'Hoạt động';

  let dateText = event.date || 'Sắp diễn ra';
  if (event.start_time) {
    const d = new Date(event.start_time);
    dateText = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  const status = statusLabels[event.status] || event.status || 'Sắp tới';
  const statusColor = statusColors[status] || COLORS.secondary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        horizontal ? styles.horizontalCard : styles.fullCard,
        pressed && styles.cardPressed,
      ]}
    >
      <Image source={{ uri: image }} style={[styles.image, horizontal && styles.horizontalImage]} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.tag, { backgroundColor: `${statusColor}15` }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.tagText, { color: statusColor }]}>{status}</Text>
          </View>
          <View style={styles.pointsTag}>
            <Award size={14} color={COLORS.primary} />
            <Text style={styles.pointsText}>+{points}đ</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.organizer} numberOfLines={1}>
          {organizer}
        </Text>

        <View style={styles.typeChip}>
          <Text style={styles.typeText}>{type}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <Calendar size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{dateText}</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: UI.cardRadius,
    overflow: 'hidden',
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: SHADOWS.light,
      android: { elevation: 3 },
    }),
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },
  horizontalCard: {
    width: 272,
    marginRight: SIZES.padding,
  },
  fullCard: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 168,
    resizeMode: 'cover',
  },
  horizontalImage: {
    height: 152,
  },
  content: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: UI.chipRadius,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  pointsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: UI.chipRadius,
    gap: 4,
  },
  pointsText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
    lineHeight: 24,
  },
  organizer: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  typeChip: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: UI.chipRadius,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 14,
  },
  typeText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

export default EventCard;
