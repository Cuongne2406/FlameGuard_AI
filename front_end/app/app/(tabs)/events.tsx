import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search as SearchIcon, Sparkles, MapPin, Clock3, Shapes, History } from 'lucide-react-native';
import { COLORS, SHADOWS, UI } from '../../src/constants/theme';
import EventCard from '../../src/components/EventCard';
import apiClient, { getEvents } from '../../src/api/client';
import { useQuery } from '@tanstack/react-query';
import MainHeader from '../../src/components/common/MainHeader';
import { useAuth } from '../../src/context/AuthContext';
import { EventSkeleton } from '../../src/components/SkeletonLoader';

const timeFilters = ['Tất cả', 'Hôm nay', 'Tuần này'];
const locationFilters = ['Mọi nơi', 'Hội trường A', 'Online'];
const typeFilters = ['Tất cả', 'Tình nguyện', 'Học thuật', 'Văn nghệ'];
const recentSearches = ['Đoàn trường', 'Workshop', 'Xuân Lộc'];
const popularKeywords = ['Check-in', 'Mùa hè xanh', 'Hội thảo AI'];

// Status sets
const ACTIVE_STATUSES = new Set(['PUBLISHED', 'LIVE', 'Upcoming', 'DRAFT']);
const ENDED_STATUSES = new Set(['ENDED', 'Ended']);

const normalizeEventDate = (event: any) => {
  if (event.start_time) return new Date(event.start_time);
  if (event.date) {
    const parts = event.date.split('/');
    if (parts.length === 3)
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  }
  return null;
};

const EventsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'ended'>('active');
  const [timeFilter, setTimeFilter] = useState('Tất cả');
  const [locationFilter, setLocationFilter] = useState('Mọi nơi');
  const [typeFilter, setTypeFilter] = useState('Tất cả');

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', 'list'],
    queryFn: () => getEvents(),
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

  // Split events into active vs ended BEFORE other filters
  const { activeEvents, endedEvents } = useMemo(() => {
    const all = events || [];
    return {
      activeEvents: all.filter((e: any) => !ENDED_STATUSES.has(e.status)),
      endedEvents: all.filter((e: any) => ENDED_STATUSES.has(e.status)),
    };
  }, [events]);

  // Apply search + filters to the current tab's data
  const filteredEvents = useMemo(() => {
    const pool = activeTab === 'active' ? activeEvents : endedEvents;
    const query = searchQuery.trim().toLowerCase();
    const now = new Date();

    return pool.filter((event: any) => {
      const title = (event.name || event.title || '').toLowerCase();
      const organizer = (event.organization_name || event.organizer || '').toLowerCase();
      const location = (event.location || '').toLowerCase();
      const type = (event.type || event.category || '').toLowerCase();
      const eventDate = normalizeEventDate(event);

      const matchesQuery =
        !query || title.includes(query) || organizer.includes(query) || location.includes(query);
      const matchesLocation =
        locationFilter === 'Mọi nơi' || location.includes(locationFilter.toLowerCase());
      const matchesType =
        typeFilter === 'Tất cả' ||
        type.includes(typeFilter.toLowerCase()) ||
        title.includes(typeFilter.toLowerCase());

      let matchesTime = true;
      // Time filter only makes sense for active events
      if (activeTab === 'active' && timeFilter !== 'Tất cả' && eventDate) {
        const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / 86400000);
        if (timeFilter === 'Hôm nay') matchesTime = eventDate.toDateString() === now.toDateString();
        if (timeFilter === 'Tuần này') matchesTime = diffDays >= 0 && diffDays <= 7;
      }

      return matchesQuery && matchesLocation && matchesType && matchesTime;
    });
  }, [activeTab, activeEvents, endedEvents, searchQuery, locationFilter, typeFilter, timeFilter]);

  const renderFilterGroup = (
    title: string,
    options: string[],
    active: string,
    onChange: (v: string) => void,
    icon: React.ReactNode
  ) => (
    <View style={styles.filterGroup}>
      <View style={styles.filterLabelRow}>
        {icon}
        <Text style={styles.filterLabel}>{title}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {options.map((option) => {
          const selected = option === active;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={({ pressed }) => [
                styles.filterChip,
                selected && styles.filterChipActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.filterChipText, selected && styles.filterChipTextActive]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <MainHeader compact>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Sparkles size={20} color={COLORS.warning} />
            <Text style={styles.headerTitle}>Sự kiện</Text>
          </View>
        </View>
      </MainHeader>

      {/* ── Segment Tab Bar ─────────────────────────────────── */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabItem, activeTab === 'active' && styles.tabItemActive]}
          onPress={() => setActiveTab('active')}
        >
          <Sparkles size={14} color={activeTab === 'active' ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Sắp diễn ra
          </Text>
          {activeEvents.length > 0 && (
            <View style={[styles.tabBadge, activeTab === 'active' && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, activeTab === 'active' && styles.tabBadgeTextActive]}>
                {activeEvents.length}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable
          style={[styles.tabItem, activeTab === 'ended' && styles.tabItemActive]}
          onPress={() => setActiveTab('ended')}
        >
          <History size={14} color={activeTab === 'ended' ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'ended' && styles.tabTextActive]}>
            Đã kết thúc
          </Text>
          {endedEvents.length > 0 && (
            <View style={[styles.tabBadge, activeTab === 'ended' && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, activeTab === 'ended' && styles.tabBadgeTextActive]}>
                {endedEvents.length}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <FlatList
        data={filteredEvents}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            variant="compact"
            recommendedSkill={getRecommendedSkillForEvent(item.name, item.description)}
            // Ended events get a slightly muted style via opacity
            style={activeTab === 'ended' ? styles.endedCard : undefined}
            onPress={() => router.push(`/event-detail/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Search */}
            <View style={styles.searchSection}>
              <View style={[styles.searchBar, SHADOWS.light]}>
                <SearchIcon size={18} color={COLORS.textMuted} />
                <TextInput
                  placeholder={
                    activeTab === 'active'
                      ? 'Tìm sự kiện sắp diễn ra...'
                      : 'Tìm trong lịch sử sự kiện...'
                  }
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>

            {/* Recent & popular — only on active tab */}
            {activeTab === 'active' && (
              <>
                <View style={styles.suggestionBlock}>
                  <Text style={styles.suggestionTitle}>Tìm kiếm gần đây</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                    {recentSearches.map((item) => (
                      <Pressable
                        key={item}
                        onPress={() => setSearchQuery(item)}
                        style={({ pressed }) => [styles.suggestionChip, pressed && styles.pressed]}
                      >
                        <Text style={styles.suggestionText}>{item}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.suggestionBlock}>
                  <Text style={styles.suggestionTitle}>Từ khóa phổ biến</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                    {popularKeywords.map((item) => (
                      <Pressable
                        key={item}
                        onPress={() => setSearchQuery(item)}
                        style={({ pressed }) => [styles.suggestionChip, pressed && styles.pressed]}
                      >
                        <Text style={styles.suggestionText}>{item}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}

            {/* Ended tab hint */}
            {activeTab === 'ended' && (
              <View style={styles.archiveHint}>
                <History size={14} color={COLORS.textMuted} />
                <Text style={styles.archiveHintText}>
                  Tìm lại sự kiện đã qua. Bạn có thể xem lại chi tiết và kiểm tra điểm rèn luyện.
                </Text>
              </View>
            )}

            {/* Filters (active tab only — time filter not useful for ended) */}
            <View style={styles.filtersCard}>
              {activeTab === 'active' &&
                renderFilterGroup(
                  'Thời gian',
                  timeFilters,
                  timeFilter,
                  setTimeFilter,
                  <Clock3 size={16} color={COLORS.primary} />
                )}
              {renderFilterGroup(
                'Địa điểm',
                locationFilters,
                locationFilter,
                setLocationFilter,
                <MapPin size={16} color={COLORS.primary} />
              )}
              {renderFilterGroup(
                'Loại hoạt động',
                typeFilters,
                typeFilter,
                setTypeFilter,
                <Shapes size={16} color={COLORS.primary} />
              )}
            </View>

            {isLoading && (
              <View style={{ marginTop: 8 }}>
                <EventSkeleton />
                <EventSkeleton />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                {activeTab === 'active' ? 'Chưa có sự kiện' : 'Chưa có sự kiện đã kết thúc'}
              </Text>
              <Text style={styles.emptyText}>
                {activeTab === 'active'
                  ? 'Không tìm thấy sự kiện khớp với bộ lọc hiện tại.'
                  : 'Các sự kiện đã kết thúc sẽ xuất hiện tại đây.'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContent: {
    marginTop: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.white,
  },

  // ── Segment Tab Bar ───────────────────────────────────────────────────────
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: UI.screenPadding,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  tabBadge: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(79, 70, 229, 0.12)',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  tabBadgeTextActive: {
    color: COLORS.primary,
  },

  // ── List ─────────────────────────────────────────────────────────────────
  listContent: {
    padding: UI.screenPadding,
    paddingTop: 0,
  },
  endedCard: {
    opacity: 0.72,
  },

  // ── Archive hint ──────────────────────────────────────────────────────────
  archiveHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  archiveHintText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    fontWeight: '500',
  },

  // ── Search ────────────────────────────────────────────────────────────────
  searchSection: {
    marginTop: 14,
    marginBottom: 16,
    zIndex: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: UI.cardRadius,
    paddingHorizontal: 16,
    height: UI.inputHeight,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },

  // ── Suggestions ───────────────────────────────────────────────────────────
  suggestionBlock: {
    marginBottom: 16,
  },
  suggestionTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  chipRow: {
    gap: 10,
  },
  suggestionChip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: UI.chipRadius,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  suggestionText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Filters ───────────────────────────────────────────────────────────────
  filtersCard: {
    backgroundColor: COLORS.surface,
    borderRadius: UI.cardRadius,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  filterGroup: {
    marginBottom: 14,
  },
  filterLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  filterLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  filterChip: {
    borderRadius: UI.chipRadius,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.surfaceMuted,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: COLORS.white,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: UI.cardRadius,
    padding: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 20,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.96,
  },
});

export default EventsScreen;
