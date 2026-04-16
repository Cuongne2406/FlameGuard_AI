import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar
} from 'react-native';
import { 
  Bell, 
  MessageSquare, 
  Info, 
  Clock, 
  ChevronRight,
  Megaphone,
  AlertCircle,
  CheckCheck
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
      case 'EVENT': return <Bell size={18} color={COLORS.primary} />;
      case 'SCORE': return <MessageSquare size={18} color={COLORS.success} />;
      case 'NEWS': return <Megaphone size={18} color={COLORS.warning} />;
      case 'URGENT': return <AlertCircle size={18} color={COLORS.danger} />;
      default: return <Info size={18} color={COLORS.textSecondary} />;
    }
  };

  const getIconBg = (type: string) => {
    switch(type) {
      case 'EVENT': return COLORS.primary + '10';
      case 'SCORE': return COLORS.success + '10';
      case 'NEWS': return COLORS.warning + '10';
      case 'URGENT': return COLORS.danger + '10';
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
      activeOpacity={0.7}
      onPress={() => !item.is_read && handleMarkRead(item.id)}
      style={[
        styles.notificationCard, 
        !item.is_read ? styles.unreadCard : styles.readCard, 
        !item.is_read ? SHADOWS.medium : SHADOWS.light
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconBg(item.type) }]}>
        {getIcon(item.type)}
      </View>
      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, !item.is_read && styles.unreadText]} numberOfLines={1}>{item.title}</Text>
          {!item.is_read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
        <View style={styles.timeRow}>
          <Clock size={12} color={COLORS.textMuted} />
          <Text style={styles.timeText}>{formatTime(item.created_at)}</Text>
        </View>
      </View>
      <ChevronRight size={18} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Thông báo</Text>
          <TouchableOpacity onPress={handleReadAll} style={styles.readAllBtn}>
            <CheckCheck size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={styles.markRead}>Đã đọc hết</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSub}>Theo dõi những cập nhật quan trọng từ YouthHub</Text>
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
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                 <Bell size={40} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>Hộp thư trống</Text>
              <Text style={styles.emptySub}>Bạn không có thông báo nào trong lúc này.</Text>
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
    paddingBottom: 24,
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    zIndex: 10,
    ...SHADOWS.light,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -1,
  },
  headerSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    lineHeight: 20,
  },
  readAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  markRead: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '900',
  },
  listContent: {
    padding: 20,
    paddingTop: 24,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
  },
  readCard: {
    borderColor: '#F1F5F9',
  },
  unreadCard: {
    borderColor: COLORS.primary + '20',
    backgroundColor: COLORS.white,
  },
  iconContainer: {
    width: 50,
    height: 50,
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
    fontWeight: '500',
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
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    fontWeight: '600',
  }
});

export default NotificationsScreen;
