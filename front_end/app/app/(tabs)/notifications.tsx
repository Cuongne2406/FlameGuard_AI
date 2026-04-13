import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  Platform
} from 'react-native';
import { 
  Bell, 
  MessageSquare, 
  Info, 
  Clock, 
  ChevronRight,
  Megaphone,
  AlertCircle
} from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '../../src/api/client';
import { RefreshControl } from 'react-native';
import { NotificationSkeleton } from '../../src/components/SkeletonLoader';

const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

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
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error('Error marking read:', error);
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Error marking all read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'EVENT': return <Bell size={20} color={COLORS.primary} />;
      case 'SCORE': return <MessageSquare size={20} color={COLORS.success} />;
      case 'NEWS': return <Info size={20} color={COLORS.warning} />;
      case 'URGENT': return <AlertCircle size={20} color={COLORS.error} />;
      default: return <Bell size={20} color={COLORS.textSecondary} />;
    }
  };

  const getIconBg = (type: string) => {
    switch(type) {
      case 'EVENT': return 'rgba(67, 97, 238, 0.1)';
      case 'SCORE': return 'rgba(76, 175, 80, 0.1)';
      case 'NEWS': return 'rgba(255, 152, 0, 0.1)';
      case 'URGENT': return 'rgba(239, 35, 60, 0.1)';
      default: return COLORS.background;
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

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      onPress={() => !item.is_read && handleMarkRead(item.id)}
      style={[styles.notificationCard, !item.is_read && styles.unreadCard, SHADOWS.light]}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconBg(item.type) }]}>
        {getIcon(item.type)}
      </View>
      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, !item.is_read && styles.unreadText]}>{item.title}</Text>
          {!item.is_read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
        <View style={styles.timeRow}>
          <Clock size={12} color={COLORS.textSecondary} />
          <Text style={styles.timeText}>{formatTime(item.created_at)}</Text>
        </View>
      </View>
      <ChevronRight size={18} color={COLORS.border} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 15 }, SHADOWS.light]}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Thông báo</Text>
          <TouchableOpacity onPress={handleReadAll}>
            <Text style={styles.markRead}>Đọc tất cả</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSub}>Chào mừng bạn quay lại với các tin tức mới nhất</Text>
      </View>

      {loading ? (
        <View style={{ padding: 20 }}>
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
          ListEmptyComponent={
            <View style={{ marginTop: 100, alignItems: 'center' }}>
              <Bell size={60} color={COLORS.border} />
              <Text style={{ marginTop: 16, color: COLORS.textSecondary }}>Không có thông báo nào</Text>
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
    paddingBottom: 25,
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  markRead: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    ...(Platform.OS === 'ios' ? SHADOWS.light : { elevation: 2 })
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    backgroundColor: '#F0F4FF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
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
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  unreadText: {
    fontWeight: '800',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  message: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  }
});

export default NotificationsScreen;
