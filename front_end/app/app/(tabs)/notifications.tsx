import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  StatusBar,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  Bell,
  Info,
  Clock,
  ChevronRight,
  Megaphone,
  AlertCircle,
  CheckCheck,
  Gift,
} from 'lucide-react-native';
import { COLORS, SHADOWS, UI } from '../../src/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '../../src/api/client';
import { NotificationSkeleton } from '../../src/components/SkeletonLoader';
import MainHeader from '../../src/components/common/MainHeader';

const categoryTabs = ['Tất cả', 'Sự kiện', 'Hệ thống', 'Điểm'];

const getNotificationCategory = (type: string) => {
  switch (type) {
    case 'EVENT':
      return 'Sự kiện';
    case 'SCORE':
      return 'Điểm';
    default:
      return 'Hệ thống';
  }
};

const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState('Tất cả');

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (error) {
      console.error('Error marking read:', error);
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Error marking all read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'EVENT':
        return <Bell size={18} color={COLORS.primary} />;
      case 'SCORE':
        return <Gift size={18} color={COLORS.success} />;
      case 'NEWS':
        return <Megaphone size={18} color={COLORS.warning} />;
      case 'URGENT':
        return <AlertCircle size={18} color={COLORS.danger} />;
      default:
        return <Info size={18} color={COLORS.textSecondary} />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'EVENT':
        return COLORS.primary + '14';
      case 'SCORE':
        return COLORS.success + '14';
      case 'NEWS':
        return COLORS.warning + '14';
      case 'URGENT':
        return COLORS.danger + '14';
      default:
        return COLORS.surfaceMuted;
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const unreadCount = notifications.filter((item) => !item.is_read).length;
  const filteredNotifications = notifications.filter((item) => {
    if (activeCategory === 'Tất cả') {
      return true;
    }
    return getNotificationCategory(item.type) === activeCategory;
  });

  const renderItem = ({ item }: { item: any }) => {
    const category = getNotificationCategory(item.type);

    return (
      <Pressable
        onPress={() => !item.is_read && handleMarkRead(item.id)}
        style={({ pressed }) => [
          styles.notificationCard,
          item.is_read ? styles.readCard : styles.unreadCard,
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: getIconBg(item.type) }]}>{getIcon(item.type)}</View>
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, !item.is_read && styles.unreadText]} numberOfLines={1}>
              {item.title}
            </Text>
            {!item.is_read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
            <View style={styles.timeRow}>
              <Clock size={12} color={COLORS.textMuted} />
              <Text style={styles.timeText}>{formatTime(item.created_at)}</Text>
            </View>
          </View>
        </View>
        <ChevronRight size={18} color={COLORS.textMuted} />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <MainHeader>
        <View style={styles.headerTop}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Thông báo</Text>
            <Text style={styles.headerSub}>Ưu tiên hiển thị thông báo chưa đọc và nhóm theo mục rõ ràng hơn.</Text>
          </View>
          <Pressable onPress={handleReadAll} style={({ pressed }) => [styles.readAllBtn, pressed && styles.pressed]}>
            <CheckCheck size={16} color={COLORS.white} style={{ marginRight: 6 }} />
            <Text style={styles.markRead}>Đọc hết</Text>
          </Pressable>
        </View>

        <View style={styles.unreadSummary}>
          <Text style={styles.unreadCount}>{unreadCount}</Text>
          <Text style={styles.unreadLabel}>thông báo chưa đọc</Text>
        </View>
      </MainHeader>

      <FlatList
        data={filteredNotifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        ListHeaderComponent={
          <View style={styles.filterWrap}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {categoryTabs.map((tab) => {
                const active = tab === activeCategory;
                const count =
                  tab === 'Tất cả'
                    ? notifications.length
                    : notifications.filter((item) => getNotificationCategory(item.type) === tab).length;

                return (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveCategory(tab)}
                    style={({ pressed }) => [styles.filterChip, active && styles.filterChipActive, pressed && styles.pressed]}
                  >
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>
                      {tab} {count ? `(${count})` : ''}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {loading && (
              <View style={{ paddingTop: 12 }}>
                <NotificationSkeleton />
                <NotificationSkeleton />
                <NotificationSkeleton />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Bell size={40} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>Hộp thư trống</Text>
              <Text style={styles.emptySub}>Bạn không có thông báo nào trong nhóm này.</Text>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 4,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 6,
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  unreadSummary: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  unreadCount: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '900',
  },
  unreadLabel: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 14,
    fontWeight: '600',
  },
  readAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: UI.chipRadius,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  markRead: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '800',
  },
  listContent: {
    padding: UI.screenPadding,
    paddingTop: 0,
  },
  filterWrap: {
    marginTop: 10,
    marginBottom: 16,
    zIndex: 20,
  },
  filterRow: {
    gap: 10,
    paddingBottom: 6,
    paddingRight: 20,
  },
  filterChip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: UI.chipRadius,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  filterTextActive: {
    color: COLORS.white,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: UI.cardRadius,
    marginBottom: 14,
    borderWidth: 1,
    ...SHADOWS.light,
  },
  readCard: {
    borderColor: COLORS.border,
  },
  unreadCard: {
    borderColor: COLORS.primary + '25',
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  unreadText: {
    fontWeight: '900',
    color: COLORS.black,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: UI.chipRadius,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },
});

export default NotificationsScreen;
