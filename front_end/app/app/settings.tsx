import React, { useState } from 'react';
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
import GlassCard from '../src/components/common/GlassCard';
import PremiumButton from '../src/components/common/PremiumButton';

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
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

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
          <Icon size={18} color={color} />
        </View>
        <Text style={[styles.settingTitle, { color }]}>{title}</Text>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {showArrow && <ChevronRight size={16} color={COLORS.textSecondary} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt hệ thống</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Profile Summary */}
        <GlassCard style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <UserCircle size={80} color={COLORS.primary} strokeWidth={1} />
            </View>
            <Text style={styles.userName}>{user.full_name}</Text>
            <Text style={styles.userSub}>{user.student_id} • {user.class_name || 'Đoàn viên'}</Text>
          </View>
        </GlassCard>

        {/* Account Details Group */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>Thông tin tài khoản</Text>
          <GlassCard style={styles.groupGlass}>
            <SettingItem icon={User} title="Họ và tên" value={user.full_name} showArrow={false} />
            <View style={styles.divider} />
            <SettingItem icon={Smartphone} title="Số điện thoại" value={user.phone_number || 'Chưa cập nhật'} showArrow={false} />
            <View style={styles.divider} />
            <SettingItem icon={HelpCircle} title="Email liên hệ" value={user.email} showArrow={false} />
          </GlassCard>
        </View>

        {/* Security Group */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>Bảo mật & Định danh</Text>
          <GlassCard style={styles.groupGlass}>
            <SettingItem 
              icon={Smartphone} 
              title="Thiết bị liên kết" 
              value={user.device_id ? user.device_id.substring(0, 10).toUpperCase() : "Chưa xác thực"} 
              onPress={() => Alert.alert("Mã định danh thiết bị", user.device_id || "Thiết bị chưa được gắn mã định danh.")}
            />
            <View style={styles.divider} />
            <SettingItem icon={ShieldCheck} title="Thay đổi mã PIN / Mật khẩu" onPress={() => {}} />
          </GlassCard>
        </View>

        {/* Preferences Group */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>Cá nhân hóa</Text>
          <GlassCard style={styles.groupGlass}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${COLORS.secondary}15` }]}>
                  <Bell size={18} color={COLORS.secondary} />
                </View>
                <Text style={styles.settingTitle}>Thông báo đẩy (Push)</Text>
              </View>
              <Switch 
                value={isNotificationsEnabled} 
                onValueChange={setIsNotificationsEnabled}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>
            <View style={styles.divider} />
            <SettingItem icon={HelpCircle} title="Điều khoản & Hỗ trợ" onPress={() => {}} />
          </GlassCard>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutWrapper}>
          <PremiumButton 
            title="Đăng xuất khỏi YouthHub" 
            onPress={handleLogout}
            variant="danger"
            icon={<LogOut size={20} color={COLORS.white} />}
            style={styles.logoutBtn}
          />
        </View>
        
        <Text style={styles.versionText}>YouthHub Platform • Build 1024 (v1.0.0)</Text>
      </ScrollView>
    </View>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.surface,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  profileCard: {
    marginBottom: 30,
    padding: 30,
    borderRadius: 28,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 4,
  },
  userSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  group: {
    marginBottom: 30,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginLeft: 5,
  },
  groupGlass: {
    padding: 0,
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
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
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
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    marginHorizontal: 16,
  },
  logoutWrapper: {
    marginTop: 10,
  },
  logoutBtn: {
    height: 60,
  },
  versionText: {
    textAlign: 'center',
    marginTop: 40,
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.6,
  }
});

export default SettingsScreen;
