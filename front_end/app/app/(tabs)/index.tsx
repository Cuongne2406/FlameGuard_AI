import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  Search,
  Sparkles,
  QrCode,
  Award,
  BadgeCheck,
  ChevronRight,
} from 'lucide-react-native';

import { COLORS, SHADOWS, SIZES, UI } from '../../src/constants/theme';
import EventCard from '../../src/components/EventCard';
import { useAuth } from '../../src/context/AuthContext';
import apiClient, { getEvents } from '../../src/api/client';
import { EventSkeleton } from '../../src/components/SkeletonLoader';
import { useQuery } from '@tanstack/react-query';
import MainHeader from '../../src/components/common/MainHeader';

const quickKeywords = ['Mùa hè xanh', 'Tình nguyện', 'Workshop AI'];

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: events, isLoading: loading } = useQuery({
    queryKey: ['events', 'home'],
    queryFn: () => getEvents(0, 6),
    staleTime: 5 * 60 * 1000,
  });

  // Query stats for user's skills radar
  const { data: stats } = useQuery({
    queryKey: ['profileStats', user?.id],
    queryFn: () => apiClient.get('/users/me/profile_stats').then(res => res.data),
    enabled: !!user,
  });

  const weakestSkills = useMemo(() => {
    if (!stats || !stats.skills) return [];
    // Sort skills by score ascending
    const sorted = [...stats.skills].sort((a: any, b: any) => (a.A || a.score || 0) - (b.A || b.score || 0));
    // Return names of the bottom 2 skills
    return sorted.slice(0, 2).map((s: any) => s.subject);
  }, [stats]);

  const getRecommendedSkillForEvent = (eventName: string, eventDesc: string) => {
    if (weakestSkills.length === 0) return null;
    const nameLower = (eventName || '').toLowerCase();
    const descLower = (eventDesc || '').toLowerCase();
    
    // Map keywords to skills
    const skillKeywords: { [key: string]: string[] } = {
      'Lãnh đạo': ['lãnh đạo', 'quản lý', 'tổ chức', 'chủ chốt', 'đại hội', 'ban chấp hành', 'bí thư'],
      'Giao tiếp': ['giao tiếp', 'workshop', 'diễn thuyết', 'tọa đàm', 'giao lưu', 'biện luận', 'trình bày'],
      'Kỹ thuật': ['kỹ thuật', 'ai', 'lập trình', 'công nghệ', 'tin học', 'phần mềm', 'web', 'blockchain', 'coding', 'chuyển đổi số'],
      'Sáng tạo': ['sáng tạo', 'thiết kế', 'ý tưởng', 'nghệ thuật', 'văn nghệ', 'cuộc thi', 'hackathon', 'thi hát', 'nhiếp ảnh'],
      'Phân tích': ['phân tích', 'nghiên cứu', 'khoa học', 'khảo sát', 'đánh giá', 'dự báo', 'tài chính', 'báo cáo']
    };
    
    for (const skill of weakestSkills) {
      const keywords = skillKeywords[skill];
      if (keywords) {
        for (const kw of keywords) {
          if (nameLower.includes(kw) || descLower.includes(kw)) {
            return skill;
          }
        }
      }
    }
    return null;
  };

  const filteredEvents = useMemo(() => {
    const displayEvents = events || [];
    if (!searchQuery.trim()) return displayEvents;
    const query = searchQuery.toLowerCase();
    return displayEvents.filter((event: any) => {
      const title = (event.name || event.title || '').toLowerCase();
      const organizer = (event.organization_name || event.organizer || '').toLowerCase();
      const location = (event.location || '').toLowerCase();
      return title.includes(query) || organizer.includes(query) || location.includes(query);
    });
  }, [events, searchQuery]);

  // Only show active events on Home — ended events belong in Profile history or Events archive tab
  const ACTIVE_STATUSES = new Set(['PUBLISHED', 'LIVE', 'Upcoming', 'DRAFT']);
  const activeEvents = filteredEvents.filter(
    (e: any) => ACTIVE_STATUSES.has(e.status) || (!e.status)
  );

  const featuredEvents = activeEvents.slice(0, 5);
  const upcomingEvents = activeEvents.slice(0, 5);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Compact Header with inline stats ────────────────────── */}
      <MainHeader compact>
        <View style={styles.headerTop}>
          <View style={styles.headerCopy}>
            <Text style={styles.welcomeText}>Chào buổi sáng,</Text>
            <Text style={styles.userName}>{user?.full_name || 'Sinh viên'}</Text>

            {/* Inline stats bar — replaces the large GlassCard below */}
            <View style={styles.statsBar}>
              <View style={styles.statItem}>
                <Award size={13} color="rgba(255,255,255,0.85)" />
                <Text style={styles.statText}>
                  {user?.training_score || 0} ĐRL
                </Text>
              </View>
              <View style={styles.statSep} />
              <View style={styles.statItem}>
                <BadgeCheck size={13} color="rgba(255,255,255,0.85)" />
                <Text style={styles.statText}>
                  Cấp {user?.level || 1}
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.statMoreBtn, pressed && styles.pressed]}
                onPress={() => router.push('/profile')}
              >
                <Text style={styles.statMoreText}>Hồ sơ</Text>
                <ChevronRight size={11} color="rgba(255,255,255,0.7)" />
              </Pressable>
            </View>
          </View>

          {/* Bell */}
          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={22} color={COLORS.white} />
            <View style={styles.badge} />
          </Pressable>
        </View>
      </MainHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* ── Bridge Section: tím nhạt → cam nhạt ──────────────── */}
        <LinearGradient
          colors={['rgba(238, 237, 255, 0.95)', 'rgba(255, 247, 237, 0.80)', 'rgba(248, 250, 252, 0)']}
          style={styles.bridgeSection}
        >
          {/* Search bar */}
          <View style={[styles.searchBar, SHADOWS.light]}>
            <Search size={18} color={COLORS.textSecondary} />
            <TextInput
              placeholder="Tìm sự kiện, địa điểm, đơn vị tổ chức..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          {/* Quick keyword chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.keywordRow}
          >
            {quickKeywords.map((keyword) => (
              <Pressable
                key={keyword}
                onPress={() => setSearchQuery(keyword)}
                style={({ pressed }) => [styles.keywordChip, pressed && styles.pressedChip]}
              >
                <Text style={styles.keywordText}>{keyword}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </LinearGradient>

        {/* ── Featured Events Carousel ──────────────────────────── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Sparkles size={16} color={COLORS.warning} />
            <Text style={styles.sectionTitle}>Sự kiện nổi bật</Text>
          </View>
          <Pressable onPress={() => router.push('/events')}>
            <Text style={styles.viewAll}>Xem tất cả</Text>
          </Pressable>
        </View>

        {loading ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
          >
            <EventSkeleton horizontal />
            <EventSkeleton horizontal />
            <EventSkeleton horizontal />
          </ScrollView>
        ) : (
          <FlatList
            data={featuredEvents}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                variant="mini"
                recommendedSkill={getRecommendedSkillForEvent(item.name, item.description)}
                onPress={() => router.push(`/event-detail/${item.id}`)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            ListEmptyComponent={
              <View style={styles.emptyInline}>
                <Text style={styles.emptyInlineText}>
                  Chưa có sự kiện phù hợp với từ khóa hiện tại.
                </Text>
              </View>
            }
          />
        )}

        {/* ── Check-In Banner (orange, bridged by gradient above) ── */}
        <LinearGradient
          colors={[COLORS.checkIn, COLORS.checkInDark, '#C2410C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.checkInCard, SHADOWS.medium]}
        >
          <View style={styles.checkInLeft}>
            <View style={styles.checkInTag}>
              <Text style={styles.checkInTagText}>CHECK-IN NHANH</Text>
            </View>
            <Text style={styles.checkInTitle}>Quét QR trong vài giây</Text>
            <Text style={styles.checkInSub}>
              Vào sự kiện ngay — không cần tìm kiếm thủ công.
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.checkInButton, pressed && styles.buttonPressed]}
            onPress={() => router.push('/scan-qr')}
          >
            <QrCode size={22} color={COLORS.checkIn} />
            <Text style={styles.checkInButtonText}>Mở máy quét</Text>
          </Pressable>
        </LinearGradient>

        {/* ── Upcoming Activities — compact list ───────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hoạt động sắp tới</Text>
          <Pressable onPress={() => router.push('/events')}>
            <Text style={styles.viewAll}>Xem tất cả</Text>
          </Pressable>
        </View>

        <View style={styles.activitiesList}>
          {loading ? (
            <View>
              <EventSkeleton />
              <EventSkeleton />
            </View>
          ) : upcomingEvents.length ? (
            upcomingEvents.map((event: any) => (
              <EventCard
                key={event.id}
                event={event}
                variant="compact"
                recommendedSkill={getRecommendedSkillForEvent(event.name, event.description)}
                onPress={() => router.push(`/event-detail/${event.id}`)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Hiện chưa có hoạt động nào sắp diễn ra.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '500',
  },
  userName: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },

  // Inline stats bar inside header
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '700',
  },
  statSep: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
  },
  statMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    gap: 2,
  },
  statMoreText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    fontWeight: '600',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.danger,
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  // ── Bridge Section ─────────────────────────────────────────────────────────
  bridgeSection: {
    paddingHorizontal: UI.screenPadding,
    paddingTop: 16,
    paddingBottom: 20,
    marginBottom: 4,
  },
  searchBar: {
    height: UI.inputHeight,
    backgroundColor: COLORS.surface,
    borderRadius: UI.cardRadius,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  keywordRow: {
    gap: 8,
  },
  keywordChip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: UI.chipRadius,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  keywordText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  pressedChip: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },

  // ── Section Headers ─────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: UI.screenPadding,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  viewAll: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Featured Carousel ───────────────────────────────────────────────────────
  carouselContent: {
    paddingLeft: UI.screenPadding,
    paddingRight: 8,
    paddingBottom: 20,
  },
  emptyInline: {
    width: 220,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyInlineText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  // ── Check-In Banner ─────────────────────────────────────────────────────────
  checkInCard: {
    marginHorizontal: UI.screenPadding,
    marginBottom: UI.sectionGap,
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkInLeft: {
    flex: 1,
    gap: 6,
  },
  checkInTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: UI.chipRadius,
    backgroundColor: 'rgba(255,255,255,0.22)',
    marginBottom: 2,
  },
  checkInTagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  checkInTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  checkInSub: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
    lineHeight: 18,
  },
  checkInButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    minWidth: 80,
  },
  checkInButtonText: {
    color: COLORS.checkIn,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },

  // ── Upcoming Activities ─────────────────────────────────────────────────────
  activitiesList: {
    paddingHorizontal: UI.screenPadding,
  },
  scrollContent: {
    paddingBottom: SIZES.padding * 4,
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: UI.cardRadius,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },

  // ── Misc ────────────────────────────────────────────────────────────────────
  pressed: {
    transform: [{ scale: 0.975 }],
    opacity: 0.9,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
});

export default HomeScreen;
