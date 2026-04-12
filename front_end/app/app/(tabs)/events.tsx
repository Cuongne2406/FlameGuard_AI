import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  Image,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  ChevronRight,
  Trophy
} from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import { mockEvents } from '../../src/api/mockData';

const EventsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = mockEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEventItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.eventCard, SHADOWS.light]}
      onPress={() => router.push(`/event-detail/${item.id}`)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <View style={styles.badgeRow}>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'Upcoming' ? 'rgba(67, 97, 238, 0.1)' : 'rgba(76, 175, 80, 0.1)' }]}>
            <Text style={[styles.statusText, { color: item.status === 'Upcoming' ? COLORS.primary : COLORS.success }]}>{item.status}</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Trophy size={12} color={COLORS.warning} />
            <Text style={styles.pointsText}>+{item.points}đ</Text>
          </View>
        </View>
        <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.organizerText}>{item.organizer}</Text>
        
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Calendar size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{item.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <MapPin size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>{item.location}</Text>
          </View>
        </View>
      </View>
      <ChevronRight size={18} color={COLORS.border} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 15 }, SHADOWS.light]}>
        <Text style={styles.headerTitle}>Hành trình Sự kiện</Text>
        <Text style={styles.headerSub}>Khám phá các hoạt động Đoàn - Hội mới nhất</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, SHADOWS.light]}>
          <Search size={22} color={COLORS.textSecondary} />
          <TextInput
            placeholder="Tìm kiếm sự kiện, hoạt động..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
        <TouchableOpacity style={[styles.filterButton, SHADOWS.light]}>
          <Filter size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredEvents}
        renderItem={renderEventItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Không tìm thấy sự kiện nào khớp với tìm kiếm.</Text>
          </View>
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
  header: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 25,
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
    fontWeight: '500',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginTop: 20,
    marginBottom: SIZES.padding,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius * 1.2,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.text,
  },
  filterButton: {
    width: 55,
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius * 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: SIZES.padding,
    paddingTop: 0,
  },
  eventCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 16,
    ...(Platform.OS === 'ios' ? SHADOWS.light : { elevation: 3 })
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
  },
  eventInfo: {
    flex: 1,
    marginLeft: 15,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  statusBadge: {
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  pointsText: {
    fontSize: 10,
    color: COLORS.warning,
    fontWeight: '700',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  organizerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  }
});

export default EventsScreen;
