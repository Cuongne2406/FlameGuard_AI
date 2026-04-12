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
  Megaphone
} from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const mockNotifications = [
  {
    id: '1',
    type: 'EVENT',
    title: 'Đăng ký thành công',
    message: 'Bạn đã đăng ký tham gia Mùa Hè Xanh 15/07. Đừng quên chuẩn bị quân trang!',
    time: '2 phút trước',
    isRead: false
  },
  {
    id: '2',
    type: 'SCORE',
    title: 'Cập nhật Điểm rèn luyện',
    message: 'Bạn đã được cộng +5đ vào quỹ Điểm rèn luyện từ hoạt động AI Workshop.',
    time: '1 giờ trước',
    isRead: true
  },
  {
    id: '3',
    type: 'NEWS',
    title: 'Thông báo Đoàn trường',
    message: 'Lịch thi kỹ năng cán bộ Đoàn cấp trường đã được dời sang tuần sau.',
    time: '4 giờ trước',
    isRead: true
  },
  {
    id: '4',
    type: 'REMINDER',
    title: 'Nhắc nhở nộp Đoàn phí',
    message: 'Hạn cuối nộp đoàn phí kỳ 2 là ngày 20/04. Vui lòng hoàn tất đúng hạn.',
    time: '1 ngày trước',
    isRead: true
  }
];

const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  const getIcon = (type: string) => {
    switch(type) {
      case 'EVENT': return <Bell size={20} color={COLORS.primary} />;
      case 'SCORE': return <MessageSquare size={20} color={COLORS.success} />;
      case 'NEWS': return <Info size={20} color={COLORS.warning} />;
      default: return <Bell size={20} color={COLORS.textSecondary} />;
    }
  };

  const getIconBg = (type: string) => {
    switch(type) {
      case 'EVENT': return 'rgba(67, 97, 238, 0.1)';
      case 'SCORE': return 'rgba(76, 175, 80, 0.1)';
      case 'NEWS': return 'rgba(255, 152, 0, 0.1)';
      default: return COLORS.background;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.notificationCard, !item.isRead && styles.unreadCard, SHADOWS.light]}>
      <View style={[styles.iconContainer, { backgroundColor: getIconBg(item.type) }]}>
        {getIcon(item.type)}
      </View>
      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
        <View style={styles.timeRow}>
          <Clock size={12} color={COLORS.textSecondary} />
          <Text style={styles.timeText}>{item.time}</Text>
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
          <TouchableOpacity>
            <Text style={styles.markRead}>Đọc tất cả</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSub}>Chào mừng bạn quay lại với các tin tức mới nhất</Text>
      </View>

      <FlatList
        data={mockNotifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
