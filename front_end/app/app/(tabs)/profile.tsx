import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
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
  LayoutGrid,
} from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS, UI } from '../../src/constants/theme';
import { useAuth } from '../../src/context/AuthContext';
import apiClient, { getUserRegistrations } from '../../src/api/client';
import { useQuery } from '@tanstack/react-query';
import GlassCard from '../../src/components/common/GlassCard';
import MainHeader from '../../src/components/common/MainHeader';
import EventCard from '../../src/components/EventCard';

const fallbackSkills = [
  { subject: 'Bí thư', score: 80 },
  { subject: 'Kỹ thuật', score: 70 },
  { subject: 'Giao tiếp', score: 90 },
  { subject: 'Sáng tạo', score: 60 },
  { subject: 'Xã hội', score: 85 },
];

const badgeConfigs = [
  {
    name: 'Tiên phong',
    colors: ['#FFD700', '#FDB931'],
    icon: <Award size={24} color={COLORS.white} />,
    detail: 'Tham gia đều các hoạt động nổi bật và hoàn thành tốt vai trò được giao.',
  },
  {
    name: 'Chuyên cần',
    colors: ['#4361EE', '#3A0CA3'],
    icon: <Briefcase size={24} color={COLORS.white} />,
    detail: 'Duy trì nhịp độ tham gia ổn định trong nhiều sự kiện liên tiếp.',
  },
  {
    name: 'Tình nguyện',
    colors: ['#4CAF50', '#2E7D32'],
    icon: <Calendar size={24} color={COLORS.white} />,
    detail: 'Đóng góp tích cực cho các chiến dịch cộng đồng và công tác hỗ trợ.',
  },
];

const ProfileScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const [selectedSkillIndex, setSelectedSkillIndex] = React.useState(0);
  const [selectedBadge, setSelectedBadge] = React.useState('Tiên phong');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['profileStats'],
    queryFn: async () => {
      const response = await apiClient.get('/users/me/profile_stats');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Registration history — events the student has registered for
  const { data: registrations = [] } = useQuery({
    queryKey: ['userRegistrations', user?.id],
    queryFn: () => getUserRegistrations(user?.id),
    enabled: !!user,
    staleTime: 3 * 60 * 1000,
  });

  // Ended events from registrations = the student's personal history
  const ENDED = new Set(['ENDED', 'Ended']);
  const historyEvents = (registrations as any[]).filter((e: any) => ENDED.has(e.status));

  if (isLoading || !user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const skills = stats?.skills?.length
    ? stats.skills.map((skill: any) => ({
        subject: skill.subject,
        score: skill.list_score || skill.A || 0,
      }))
    : fallbackSkills;

  const selectedSkill = skills[selectedSkillIndex] || skills[0];
  const activeBadge = badgeConfigs.find((badge) => badge.name === selectedBadge) || badgeConfigs[0];
  const contentWidth = width - SIZES.padding * 2;
  const chartWidth = Math.max(contentWidth - 40, skills.length * 72);

  const chartData = {
    labels: skills.map((skill: any) =>
      skill.subject.length > 10 ? `${skill.subject.slice(0, 8).trim()}…` : skill.subject
    ),
    datasets: [
      {
        data: skills.map((skill: any) => skill.score),
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
    fillShadowGradient: COLORS.primary,
    fillShadowGradientOpacity: 1,
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <MainHeader>
          <View style={styles.headerTop}>
            <Pressable style={({ pressed }) => [styles.circularButton, pressed && styles.pressed]}>
              <Share2 size={20} color={COLORS.white} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.circularButton, pressed && styles.pressed]}
              onPress={() => router.push('/settings')}
            >
              <SettingsIcon size={20} color={COLORS.white} />
            </Pressable>
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

            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Tiến trình cấp độ</Text>
                <Text style={styles.progressValue}>
                  {stats?.training_score || user.training_score || 0}/{(user.level || 1) * 1000} XP
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.min((((stats?.training_score || user.training_score || 0) / ((user.level || 1) * 1000)) * 100), 100)}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        </MainHeader>

        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tiện ích mở rộng</Text>
          </View>
          <View style={styles.gridMenuContainer}>
            <Pressable style={({ pressed }) => [styles.gridMenuItem, SHADOWS.light, pressed && styles.pressed]} onPress={() => router.push('/awards')}>
              <LinearGradient colors={['#FFD700', '#FDB931']} style={styles.gridMenuIcon}>
                <Award size={24} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.gridMenuText}>Thành tích{'\n'}của tôi</Text>
            </Pressable>

            <Pressable style={({ pressed }) => [styles.gridMenuItem, SHADOWS.light, pressed && styles.pressed]} onPress={() => router.push('/documents')}>
              <LinearGradient colors={['#4361EE', '#3A0CA3']} style={styles.gridMenuIcon}>
                <FileText size={24} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.gridMenuText}>Dịch vụ{'\n'}hành chính</Text>
            </Pressable>

            <Pressable style={({ pressed }) => [styles.gridMenuItem, SHADOWS.light, { opacity: 0.5 }, pressed && styles.pressed]}>
              <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.gridMenuIcon}>
                <LayoutGrid size={24} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.gridMenuText}>Tính năng mới{'\n'}(Sắp ra mắt)</Text>
            </Pressable>
          </View>

          <GlassCard style={styles.glassSection}>
            <Text style={styles.sectionTitle}>Năng lực cá nhân</Text>
            <View style={styles.chartContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartScrollContent}>
                <BarChart
                  data={chartData}
                  width={chartWidth}
                  height={260}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={{
                    ...chartConfig,
                    propsForLabels: {
                      fontSize: 10,
                    },
                  }}
                  verticalLabelRotation={0}
                  fromZero
                  withInnerLines
                  showValuesOnTopOfBars
                  style={styles.chart}
                />
              </ScrollView>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.skillChipRow}>
              {skills.map((skill: any, index: number) => {
                const active = index === selectedSkillIndex;
                return (
                  <Pressable
                    key={skill.subject}
                    onPress={() => setSelectedSkillIndex(index)}
                    style={({ pressed }) => [styles.skillChip, active && styles.skillChipActive, pressed && styles.pressed]}
                  >
                    <Text style={[styles.skillChipText, active && styles.skillChipTextActive]}>{skill.subject}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Chi tiết khi bấm</Text>
              <Text style={styles.detailTitle}>{selectedSkill.subject}</Text>
              <Text style={styles.detailValue}>{selectedSkill.score} điểm</Text>
            </View>
          </GlassCard>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Huy hiệu đạt được</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
            {badgeConfigs.map((badge) => (
              <Pressable key={badge.name} onPress={() => setSelectedBadge(badge.name)} style={({ pressed }) => [styles.badgeItem, pressed && styles.pressed]}>
                <LinearGradient colors={badge.colors} style={[styles.badgeCircle, selectedBadge === badge.name && styles.badgeCircleActive]}>
                  {badge.icon}
                </LinearGradient>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Huy hiệu đang chọn</Text>
            <Text style={styles.detailTitle}>{activeBadge.name}</Text>
            <Text style={styles.badgeDetailText}>{activeBadge.detail}</Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chứng nhận mới nhất</Text>
            <Pressable>
              <Text style={styles.viewAll}>Xem tất cả</Text>
            </Pressable>
          </View>

          {stats?.recent_certificates?.map((cert: any) => (
            <Pressable key={cert.id} style={({ pressed }) => [styles.certCard, SHADOWS.light, pressed && styles.pressed]}>
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
              <ChevronRight size={20} color={COLORS.borderStrong} />
            </Pressable>
          ))}

          {/* ── Lịch sử tham gia ─────────────────────────── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lịch sử tham gia</Text>
            <Pressable onPress={() => router.push('/events')}>
              <Text style={styles.viewAll}>Xem tất cả</Text>
            </Pressable>
          </View>

          {historyEvents.length === 0 ? (
            <View style={styles.historyEmpty}>
              <Calendar size={28} color={COLORS.textMuted} />
              <Text style={styles.historyEmptyText}>
                Bạn chưa có sự kiện nào đã kết thúc.{`\n`}Tham gia sự kiện để xây dựng hồ sơ!
              </Text>
            </View>
          ) : (
            historyEvents.slice(0, 5).map((event: any) => (
              <EventCard
                key={event.id}
                event={event}
                variant="compact"
                style={styles.historyCard}
                onPress={() => router.push(`/event-detail/${event.id}`)}
              />
            ))
          )}

          <Pressable style={({ pressed }) => [styles.idLinkCard, pressed && styles.pressed]}>
            <LinearGradient colors={['#4361EE', '#3A0CA3']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.idLinkGradient}>
              <View>
                <Text style={styles.idLinkTitle}>Thẻ Đoàn viên Điện tử</Text>
                <Text style={styles.idLinkSub}>QR Code xác thực nhanh</Text>
              </View>
              <ExternalLink size={24} color={COLORS.white} />
            </LinearGradient>
          </Pressable>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  idText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    maxWidth: 320,
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
  content: {
    padding: SIZES.padding,
    marginTop: -20,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  gridMenuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  gridMenuItem: {
    flex: 1,
    minHeight: 138,
    backgroundColor: COLORS.surface,
    borderRadius: UI.cardRadius,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
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
  glassSection: {
    marginTop: 20,
  },
  chartContainer: {
    marginTop: 8,
    marginHorizontal: -8,
    minHeight: 290,
  },
  chartScrollContent: {
    paddingHorizontal: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  skillChipRow: {
    gap: 10,
    paddingTop: 8,
    paddingBottom: 6,
    paddingRight: 8,
  },
  skillChip: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: UI.chipRadius,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  skillChipActive: {
    backgroundColor: COLORS.primary,
  },
  skillChipText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  skillChipTextActive: {
    color: COLORS.white,
  },
  detailCard: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  detailLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  detailTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  detailValue: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  badgesScroll: {
    marginBottom: 20,
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
  badgeCircleActive: {
    transform: [{ scale: 1.06 }],
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  badgeDetailText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
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
    borderRadius: UI.cardRadius,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    flexWrap: 'wrap',
    rowGap: 4,
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
    backgroundColor: COLORS.borderStrong,
    marginHorizontal: 8,
  },
  idLinkCard: {
    marginTop: 20,
    marginBottom: 40,
    borderRadius: UI.cardRadius,
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
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },
  historyEmpty: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  historyEmptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    fontWeight: '500',
  },
  historyCard: {
    opacity: 0.75,   // subtle mute to signal these are past events
  },
});

export default ProfileScreen;
