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
import { Search as SearchIcon, Sparkles, MapPin, Clock3, Shapes } from 'lucide-react-native';
import { COLORS, SHADOWS, UI } from '../../src/constants/theme';
import EventCard from '../../src/components/EventCard';
import { getEvents } from '../../src/api/client';
import { useQuery } from '@tanstack/react-query';
import MainHeader from '../../src/components/common/MainHeader';
import { EventSkeleton } from '../../src/components/SkeletonLoader';

const timeFilters = ['Tất cả', 'Hôm nay', 'Tuần này'];
const locationFilters = ['Mọi nơi', 'Hội trường A', 'Online'];
const typeFilters = ['Tất cả', 'Tình nguyện', 'Học thuật', 'Văn nghệ'];
const recentSearches = ['Đoàn trường', 'Workshop', 'Xuân Lộc'];
const popularKeywords = ['Check-in', 'Mùa hè xanh', 'Hội thảo AI'];

const normalizeEventDate = (event: any) => {
  if (event.start_time) {
    return new Date(event.start_time);
  }

  if (event.date) {
    const parts = event.date.split('/');
    if (parts.length === 3) {
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }
  }

  return null;
};

const EventsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('Tất cả');
  const [locationFilter, setLocationFilter] = useState('Mọi nơi');
  const [typeFilter, setTypeFilter] = useState('Tất cả');

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', 'list'],
    queryFn: () => getEvents(),
  });

  const filteredEvents = useMemo(() => {
    const displayEvents = events || [];
    const query = searchQuery.trim().toLowerCase();
    const now = new Date();

    return displayEvents.filter((event: any) => {
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
        typeFilter === 'Tất cả' || type.includes(typeFilter.toLowerCase()) || title.includes(typeFilter.toLowerCase());

      let matchesTime = true;
      if (timeFilter !== 'Tất cả' && eventDate) {
        const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / 86400000);
        if (timeFilter === 'Hôm nay') {
          matchesTime = eventDate.toDateString() === now.toDateString();
        }
        if (timeFilter === 'Tuần này') {
          matchesTime = diffDays >= 0 && diffDays <= 7;
        }
      }

      return matchesQuery && matchesLocation && matchesType && matchesTime;
    });
  }, [events, locationFilter, searchQuery, timeFilter, typeFilter]);

  const renderFilterGroup = (title: string, options: string[], active: string, onChange: (value: string) => void, icon: React.ReactNode) => (
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
              <Text style={[styles.filterChipText, selected && styles.filterChipTextActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <MainHeader>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Sparkles size={22} color={COLORS.warning} />
            <Text style={styles.headerTitle}>Hành trình</Text>
          </View>
          <Text style={styles.headerSub}>Tìm nhanh hoạt động phù hợp theo thời gian, địa điểm và loại sự kiện.</Text>
        </View>
      </MainHeader>

      <FlatList
        data={filteredEvents}
        renderItem={({ item }) => <EventCard event={item} onPress={() => router.push(`/event-detail/${item.id}`)} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.searchSection}>
              <View style={[styles.searchBar, SHADOWS.light]}>
                <SearchIcon size={18} color={COLORS.textMuted} />
                <TextInput
                  placeholder="Tìm sự kiện, đơn vị tổ chức, địa điểm..."
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>

            <View style={styles.suggestionBlock}>
              <Text style={styles.suggestionTitle}>Tìm kiếm gần đây</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                {recentSearches.map((item) => (
                  <Pressable key={item} onPress={() => setSearchQuery(item)} style={({ pressed }) => [styles.suggestionChip, pressed && styles.pressed]}>
                    <Text style={styles.suggestionText}>{item}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.suggestionBlock}>
              <Text style={styles.suggestionTitle}>Từ khóa phổ biến</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                {popularKeywords.map((item) => (
                  <Pressable key={item} onPress={() => setSearchQuery(item)} style={({ pressed }) => [styles.suggestionChip, pressed && styles.pressed]}>
                    <Text style={styles.suggestionText}>{item}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.filtersCard}>
              {renderFilterGroup('Thời gian', timeFilters, timeFilter, setTimeFilter, <Clock3 size={16} color={COLORS.primary} />)}
              {renderFilterGroup('Địa điểm', locationFilters, locationFilter, setLocationFilter, <MapPin size={16} color={COLORS.primary} />)}
              {renderFilterGroup('Loại hoạt động', typeFilters, typeFilter, setTypeFilter, <Shapes size={16} color={COLORS.primary} />)}
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
              <Text style={styles.emptyTitle}>Chưa có dữ liệu phù hợp</Text>
              <Text style={styles.emptyText}>Không tìm thấy sự kiện khớp với bộ lọc hiện tại.</Text>
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
    marginTop: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.white,
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.76)',
    lineHeight: 20,
    maxWidth: '88%',
  },
  listContent: {
    padding: UI.screenPadding,
    paddingTop: 0,
  },
  searchSection: {
    marginTop: 10,
    marginBottom: 18,
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
    fontSize: 15,
    color: COLORS.text,
  },
  suggestionBlock: {
    marginBottom: 16,
  },
  suggestionTitle: {
    color: COLORS.text,
    fontSize: 14,
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
    paddingVertical: 9,
  },
  suggestionText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  filtersCard: {
    backgroundColor: COLORS.surface,
    borderRadius: UI.cardRadius,
    padding: 16,
    marginBottom: 20,
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
    fontSize: 14,
    fontWeight: '700',
  },
  filterChip: {
    borderRadius: UI.chipRadius,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: COLORS.surfaceMuted,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
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
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.96,
  },
});

export default EventsScreen;
