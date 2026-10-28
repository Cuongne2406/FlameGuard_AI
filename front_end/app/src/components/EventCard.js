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

/**
 * EventCard — multi-variant event display component
 *
 * variant:
 *   'featured'  — full card with large image (used in featured vertical list)
 *   'mini'      — compact horizontal carousel card (200px wide, small image)
 *   'compact'   — horizontal list item with small square thumbnail
 */
const EventCard = ({ event, onPress, horizontal = false, variant = 'featured', style, recommendedSkill }) => {
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

  // ─── MINI VARIANT (horizontal carousel) ──────────────────────────────────
  if (variant === 'mini' || horizontal) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.miniCard, pressed && styles.cardPressed, style]}
      >
        <Image source={{ uri: image }} style={styles.miniImage} />

        {/* Points badge overlay */}
        <View style={styles.miniPointsBadge}>
          <Award size={10} color={COLORS.white} />
          <Text style={styles.miniPointsText}>+{points}đ</Text>
        </View>

        <View style={styles.miniContent}>
          {/* Status row */}
          <View style={styles.miniStatusRow}>
            <View style={[styles.miniStatusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.miniStatusText, { color: statusColor }]}>{status}</Text>
          </View>

          <Text style={styles.miniTitle} numberOfLines={2}>
            {title}
          </Text>

          {recommendedSkill && (
            <View style={styles.miniRecBadge}>
              <Text style={styles.miniRecText}>Gợi ý: rèn luyện {recommendedSkill}</Text>
            </View>
          )}

          <View style={styles.miniFooter}>
            <Calendar size={11} color={COLORS.textMuted} />
            <Text style={styles.miniDate}>{dateText}</Text>
          </View>
        </View>
      </Pressable>
    );
  }

  // ─── COMPACT VARIANT (upcoming list) ─────────────────────────────────────
  if (variant === 'compact') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.compactCard, pressed && styles.cardPressed, style]}
      >
        {/* Thumb wrapper clips image corners on both iOS and Android */}
        <View style={styles.compactThumbWrapper}>
          <Image source={{ uri: image }} style={styles.compactThumb} />
        </View>
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.compactMeta}>
            <View style={[styles.compactStatusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.compactStatusLabel, { color: statusColor }]}>{status}</Text>
            <Text style={styles.compactDivider}>·</Text>
            <Award size={11} color={COLORS.primary} />
            <Text style={styles.compactPoints}>+{points}đ</Text>
          </View>
          {recommendedSkill && (
            <View style={styles.compactRecBadge}>
              <Text style={styles.compactRecText}>Gợi ý phát triển kỹ năng: {recommendedSkill}</Text>
            </View>
          )}
          <View style={styles.compactInfoRow}>
            <Calendar size={11} color={COLORS.textMuted} />
            <Text style={styles.compactInfoText} numberOfLines={1}>{dateText}</Text>
          </View>
          <View style={styles.compactInfoRow}>
            <MapPin size={11} color={COLORS.textMuted} />
            <Text style={styles.compactInfoText} numberOfLines={1}>{location}</Text>
          </View>
        </View>
      </Pressable>
    );
  }

  // ─── FEATURED VARIANT (default) ───────────────────────────────────────────
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        styles.fullCard,
        pressed && styles.cardPressed,
      ]}
    >
      <Image source={{ uri: image }} style={styles.image} />

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

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={styles.typeChip}>
            <Text style={styles.typeText}>{type}</Text>
          </View>
          {recommendedSkill && (
            <View style={styles.miniRecBadge}>
              <Text style={styles.miniRecText}>Gợi ý: {recommendedSkill}</Text>
            </View>
          )}
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
  // ─── Shared ────────────────────────────────────────────────────────────────
  cardPressed: {
    transform: [{ scale: 0.975 }],
    opacity: 0.95,
  },

  // ─── Featured (default) ────────────────────────────────────────────────────
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
  fullCard: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 168,
    resizeMode: 'cover',
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

  // ─── Mini (horizontal carousel) ────────────────────────────────────────────
  miniCard: {
    width: 196,
    marginRight: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: SHADOWS.light,
      android: { elevation: 3 },
    }),
  },
  miniImage: {
    width: '100%',
    height: 108,
    resizeMode: 'cover',
  },
  miniPointsBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.82)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  miniPointsText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
  miniContent: {
    padding: 12,
    gap: 6,
  },
  miniStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  miniStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  miniStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  miniTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 19,
  },
  miniFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  miniDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },

  // ─── Compact (upcoming list) ───────────────────────────────────────────────
  compactCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 125,         // fixed height — increased to prevent clipping recommended badges
    alignItems: 'stretch',
    ...Platform.select({
      ios: SHADOWS.light,
      android: { elevation: 2 },
    }),
  },
  // Explicit wrapper gives Android a reliable clip context for borderRadius
  compactThumbWrapper: {
    width: 80,
    height: 125,          // must match compactCard height
    overflow: 'hidden',
  },
  compactThumb: {
    width: 80,
    height: 125,          // explicit — 'height:100%' is unreliable in RN without a measured parent
    resizeMode: 'cover',
  },
  compactContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 3,
    justifyContent: 'center',   // vertically center text within the fixed-height card
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 19,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  compactStatusLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  compactDivider: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  compactPoints: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  compactInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactInfoText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  miniRecBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  miniRecText: {
    color: '#4F46E5',
    fontSize: 9,
    fontWeight: '700',
  },
  compactRecBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  compactRecText: {
    color: '#4F46E5',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default EventCard;
