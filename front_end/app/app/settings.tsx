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
  Dimensions,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
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
  Mail,
  Zap,
  Info
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../src/constants/theme';
import { useAuth } from '../src/context/AuthContext';
import { updateUser, uploadAvatar } from '../src/api/client';
import GlassCard from '../src/components/common/GlassCard';

const { width } = Dimensions.get('window');

// Premium Color System
const THEME = {
  primary: '#4F46E5', // Indigo 600
  primaryLight: '#EEF2FF', 
  primaryDark: '#3730A3',
  secondary: '#6366F1', // Indigo 500
  text: '#1E293B', // Slate 800
  textSecondary: '#64748B', // Slate 500
  textMuted: '#94A3B8', // Slate 400
  accent: '#F59E0B',
  white: '#FFFFFF',
  border: '#F1F5F9',
  error: '#EF4444',
  success: '#10B981',
  bgGradient: ['#F8FAFC', '#F1F5F9'] as const,
};

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
        placeholderTextColor={THEME.textMuted}
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
  isVertical?: boolean;
}

const SettingItem = ({ 
  icon: Icon, 
  title, 
  value, 
  onPress, 
  showArrow = true, 
  color = THEME.primary,
  isVertical = false
}: SettingItemProps) => (
  <TouchableOpacity 
    style={[styles.settingItem, isVertical ? styles.settingItemVertical : null]} 
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    disabled={!onPress}
  >
    <View style={[styles.itemLeftPart, isVertical ? { flex: 0, width: '100%', marginBottom: 10 } : null]}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}12` }]}>
        <Icon size={18} color={color} />
      </View>
      <Text style={styles.settingTitle}>{title}</Text>
    </View>
    
    <View style={[styles.itemRightPart, isVertical ? styles.itemRightVertical : null]}>
      {value && (
        <Text 
          style={[styles.settingValue, isVertical ? styles.settingValueVertical : null]} 
          numberOfLines={isVertical ? 3 : 1}
          ellipsizeMode="middle"
        >
          {value}
        </Text>
      )}
      {showArrow && (
        <ChevronRight 
          size={16} 
          color={THEME.textMuted} 
          style={isVertical ? { position: 'absolute', right: 0, top: -28 } : null} 
        />
      )}
    </View>
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout, refreshUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      Alert.alert("Thông báo", detail);
    } finally {
      setIsLoading(false);
    }
  };

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

  const canEdit = !user.is_profile_updated;

  return (
    <View style={[styles.container as ViewStyle, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[THEME.primaryLight, '#FFFFFF']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.35 }}
      />

      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={22} color={THEME.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
        <View style={{ width: 44, alignItems: 'center' }}>
          {canEdit && !isEditing && (
            <TouchableOpacity 
              onPress={() => setIsEditing(true)}
              style={styles.editIconBtn}
            >
              <Edit3 size={18} color={THEME.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <GlassCard style={styles.profileCard as ViewStyle}>
          <View style={styles.profileInfo}>
            <TouchableOpacity 
              activeOpacity={canEdit ? 0.8 : 1}
              onPress={handlePickImage}
              disabled={!canEdit}
              style={styles.avatarWrapper}
            >
              <LinearGradient
                colors={[THEME.primary, THEME.secondary]}
                style={styles.avatarRing}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.avatarContainer}>
                {isAvatarUploading ? (
                  <ActivityIndicator color={THEME.primary} size="small" />
                ) : user.avatar_url ? (
                  <Image source={{ uri: user.avatar_url }} style={styles.avatarImage as ImageStyle} />
                ) : (
                  <UserCircle size={80} color={THEME.primary} strokeWidth={1} />
                )}
                
                {canEdit && (
                  <View style={styles.cameraBadge}>
                    <Camera size={12} color={THEME.white} />
                  </View>
                )}
              </View>
              {user.is_profile_updated && (
                <View style={styles.verifiedBadge}>
                  <CheckCircle2 size={26} color={THEME.white} fill={THEME.success} />
                </View>
              )}
            </TouchableOpacity>
            
            <Text style={styles.userName}>{user.full_name}</Text>
            <View style={styles.userSubRow}>
              <Text style={styles.userSubText}>{user.student_id}</Text>
              <View style={styles.dot} />
              <Text style={styles.userSubText}>{user.class_name || 'D-Core Member'}</Text>
            </View>
            
            {!canEdit && (
              <View style={styles.lockBadge}>
                <Lock size={12} color="#059669" />
                <Text style={styles.lockText}>Thông tin đã xác thực</Text>
              </View>
            )}
          </View>
        </GlassCard>

        {isEditing ? (
          <View style={styles.editForm}>
            <View style={styles.formSectionHeader}>
              <Zap size={16} color={THEME.primary} style={{ marginRight: 8 }} />
              <Text style={styles.groupTitle}>Hoàn thiện dữ liệu ban đầu</Text>
            </View>
            
            <View style={styles.warningBox}>
              <Info size={16} color={THEME.error} />
              <Text style={styles.warningText}>
                Hệ thống chỉ cho phép cập nhật <Text style={{ fontWeight: '900' }}>01 LẦN DUY NHẤT</Text>. Dữ liệu sẽ bị khóa sau khi lưu.
              </Text>
            </View>
            
            <SettingFormInput
              label="Họ và tên"
              placeholder="Họ và tên đầy đủ"
              value={formData.full_name}
              onChangeText={(txt) => setFormData(p => ({ ...p, full_name: txt }))}
              icon={<User size={18} color={THEME.textSecondary} />}
            />
            
            <SettingFormInput
              label="Email liên hệ"
              placeholder="nhuy.nguyen@student.edu.vn"
              value={formData.email}
              onChangeText={(txt) => setFormData(p => ({ ...p, email: txt }))}
              icon={<Mail size={18} color={THEME.textSecondary} />}
              keyboardType="email-address"
            />

            <SettingFormInput
              label="Số điện thoại"
              placeholder="09xx xxx xxx"
              value={formData.phone_number}
              onChangeText={(txt) => setFormData(p => ({ ...p, phone_number: txt }))}
              icon={<Smartphone size={18} color={THEME.textSecondary} />}
              keyboardType="phone-pad"
            />

            <View style={styles.inputRow}>
              <View style={{ flex: 1.5, marginRight: 10 }}>
                <SettingFormInput
                  label="Lớp / Đơn vị"
                  placeholder="21DTHD2"
                  value={formData.class_name}
                  onChangeText={(txt) => setFormData(p => ({ ...p, class_name: txt }))}
                  icon={<GraduationCap size={18} color={THEME.textSecondary} />}
                />
              </View>
              <View style={{ flex: 1 }}>
                <SettingFormInput
                  label="Niên khóa"
                  placeholder="2021"
                  value={formData.academic_year}
                  onChangeText={(txt) => setFormData(p => ({ ...p, academic_year: txt }))}
                  icon={<BookOpen size={18} color={THEME.textSecondary} />}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <SettingFormInput
              label="Mô tả bản thân"
              placeholder="Giới thiệu ngắn về tài năng hoặc đam mê..."
              value={formData.bio}
              onChangeText={(txt) => setFormData(p => ({ ...p, bio: txt }))}
              multiline
              numberOfLines={3}
            />

            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelBtn as ViewStyle} onPress={() => setIsEditing(false)}>
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveBtn as ViewStyle, isLoading ? { opacity: 0.7 } : null]}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={THEME.white} />
                ) : (
                  <Text style={styles.saveText}>Lưu & Khóa hồ sơ</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.group}>
              <Text style={styles.groupTitle}>Dữ liệu sinh viên</Text>
              <GlassCard style={styles.listCard as ViewStyle}>
                <SettingItem icon={User} title="Họ và tên" value={user.full_name} isVertical={false} />
                <View style={styles.divider} />
                <SettingItem icon={Mail} title="Email liên hệ" value={user.email} isVertical={true} />
                <View style={styles.divider} />
                <SettingItem icon={Smartphone} title="Số điện thoại" value={user.phone_number || 'Chưa cập nhật'} isVertical={false} />
                <View style={styles.divider} />
                <SettingItem icon={BookOpen} title="Tiểu sử" value={user.bio || 'Chưa có thông tin'} isVertical={true} />
              </GlassCard>
            </View>

            <View style={styles.group}>
              <Text style={styles.groupTitle}>Thiết bị & Bảo mật</Text>
              <GlassCard style={styles.listCard as ViewStyle}>
                <SettingItem 
                  icon={ShieldCheck} 
                  title="Thiết bị liên kết" 
                  value={user.device_id ? `Active (${user.device_id.substring(0, 10).toUpperCase()})` : "Chưa xác thực"} 
                  onPress={() => Alert.alert("Device Signature", user.device_id || "Vô danh")}
                  isVertical={true}
                />
                <View style={styles.divider} />
                <SettingItem icon={Lock} title="Đổi mã PIN bảo mật" onPress={() => {}} />
              </GlassCard>
            </View>

            <View style={styles.group}>
              <Text style={styles.groupTitle}>Hệ thống</Text>
              <GlassCard style={styles.listCard as ViewStyle}>
                <View style={styles.switchItem}>
                  <View style={styles.itemLeftPart}>
                    <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
                      <Bell size={18} color={THEME.success} />
                    </View>
                    <Text style={styles.settingTitle}>Thông báo đẩy (Push)</Text>
                  </View>
                  <Switch 
                    value={isNotificationsEnabled} 
                    onValueChange={setIsNotificationsEnabled}
                    trackColor={{ false: THEME.border, true: THEME.primary }}
                  />
                </View>
              </GlassCard>
            </View>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleLogout}
              style={styles.logoutBtnRoot as ViewStyle}
            >
              <LinearGradient
                colors={['#EF4444', '#B91C1C']}
                style={styles.logoutGradient as ViewStyle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <LogOut size={18} color={THEME.white} style={{ marginRight: 10 }} />
                <Text style={styles.logoutText}>Đăng xuất khỏi hệ thống</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={styles.versionLabel}>YouthHub Platform • Build 1528 (v1.2.0)</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
};

// Separated style definitions to avoid union type ambiguity in TypeScript
const viewStyles = {
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  } as ViewStyle,
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: THEME.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  } as ViewStyle,
  editIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: THEME.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  } as ViewStyle,
  profileCard: {
    marginBottom: 30,
    padding: 30,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    ...SHADOWS.medium,
  } as ViewStyle,
  profileInfo: {
    alignItems: 'center',
  } as ViewStyle,
  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  avatarRing: {
    position: 'absolute',
    width: 114,
    height: 114,
    borderRadius: 44,
    opacity: 0.15,
  } as ViewStyle,
  avatarContainer: {
    width: 102,
    height: 102,
    borderRadius: 38,
    backgroundColor: THEME.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: THEME.white,
    overflow: 'hidden',
    ...SHADOWS.medium,
  } as ViewStyle,
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: THEME.primary,
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: THEME.white,
  } as ViewStyle,
  verifiedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
    ...SHADOWS.light,
  } as ViewStyle,
  userSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  } as ViewStyle,
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.textMuted,
    marginHorizontal: 10,
    opacity: 0.5,
  } as ViewStyle,
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 18,
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
  } as ViewStyle,
  group: {
    marginBottom: 28,
  } as ViewStyle,
  listCard: {
    padding: 0,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#F8FAFC',
  } as ViewStyle,
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  } as ViewStyle,
  settingItemVertical: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 24,
  } as ViewStyle,
  itemLeftPart: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  } as ViewStyle,
  itemRightPart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    marginLeft: 12,
  } as ViewStyle,
  itemRightVertical: {
    width: '100%',
    justifyContent: 'flex-start',
    marginLeft: 58,
  } as ViewStyle,
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 22,
  } as ViewStyle,
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  } as ViewStyle,
  editForm: {
    marginBottom: 30,
  } as ViewStyle,
  formSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  } as ViewStyle,
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF1F2',
    padding: 18,
    borderRadius: 22,
    marginBottom: 26,
    borderWidth: 1.5,
    borderColor: '#FFE4E6',
    alignItems: 'center',
  } as ViewStyle,
  inputRow: {
    flexDirection: 'row',
  } as ViewStyle,
  editActions: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 12,
  } as ViewStyle,
  cancelBtn: {
    flex: 1,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  } as ViewStyle,
  saveBtn: {
    flex: 2,
    height: 64,
    borderRadius: 22,
    backgroundColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  } as ViewStyle,
  logoutBtnRoot: {
    marginTop: 15,
    borderRadius: 24,
    overflow: 'hidden',
    ...SHADOWS.medium,
  } as ViewStyle,
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 68,
  } as ViewStyle,
  inputContainer: {
    marginBottom: 20,
  } as ViewStyle,
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F1F5F9',
    minHeight: 62,
    ...SHADOWS.light,
  } as ViewStyle,
  inputIcon: {
    paddingLeft: 20,
  } as ViewStyle,
};

const textStyles = {
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.text,
    letterSpacing: -0.5,
  } as TextStyle,
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.text,
    letterSpacing: -0.8,
    marginBottom: 8,
  } as TextStyle,
  userSubText: {
    fontSize: 13,
    color: THEME.textSecondary,
    fontWeight: '700',
  } as TextStyle,
  lockText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  } as TextStyle,
  groupTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: THEME.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    marginBottom: 14,
    marginLeft: 4,
  } as TextStyle,
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.text,
  } as TextStyle,
  settingValue: {
    fontSize: 15,
    color: THEME.textSecondary,
    fontWeight: '600',
    textAlign: 'right',
  } as TextStyle,
  settingValueVertical: {
    textAlign: 'left',
    color: THEME.text,
    fontSize: 17,
    marginTop: -2,
    fontWeight: '700',
    lineHeight: 22,
  } as TextStyle,
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#BE123C',
    fontWeight: '700',
    marginLeft: 12,
    lineHeight: 18,
  } as TextStyle,
  cancelText: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.textSecondary,
  } as TextStyle,
  saveText: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.white,
    letterSpacing: 0.5,
  } as TextStyle,
  logoutText: {
    color: THEME.white,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
  } as TextStyle,
  versionLabel: {
    textAlign: 'center',
    marginTop: 50,
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: '800',
    opacity: 0.4,
  } as TextStyle,
  inputLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: THEME.text,
    marginBottom: 10,
    marginLeft: 8,
  } as TextStyle,
  textInput: {
    flex: 1,
    fontSize: 16,
    color: THEME.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontWeight: '700',
  } as TextStyle,
};

const imageStyles = {
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  } as ImageStyle,
};

const styles = StyleSheet.create({
  ...viewStyles,
  ...textStyles,
  ...imageStyles,
});

export default SettingsScreen;
