import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  StatusBar,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Search, Filter, Rocket, Sparkles } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import { mockEvents, mockUser } from '../../src/api/mockData';
import EventCard from '../../src/components/EventCard';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Section - Modern Gradient Header */}
      <LinearGradient
        colors={[COLORS.gradient[0], COLORS.gradient[1], COLORS.gradient[2]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 15 }]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Chào buổi sáng,</Text>
            <Text style={styles.userName}>{mockUser.full_name} ✨</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color={COLORS.white} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* User Score Summary Card - Now integrated into the header flow */}
        <View style={[styles.scoreCard, SHADOWS.medium]}>
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreLabel}>ĐIỂM RÈN LUYỆN</Text>
            <Text style={styles.scoreValue}>{mockUser.training_score}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreLabel}>LEVEL</Text>
            <Text style={styles.scoreValue}>{mockUser.level}</Text>
          </View>
          <TouchableOpacity 
            style={styles.scoreAction}
            onPress={() => router.push('/profile')}
          >
            <Rocket size={18} color={COLORS.primary} />
            <Text style={styles.actionText}>Review</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingBottom: insets.bottom + 120 }
        ]}
      >
        {/* Search Bar - Positioned outside header to avoid overlapping */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, SHADOWS.light]}>
            <Search size={20} color={COLORS.textSecondary} />
            <TextInput 
              placeholder="Tìm kiếm sự kiện, hoạt động..." 
              style={styles.searchInput}
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
          <TouchableOpacity style={[styles.filterButton, SHADOWS.light]}>
            <Filter size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Hot Events Carousel */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Sparkles size={20} color={COLORS.warning} />
            <Text style={styles.sectionTitle}>Sự kiện Nổi bật</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={mockEvents}
          renderItem={({ item }) => (
            <EventCard 
              event={item} 
              horizontal 
              onPress={() => router.push(`/event-detail/${item.id}`)} 
            />
          )}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
        />

        {/* Upcoming Activities */}
        <View style={[styles.sectionHeader, { marginTop: SIZES.padding }]}>
          <Text style={styles.sectionTitle}>Hoạt động sắp tới</Text>
          <TouchableOpacity onPress={() => router.push('/events')}>
            <Text style={styles.viewAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activitiesList}>
          {mockEvents.map(event => (
            <EventCard 
              key={event.id}
              event={event} 
              onPress={() => router.push(`/event-detail/${event.id}`)} 
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Scan QR Button */}
      <TouchableOpacity 
        style={[styles.floatingScanBtn, SHADOWS.medium]}
        onPress={() => router.push('/scan-qr')}
      >
        <LinearGradient
          colors={[COLORS.primary, '#3A0CA3']}
          style={styles.scanGradient}
        >
          <View style={styles.scanIconBox}>
            <Search size={24} color={COLORS.white} /> 
            {/* Note: In a real app we'd use a QR icon, but Search is close to 'scan' in some icon sets. I'll use Lucide's Scan if possible or just ViewFinder */}
          </View>
          <Text style={styles.scanText}>Check-in</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingBottom: SIZES.padding * 2.5,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    zIndex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding * 1.5,
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: SIZES.body,
  },
  userName: {
    color: COLORS.white,
    fontSize: SIZES.h2,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.danger,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  scoreCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    ...(Platform.OS === 'ios' ? SHADOWS.medium : { elevation: 6 })
  },
  scoreInfo: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '700',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: COLORS.border,
  },
  scoreAction: {
    backgroundColor: 'rgba(0, 82, 212, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: SIZES.padding * 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginTop: 20,
    marginBottom: SIZES.padding,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    height: 55,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    height: '100%',
  },
  filterButton: {
    width: 55,
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius * 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.base * 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  viewAll: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  carouselContent: {
    paddingLeft: SIZES.padding,
  },
  activitiesList: {
    paddingHorizontal: SIZES.padding,
  },
  floatingScanBtn: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 30,
    overflow: 'hidden',
  },
  scanGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  scanIconBox: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default HomeScreen;
