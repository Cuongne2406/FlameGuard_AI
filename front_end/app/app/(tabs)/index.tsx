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
  ChevronRight,
  Award,
  BadgeCheck,
} from 'lucide-react-native';

import { COLORS, SHADOWS, SIZES, UI } from '../../src/constants/theme';
import EventCard from '../../src/components/EventCard';
import { useAuth } from '../../src/context/AuthContext';
import { getEvents } from '../../src/api/client';
import { EventSkeleton } from '../../src/components/SkeletonLoader';
import { useQuery } from '@tanstack/react-query';
import GlassCard from '../../src/components/common/GlassCard';
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

  const filteredEvents = useMemo(() => {
    const displayEvents = events || [];

    if (!searchQuery.trim()) {
      return displayEvents;
    }

    const query = searchQuery.toLowerCase();
    return displayEvents.filter((event: any) => {
      const title = (event.name || event.title || '').toLowerCase();
      const organizer = (event.organization_name || event.organizer || '').toLowerCase();
      const location = (event.location || '').toLowerCase();
      return title.includes(query) || organizer.includes(query) || location.includes(query);
    });
  }, [events, searchQuery]);

  const featuredEvents = filteredEvents.slice(0, 3);
  const upcomingEvents = filteredEvents.slice(0, 5);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <MainHeader>
        <View style={styles.headerTop}>
          <View style={styles.headerCopy}>
            <Text style={styles.welcomeText}>Chào buổi sáng,</Text>
            <Text style={styles.userName}>{user?.full_name || 'Sinh viên'}</Text>
            <Text style={styles.headerSub}>Hôm nay mình ưu tiên sự kiện mới, check-in nhanh và hồ sơ cá nhân của bạn.</Text>
          </View>
          <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]} onPress={() => router.push('/notifications')}>
            <Bell size={22} color={COLORS.white} />
            <View style={styles.badge} />
          </Pressable>
        </View>
      </MainHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
      >
        <View style={styles.searchSection}>
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

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.keywordRow}>
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
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Sparkles size={18} color={COLORS.warning} />
            <Text style={styles.sectionTitle}>Sự kiện nổi bật</Text>
          </View>
          <Pressable onPress={() => router.push('/events')}>
            <Text style={styles.viewAll}>Xem tất cả</Text>
          </Pressable>
        </View>

        {loading ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContent}>
            <EventSkeleton horizontal />
            <EventSkeleton horizontal />
          </ScrollView>
        ) : (
          <FlatList
            data={featuredEvents}
            renderItem={({ item }) => (
              <EventCard event={item} horizontal onPress={() => router.push(`/event-detail/${item.id}`)} />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            ListEmptyComponent={
              <View style={styles.emptyInline}>
                <Text style={styles.emptyInlineText}>Chưa có sự kiện phù hợp với từ khóa hiện tại.</Text>
              </View>
            }
          />
        )}

        <LinearGradient colors={['#F97316', '#EA580C']} style={[styles.checkInCard, SHADOWS.medium]}>
          <View style={styles.checkInCopy}>
            <View style={styles.checkInTag}>
              <Text style={styles.checkInTagText}>CHECK-IN NHANH</Text>
            </View>
            <Text style={styles.checkInTitle}>Quét QR trong vài giây</Text>
            <Text style={styles.checkInSub}>Nút check-in luôn sẵn ngay trang chủ để vào sự kiện nhanh hơn.</Text>
          </View>
          <Pressable style={({ pressed }) => [styles.checkInButton, pressed && styles.buttonPressed]} onPress={() => router.push('/scan-qr')}>
            <QrCode size={20} color={COLORS.primary} />
            <Text style={styles.checkInButtonText}>Mở máy quét</Text>
          </Pressable>
        </LinearGradient>

        <GlassCard style={styles.profileSummary}>
          <View style={styles.profileHeader}>
            <View>
              <Text style={styles.profileTitle}>Thông tin cá nhân</Text>
              <Text style={styles.profileSub}>Theo dõi nhanh tiến độ và thành tích hiện tại.</Text>
            </View>
            <Pressable style={({ pressed }) => [styles.profileAction, pressed && styles.buttonPressed]} onPress={() => router.push('/profile')}>
              <Text style={styles.profileActionText}>Mở hồ sơ</Text>
              <ChevronRight size={16} color={COLORS.primary} />
            </Pressable>
          </View>

          <View style={styles.summaryGrid}>
            <Pressable style={({ pressed }) => [styles.summaryCard, pressed && styles.pressed]} onPress={() => router.push('/profile')}>
              <Award size={18} color={COLORS.primary} />
              <Text style={styles.summaryValue}>{user?.training_score || 0}</Text>
              <Text style={styles.summaryLabel}>Điểm rèn luyện</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.summaryCard, pressed && styles.pressed]} onPress={() => router.push('/awards')}>
              <BadgeCheck size={18} color={COLORS.success} />
              <Text style={styles.summaryValue}>{user?.level || 1}</Text>
              <Text style={styles.summaryLabel}>Cấp độ hiện tại</Text>
            </Pressable>
          </View>
        </GlassCard>

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
              <EventCard key={event.id} event={event} onPress={() => router.push(`/event-detail/${event.id}`)} />
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  headerCopy: {
    flex: 1,
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: SIZES.body,
    marginBottom: 4,
  },
  userName: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 14,
    lineHeight: 20,
    maxWidth: '90%',
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
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.danger,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  scrollContent: {
    paddingBottom: SIZES.padding * 4,
  },
  searchSection: {
    marginTop: 10,
    paddingHorizontal: UI.screenPadding,
    marginBottom: UI.sectionGap,
    zIndex: 20,
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
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
  },
  keywordRow: {
    paddingTop: 14,
    gap: 10,
  },
  keywordChip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: UI.chipRadius,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  keywordText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  pressedChip: {
    backgroundColor: COLORS.surfaceMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: UI.screenPadding,
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  viewAll: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  carouselContent: {
    paddingLeft: UI.screenPadding,
    paddingRight: 6,
  },
  emptyInline: {
    width: 240,
    backgroundColor: COLORS.surface,
    borderRadius: UI.cardRadius,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyInlineText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  checkInCard: {
    marginHorizontal: UI.screenPadding,
    marginBottom: UI.sectionGap,
    borderRadius: UI.cardRadius,
    padding: 20,
    gap: 18,
  },
  checkInCopy: {
    gap: 8,
  },
  checkInTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: UI.chipRadius,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  checkInTagText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },
  checkInTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '800',
  },
  checkInSub: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 14,
    lineHeight: 20,
  },
  checkInButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: UI.chipRadius,
  },
  checkInButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  profileSummary: {
    marginHorizontal: UI.screenPadding,
    marginBottom: UI.sectionGap,
    padding: 20,
    borderRadius: UI.cardRadius,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  profileTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  profileSub: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  profileAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profileActionText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 20,
    padding: 16,
    gap: 8,
  },
  summaryValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
  },
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  activitiesList: {
    paddingHorizontal: UI.screenPadding,
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
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
});

export default HomeScreen;
