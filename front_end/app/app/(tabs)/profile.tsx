import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Image, 
  TouchableOpacity,
  Dimensions
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
  Share2
} from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import { mockUser } from '../../src/api/mockData';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const router = useRouter();
  const chartData = {
    labels: ["Bí thư", "Kỹ thuật", "Giao tiếp", "Sáng tạo", "Xã hội"],
    datasets: [
      {
        data: [
          mockUser.skills.leadership,
          mockUser.skills.technical,
          mockUser.skills.communication,
          mockUser.skills.creativity,
          mockUser.skills.analysis
        ]
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    color: (opacity = 1) => `rgba(67, 97, 238, ${opacity})`,
    strokeWidth: 2,
    fillShadowGradient: COLORS.primary,
    fillShadowGradientOpacity: 0.2,
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={[COLORS.gradient[0], COLORS.gradient[1]]}
          style={styles.header}
        >
          <SafeAreaView>
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
                <Image source={{ uri: mockUser.avatar_url }} style={styles.avatar} />
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Lvl {mockUser.level}</Text>
                </View>
              </View>
              <Text style={styles.userName}>{mockUser.full_name}</Text>
              <View style={styles.idChip}>
                <Text style={styles.idText}>MSSV: {mockUser.student_id}</Text>
              </View>
              <Text style={styles.facultyText}>{mockUser.class_name} • {mockUser.university}</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.content}>
          {/* Radar Chart Section */}
          <View style={[styles.sectionCard, SHADOWS.light]}>
            <Text style={styles.sectionTitle}>Năng lực cá nhân</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={chartData}
                width={width - 40}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                fromZero={true}
                showValuesOnTopOfBars={true}
              />
            </View>
          </View>

          {/* Certificates Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chứng nhận mới nhất</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {mockUser.certificates.map((cert) => (
            <TouchableOpacity key={cert.id} style={[styles.certCard, SHADOWS.light]}>
              <View style={styles.certIconContainer}>
                <Award size={24} color={COLORS.primary} />
              </View>
              <View style={styles.certInfo}>
                <Text style={styles.certTitle}>{cert.title}</Text>
                <View style={styles.certMeta}>
                  <Calendar size={12} color={COLORS.textSecondary} />
                  <Text style={styles.certMetaText}>{cert.date}</Text>
                  <View style={styles.dot} />
                  <Briefcase size={12} color={COLORS.textSecondary} />
                  <Text style={styles.certMetaText}>{cert.issuer}</Text>
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
    paddingBottom: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SIZES.padding,
    gap: 12,
    marginTop: 10,
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
    padding: SIZES.padding,
    borderRadius: SIZES.radius * 1.5,
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
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
