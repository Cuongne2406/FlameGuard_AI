import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  ChevronLeft,
  User,
  ShieldCheck,
  Bell,
  HelpCircle,
  LogOut,
  Smartphone,
  ChevronRight,
  UserCircle,
  GraduationCap,
  BookOpen,
  Edit3,
  CheckCircle2,
  Lock,
  Camera,
} from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../src/constants/theme';
import { useAuth } from '../src/context/AuthContext';
import { updateUser, uploadAvatar } from '../src/api/client';
import GlassCard from '../src/components/common/GlassCard';
import PremiumButton from '../src/components/common/PremiumButton';
import FormInput from '../src/components/common/FormInput';
import { useQueryClient } from '@tanstack/react-query';

interface SettingFormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: React.ReactNode;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
}

const SettingFormInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1
}: SettingFormInputProps) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      {icon && <View style={styles.inputIcon}>{icon}</View>}
      <TextInput
        style={[
          styles.textInput,
          multiline && { height: Math.max(80, numberOfLines * 25), textAlignVertical: 'top', paddingTop: 12 }
        ]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  </View>
);

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
  const queryClient = useQueryClient();
  const { user, logout, refreshUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    class_name: '',
    bio: '',
    academic_year: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        class_name: user.class_name || '',
        bio: user.bio || '',
        academic_year: user.academic_year ? String(user.academic_year) : ''
      });
    }
  }, [user]);

  if (!user) return null;

  const handlePickImage = async () => {
    if (user.is_profile_updated) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Bạn cần cho phép truy cập Thư viện ảnh để thực hiện việc này.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      setIsAvatarUploading(true);
      try {
        await uploadAvatar(result.assets[0].uri);
        await refreshUser();
      } catch (error: any) {
        Alert.alert('Lỗi', 'Không thể tải lên ảnh đại diện.');
      } finally {
        setIsAvatarUploading(false);
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const submitData: any = {
        ...formData,
        is_completing: true
      };
      if (formData.academic_year) {
        submitData.academic_year = parseInt(formData.academic_year, 10);
      }

      await updateUser(submitData);
      await refreshUser();
      setIsEditing(false);
      Alert.alert("Thành công", "Hồ sơ của bạn đã được xác thực hoàn tất. Các thông tin hiện đã được khóa vĩnh viễn.");
    } catch (error: any) {
      const detail = error.response?.data?.detail || "Không thể cập nhật hồ sơ.";
      Alert.alert("Lỗi", detail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất khỏi YouthHub?",
      [
        { "text": "Hủy", "style": "cancel" },
        {
          "text": "Đăng xuất",
          "onPress": async () => {
            setIsLoggingOut(true);
            try {
              await logout();
              await queryClient.clear();
              router.replace('/login');
            } finally {
              setIsLoggingOut(false);
            }
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
        <Text style={[styles.settingTitle, { color }]} numberOfLines={1}>{title}</Text>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue} numberOfLines={1} ellipsizeMode="tail">{value}</Text>}
        {showArrow && <ChevronRight size={16} color={COLORS.textSecondary} />}
      </View>
    </TouchableOpacity>
  );

  const canEdit = !user.is_profile_updated;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt hệ thống</Text>
        <View style={{ width: 44, height: 44 }}>
          {canEdit && !isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.backButton}>
              <Edit3 size={20} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <GlassCard style={styles.profileCard} contentStyle={styles.profileCardContent}>
          <View style={styles.profileInfo}>
            <TouchableOpacity
              activeOpacity={canEdit ? 0.8 : 1}
              onPress={handlePickImage}
              disabled={!canEdit}
              style={styles.avatarWrapper}
            >
              <View style={styles.avatarContainer}>
                {isAvatarUploading ? (
                  <ActivityIndicator color={COLORS.primary} />
                ) : user.avatar_url ? (
                  <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
                ) : (
                  <UserCircle size={80} color={COLORS.primary} strokeWidth={1} />
                )}

                {canEdit && (
                  <View style={styles.cameraBadge}>
                    <Camera size={14} color={COLORS.white} />
                  </View>
                )}
              </View>
              {user.is_profile_updated && (
                <View style={styles.verifiedBadge}>
                  <CheckCircle2 size={24} color={COLORS.white} fill={COLORS.success} />
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.userName}>{user.full_name}</Text>
            <Text style={styles.userSub}>{user.student_id} • {user.class_name || 'Đoàn viên'}</Text>

            {!canEdit && (
              <View style={styles.lockBadge}>
                <Lock size={12} color={COLORS.textSecondary} />
                <Text style={styles.lockText}>Tài khoản đã được xác thực</Text>
              </View>
            )}
          </View>
        </GlassCard>

        {isEditing ? (
          <View style={styles.editForm}>
            <View style={styles.formHeader}>
              <Text style={styles.groupTitle}>Hoàn thiện hồ sơ sinh viên</Text>
              <ShieldCheck size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.noticeText}>Lưu ý: Bạn chọn ảnh đại diện từ Album và điền đúng thông tin. Khi nhấn Lưu, toàn bộ hồ sơ (bao gồm cả ảnh) sẽ được khóa vĩnh viễn.</Text>

            <SettingFormInput
              label="Họ và tên"
              placeholder="Nhập họ và tên đầy đủ"
              value={formData.full_name}
              onChangeText={(txt: string) => setFormData(p => ({ ...p, full_name: txt }))}
              icon={<User size={20} color={COLORS.textSecondary} />}
            />

            <SettingFormInput
              label="Email liên hệ"
              placeholder="nhuy.nguyen@student.edu.vn"
              value={formData.email}
              onChangeText={(txt: string) => setFormData(p => ({ ...p, email: txt }))}
              icon={<HelpCircle size={20} color={COLORS.textSecondary} />}
              keyboardType="email-address"
            />

            <SettingFormInput
              label="Số điện thoại"
              placeholder="09xx xxx xxx"
              value={formData.phone_number}
              onChangeText={(txt: string) => setFormData(p => ({ ...p, phone_number: txt }))}
              icon={<Smartphone size={20} color={COLORS.textSecondary} />}
              keyboardType="phone-pad"
            />

            <SettingFormInput
              label="Tên lớp / Đơn vị"
              placeholder="Ví dụ: 21DTHD2"
              value={formData.class_name}
              onChangeText={(txt: string) => setFormData(p => ({ ...p, class_name: txt }))}
              icon={<GraduationCap size={20} color={COLORS.textSecondary} />}
            />

            <SettingFormInput
              label="Năm học / Khóa"
              placeholder="Ví dụ: 2021"
              value={formData.academic_year}
              onChangeText={(txt: string) => setFormData(p => ({ ...p, academic_year: txt }))}
              icon={<BookOpen size={20} color={COLORS.textSecondary} />}
              keyboardType="numeric"
            />

            <SettingFormInput
              label="Tiểu sử bản thân"
              placeholder="Giới thiệu ngắn về bản thân..."
              value={formData.bio}
              onChangeText={(txt: string) => setFormData(p => ({ ...p, bio: txt }))}
              multiline
              numberOfLines={3}
            />

            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsEditing(false)}
                disabled={isLoading}
              >
                <Text style={styles.cancelText}>Hủy bỏ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, (isLoading || isAvatarUploading) && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={isLoading || isAvatarUploading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.saveText}>Xác nhận & Lưu</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.group}>
              <Text style={styles.groupTitle}>Thông tin tài khoản</Text>
              <GlassCard style={styles.groupGlass} contentStyle={{ paddingHorizontal: 5, paddingVertical: 10 }}>
                <SettingItem icon={User} title="Họ và tên" value={user.full_name} showArrow={false} />
                <View style={styles.divider} />
                <SettingItem icon={Smartphone} title="Số điện thoại" value={user.phone_number || 'Chưa cập nhật'} showArrow={false} />
                <View style={styles.divider} />
                <SettingItem icon={HelpCircle} title="Email liên hệ" value={user.email} showArrow={false} />
                <View style={styles.divider} />
                <SettingItem icon={BookOpen} title="Tiểu sử" value={user.bio || 'Chưa có thông tin'} showArrow={false} />
              </GlassCard>
            </View>

            <View style={styles.group}>
              <Text style={styles.groupTitle}>Bảo mật & Định danh</Text>
              <GlassCard style={styles.groupGlass} contentStyle={{ paddingHorizontal: 5, paddingVertical: 10 }}>
                <SettingItem
                  icon={Smartphone}
                  title="Thiết bị liên kết"
                  value={user.device_id ? user.device_id.substring(0, 10).toUpperCase() : "Chưa xác thực"}
                  onPress={() => Alert.alert("Mã định danh thiết bị", user.device_id || "Thiết bị chưa được gắn mã định danh.")}
                />
                <View style={styles.divider} />
                <SettingItem icon={ShieldCheck} title="Thay đổi mã PIN / Mật khẩu" onPress={() => { }} />
              </GlassCard>
            </View>

            <View style={styles.group}>
              <Text style={styles.groupTitle}>Cá nhân hóa</Text>
              <GlassCard style={styles.groupGlass} contentStyle={{ paddingHorizontal: 5, paddingVertical: 10 }}>
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
                <SettingItem icon={HelpCircle} title="Điều khoản & Hỗ trợ" onPress={() => { }} />
              </GlassCard>
            </View>

            <View style={styles.logoutWrapper}>
              <PremiumButton
                title="Đăng xuất khỏi YouthHub"
                onPress={handleLogout}
                loading={isLoggingOut}
                disabled={isLoggingOut}
                variant="danger"
                icon={<LogOut size={20} color={COLORS.white} />}
                style={styles.logoutBtn}
              />
            </View>

            <Text style={styles.versionText}>YouthHub Platform • Build 1528 (v1.2.0)</Text>
          </>
        )}
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
    backgroundColor: COLORS.background, // Match screen background instead of harsh white
    zIndex: 100,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.white, // Pop out slightly
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  scrollContent: {
    paddingHorizontal: 20, // Increase horizontal padding a bit
    paddingVertical: 10, // Bring it closer to header
    paddingBottom: 60,
  },
  profileCard: {
    marginBottom: 35,
    borderRadius: 28,
    borderWidth: 0, // Ensure no outer border causing thickness
  },
  profileCardContent: {
    padding: 30, // Inner padding for GlassCard
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  verifiedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 10,
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
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  lockText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
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
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    maxWidth: '50%',
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
    marginHorizontal: 12,
  },
  editForm: {
    marginBottom: 30,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  noticeText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '600',
    marginBottom: 20,
    paddingHorizontal: 5,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  editActions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  saveBtn: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
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
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    minHeight: 56,
    ...SHADOWS.light,
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default SettingsScreen;
