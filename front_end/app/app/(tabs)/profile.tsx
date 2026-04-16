import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import {
  Award,
  Briefcase,
  Calendar,
  ChevronRight,
  ExternalLink,
  Settings as SettingsIcon,
  Share2,
  FileText,
  LayoutGrid
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import { useAuth } from '../../src/context/AuthContext';
import apiClient from '../../src/api/client';
import { useQuery } from '@tanstack/react-query';
import GlassCard from '../../src/components/common/GlassCard';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['profileStats'],
    queryFn: async () => {
      const response = await apiClient.get('/users/me/profile_stats');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Handle case where user context or stats are loading, or user is null
  if (isLoading || !user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const chartData = {
    labels: stats?.skills?.map((s: any) => s.subject) || ["Bí thư", "Kỹ thuật", "Giao tiếp", "Sáng tạo", "Xã hội"],
    datasets: [
      {
        data: stats?.skills?.map((s: any) => s.list_score || s.A) || [80, 70, 90, 60, 85]
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    color: (opacity = 1) => `rgba(0, 82, 212, ${opacity})`, // Solid primary blue
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(43, 45, 66, ${opacity})`,
    fillShadowGradient: COLORS.primary,
    fillShadowGradientOpacity: 1,
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={[COLORS.gradient[0], COLORS.gradient[1], COLORS.gradient[2]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 15 }]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.circularButton}>
              <Share2 size={20} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circularButton}
              onPress={() => router.push('/settings')}
            >
              <SettingsIcon size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: user.avatar_url || 'https://i.pravatar.cc/150' }} style={styles.avatar} />
              <View style={[styles.levelBadge, SHADOWS.light]}>
                <Text style={styles.levelText}>Lvl {user.level || stats?.level || 1}</Text>
              </View>
            </View>
            <Text style={styles.userName}>{user.full_name}</Text>
            <View style={styles.idChip}>
              <Text style={styles.idText}>MSSV: {user.student_id}</Text>
            </View>

            {/* Level Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Tiến trình cấp độ</Text>
                <Text style={styles.progressValue}>
                  {stats?.training_score || user.training_score || 0}/{((user.level || 1) * 1000)} XP
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.min(((stats?.training_score || user.training_score || 0) / ((user.level || 1) * 1000)) * 100, 100)}%` }
                  ]}
                />
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Lưới Mini-App (Tiện ích mở rộng) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tiện ích mở rộng</Text>
          </View>
          <View style={styles.gridMenuContainer}>
            <TouchableOpacity
              style={[styles.gridMenuItem, SHADOWS.light]}
              onPress={() => router.push('/awards')}
            >
              <LinearGradient colors={['#FFD700', '#FDB931']} style={styles.gridMenuIcon}>
                <Award size={24} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.gridMenuText}>Thành tích{'\n'}của tôi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridMenuItem, SHADOWS.light]}
              onPress={() => router.push('/documents')}
            >
              <LinearGradient colors={['#4361EE', '#3A0CA3']} style={styles.gridMenuIcon}>
                <FileText size={24} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.gridMenuText}>Dịch vụ{'\n'}Hành chính</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridMenuItem, SHADOWS.light, { opacity: 0.5 }]}
            >
              <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.gridMenuIcon}>
                <LayoutGrid size={24} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.gridMenuText}>Thêm tính năng{'\n'}(Sắp ra mắt)</Text>
            </TouchableOpacity>
          </View>

          <GlassCard style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Năng lực cá nhân</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={chartData}
                width={width - 80}
                height={240}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  ...chartConfig,
                  propsForLabels: {
                    fontSize: 10,
                  },
                }}
                verticalLabelRotation={45}
                fromZero={true}
                showValuesOnTopOfBars={true}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                  paddingRight: 10,
                }}
              />
            </View>
          </GlassCard>

          {/* Badges Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Huy hiệu đạt được</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
            <View style={styles.badgeItem}>
              <LinearGradient colors={['#FFD700', '#FDB931']} style={styles.badgeCircle}>
                <Award size={24} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.badgeName}>Tiên phong</Text>
            </View>
            <View style={styles.badgeItem}>
              <LinearGradient colors={['#4361EE', '#3A0CA3']} style={styles.badgeCircle}>
                <Briefcase size={24} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.badgeName}>Chuyên cần</Text>
            </View>
            <View style={styles.badgeItem}>
              <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.badgeCircle}>
                <Calendar size={24} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.badgeName}>Tình nguyện</Text>
            </View>
          </ScrollView>

          {/* Certificates Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chứng nhận mới nhất</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {stats?.recent_certificates?.map((cert: any) => (
            <TouchableOpacity key={cert.id} style={[styles.certCard, SHADOWS.light]}>
              <View style={styles.certIconContainer}>
                <Award size={24} color={COLORS.primary} />
              </View>
              <View style={styles.certInfo}>
                <Text style={styles.certTitle}>{cert.title}</Text>
                <View style={styles.certMeta}>
                  <Calendar size={12} color={COLORS.textSecondary} />
                  <Text style={styles.certMetaText}>{cert.time || cert.date}</Text>
                  <View style={styles.dot} />
                  <Briefcase size={12} color={COLORS.textSecondary} />
                  <Text style={styles.certMetaText}>{cert.issuer || 'Đoàn trường'}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={COLORS.border} />
            </TouchableOpacity>
          ))}

          {/* Digital ID Link */}
          <TouchableOpacity style={styles.idLinkCard}>
            <LinearGradient
              colors={['#4361EE', '#3A0CA3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.idLinkGradient}
            >
              <View>
                <Text style={styles.idLinkTitle}>Thẻ Đoàn viên Điện tử</Text>
                <Text style={styles.idLinkSub}>QR Code xác thực nhanh</Text>
              </View>
              <ExternalLink size={24} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SIZES.padding,
    gap: 12,
  },
  circularButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  levelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3A0CA3',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  idChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  gridMenuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  gridMenuItem: {
    width: (width - SIZES.padding * 2 - 30) / 3, // 3 columns
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // For Android
  },
  gridMenuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridMenuText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  idText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    width: width * 0.7,
    marginTop: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '600',
  },
  progressValue: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  facultyText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  content: {
    padding: SIZES.padding,
    marginTop: -20,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 24,
    marginBottom: SIZES.padding,
    ...(Platform.OS === 'ios' ? SHADOWS.light : { elevation: 2 })
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
  },
  badgesScroll: {
    marginBottom: 25,
    paddingLeft: 5,
  },
  badgeItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  badgeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...SHADOWS.light,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  viewAll: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  certCard: {
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: SIZES.radius,
    marginBottom: 12,
  },
  certIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  certInfo: {
    flex: 1,
  },
  certTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  certMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certMetaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  idLinkCard: {
    marginTop: 20,
    marginBottom: 40,
    borderRadius: SIZES.radius * 1.5,
    overflow: 'hidden',
  },
  idLinkGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idLinkTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  idLinkSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  }
});

export default ProfileScreen;
