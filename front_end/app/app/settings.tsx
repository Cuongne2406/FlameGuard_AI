import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  User, 
  ShieldCheck, 
  Bell, 
  HelpCircle, 
  LogOut, 
  Smartphone,
  ChevronRight,
  UserCircle
} from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../src/constants/theme';
import { useAuth } from '../src/context/AuthContext';

interface SettingItemProps {
  icon: any;
  title: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  color?: string;
}

const SettingsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);

  if (!user) return null;

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất khỏi YouthHub?",
      [
        {"text": "Hủy", "style": "cancel"},
        {
          "text": "Đăng xuất", 
          "onPress": async () => {
            await logout();
            // AuthContext redirection logic in _layout.tsx will handle the rest
          }, 
          "style": "destructive"
        }
      ]
    );
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    value, 
    onPress, 
    showArrow = true, 
    color = COLORS.text 
  }: SettingItemProps) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}10` }]}>
          <Icon size={20} color={color} />
        </View>
        <Text style={[styles.settingTitle, { color }]}>{title}</Text>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {showArrow && <ChevronRight size={18} color={COLORS.border} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt tài khoản</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Info Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarPlaceholder}>
            <UserCircle size={80} color={COLORS.primary} strokeWidth={1} />
          </View>
          <Text style={styles.userName}>{user.full_name}</Text>
          <Text style={styles.userSub}>{user.student_id} • {user.class_name || 'Đoàn viên'}</Text>
        </View>

        {/* Account Details Group */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>Thông tin cá nhân</Text>
          <View style={[styles.groupCard, SHADOWS.light]}>
            <SettingItem icon={User} title="Họ và tên" value={user.full_name} showArrow={false} />
            <View style={styles.divider} />
            <SettingItem icon={Smartphone} title="Số điện thoại" value={user.phone_number || 'Chưa cập nhật'} showArrow={false} />
            <View style={styles.divider} />
            <SettingItem icon={HelpCircle} title="Email" value={user.email} showArrow={false} />
          </View>
        </View>

        {/* Security Group */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>Bảo mật & Thiết bị</Text>
          <View style={[styles.groupCard, SHADOWS.light]}>
            <SettingItem 
              icon={Smartphone} 
              title="Mã thiết bị hiện tại" 
              value={user.device_id ? user.device_id.substring(0, 8) + "..." : "Chưa liên kết"} 
              onPress={() => Alert.alert("Thông tin thiết bị", `ID: ${user.device_id || 'Chưa xác định'}\n\nMã này dùng để xác thực check-in chính chủ.`)}
            />
            <View style={styles.divider} />
            <SettingItem icon={ShieldCheck} title="Thay đổi mật khẩu" onPress={() => {}} />
          </View>
        </View>

        {/* Preferences Group */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>Tùy chọn</Text>
          <View style={[styles.groupCard, SHADOWS.light]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${COLORS.secondary}10` }]}>
                  <Bell size={20} color={COLORS.secondary} />
                </View>
                <Text style={styles.settingTitle}>Thông báo sự kiện</Text>
              </View>
              <Switch 
                value={isNotificationsEnabled} 
                onValueChange={setIsNotificationsEnabled}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>
            <View style={styles.divider} />
            <SettingItem icon={HelpCircle} title="Hỗ trợ kỹ thuật" onPress={() => {}} />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Đăng xuất khỏi hệ thống</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>YouthHub Version 1.0.0 (Stable)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  group: {
    marginBottom: 25,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 10,
  },
  groupCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.background,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 20,
    marginTop: 10,
    gap: 10,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 30,
    color: COLORS.border,
    fontSize: 12,
  }
});

export default SettingsScreen;
