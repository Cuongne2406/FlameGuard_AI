import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search as SearchIcon, Filter as FilterIcon, Sparkles } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import EventCard from '../../src/components/EventCard';
import { getEvents } from '../../src/api/client';
import { useQuery } from '@tanstack/react-query';
import GlassCard from '../../src/components/common/GlassCard';

import MainHeader from '../../src/components/common/MainHeader';

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
      <StatusBar barStyle="light-content" />
      
      {/* Premium Header Gradient */}
      <MainHeader>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
             <Sparkles size={24} color={COLORS.warning} style={{ marginRight: 10 }} />
             <Text style={styles.headerTitle}>Hành trình</Text>
          </View>
          <Text style={styles.headerSub}>Khám phá các hoạt động Đoàn - Hội mới nhất từ YouthHub</Text>
        </View>
      </MainHeader>

      {/* Modern Search Bar - Floating Style */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, SHADOWS.medium]}>
          <View style={styles.searchInputWrapper}>
            <SearchIcon size={20} color={COLORS.textMuted} />
            <TextInput
              placeholder="Tìm kiếm sự kiện, hoạt động..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <FilterIcon size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang cập nhật sự kiện...</Text>
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
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Rất tiếc, chưa tìm thấy sự kiện nào khớp với yêu cầu của bạn.</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 55,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 10,
  },
  headerContent: {
    marginTop: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -1,
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    lineHeight: 20,
    maxWidth: '85%',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: -30, 
    zIndex: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.text,
    height: 50,
    fontWeight: '600',
  },
  filterBtn: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingTop: 24,
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
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  }
});

export default EventsScreen;
