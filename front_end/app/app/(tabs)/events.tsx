import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import EventCard from '../../src/components/EventCard';
import { getEvents } from '../../src/api/client';
import { useQuery } from '@tanstack/react-query';
import GlassCard from '../../src/components/common/GlassCard';
import { Search as SearchIcon, Filter as FilterIcon } from 'lucide-react-native';

const EventsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', 'list'],
    queryFn: () => getEvents(),
  });

  const displayEvents = events || [];

  const filteredEvents = displayEvents.filter((event: any) => 
    (event.name || event.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.organization_name || event.organizer || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
        <Text style={styles.headerTitle}>Hành trình Sự kiện</Text>
        <Text style={styles.headerSub}>Khám phá các hoạt động Đoàn - Hội mới nhất</Text>
      </View>

      <View style={styles.searchSection}>
        <GlassCard style={styles.searchGlass} gradientColors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.9)']}>
          <View style={styles.searchRow}>
            <View style={styles.searchInputContainer}>
              <SearchIcon size={20} color={COLORS.textSecondary} />
              <TextInput
                placeholder="Tìm kiếm sự kiện, hoạt động..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
            <TouchableOpacity style={styles.filterBtn}>
              <FilterIcon size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </GlassCard>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải sự kiện...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={({ item }) => (
            <EventCard 
              event={item} 
              onPress={() => router.push(`/event-detail/${item.id}`)} 
            />
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Không tìm thấy sự kiện nào.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 6,
    fontWeight: '500',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: -30, 
    zIndex: 20,
  },
  searchGlass: {
    padding: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(241, 243, 245, 0.8)',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.text,
  },
  filterBtn: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(241, 243, 245, 0.8)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: SIZES.padding,
    paddingTop: 24,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  }
});

export default EventsScreen;
