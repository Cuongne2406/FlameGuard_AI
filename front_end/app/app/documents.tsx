import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  FileText, 
  Search, 
  Clock, 
  CheckCircle,
  X,
  ChevronRight,
  Plus
} from 'lucide-react-native';
import { COLORS, SHADOWS, SIZES } from '../src/constants/theme';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import FormInput from '../src/components/common/FormInput';
import PremiumButton from '../src/components/common/PremiumButton';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../src/context/AuthContext';
import { getDocuments, createDocumentRequest } from '../src/api/client';

const documentRequestSchema = z.object({
  reason: z.string().min(10, 'Lý do quá ngắn. Vui lòng trình bày chi tiết hơn (ít nhất 10 ký tự).')
});

type DocumentRequestFormData = z.infer<typeof documentRequestSchema>;

export default function DocumentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0); // 0: Đang xử lý, 1: Mẫu đơn, 2: Khoa
  const [previewModal, setPreviewModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<any>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<DocumentRequestFormData>({
    resolver: zodResolver(documentRequestSchema),
    defaultValues: {
      reason: ''
    }
  });

  const { data: rawDocs = [], isLoading: isLoadingDocs } = useQuery({
    queryKey: ['userDocuments', user?.id],
    queryFn: () => getDocuments(0, 100),
    enabled: !!user,
  });

  const userRequests = useMemo(() => {
    if (!user) return [];
    return (rawDocs as any[]).filter((d: any) => !d.is_public && d.user_id === user.id);
  }, [rawDocs, user]);

  const publicTemplates = useMemo(() => {
    return (rawDocs as any[]).filter((d: any) => d.is_public);
  }, [rawDocs]);

  const submitDocMutation = useMutation({
    mutationFn: (data: DocumentRequestFormData) => createDocumentRequest({
      user_id: user?.id,
      document_type: "Giấy chứng nhận",
      title: "Xin cấp lại Giấy chứng nhận",
      purpose: data.reason,
      is_public: false
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userDocuments', user?.id] });
      setRequestModal(false);
      reset();
      Alert.alert('Thành công', 'Yêu cầu của bạn đã được gửi thành công!');
    },
    onError: (err: any) => {
      console.error(err);
      Alert.alert('Lỗi', 'Gửi yêu cầu thất bại. Vui lòng thử lại sau.');
    }
  });

  const onSubmitRequest = (data: DocumentRequestFormData) => {
    submitDocMutation.mutate(data);
  };

  const tabs = ['Tiến độ Thủ tục', 'Khuôn mẫu', 'Văn bản Khoa'];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hành chính & Tài liệu</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.searchBar}>
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput 
            placeholder="Tìm kiếm giấy tờ..." 
            style={styles.searchInput}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <View style={styles.tabsContainer}>
          {tabs.map((tab, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.tabBtn, activeTab === idx && styles.tabBtnActive]}
              onPress={() => setActiveTab(idx)}
            >
              <Text style={[styles.tabText, activeTab === idx && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 0 ? (
          <View>
            {isLoadingDocs ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 30 }} />
            ) : userRequests.length === 0 ? (
              <View style={{ padding: 30, alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 20, marginBottom: 20 }}>
                <Text style={{ color: COLORS.textSecondary, fontSize: 13, fontWeight: '500', textAlign: 'center' }}>
                  Chưa có yêu cầu hành chính nào đang được xử lý.
                </Text>
              </View>
            ) : (
              userRequests.map((doc: any) => {
                const isApproved = doc.status === 'APPROVED' || doc.status === 'Approved';
                const isRejected = doc.status === 'REJECTED' || doc.status === 'Rejected';
                
                const statusPercent = isApproved ? '100%' : isRejected ? '100%' : '60%';
                const statusLabel = isApproved ? 'ĐÃ DUYỆT' : isRejected ? 'BỊ TỪ CHỐI' : 'ĐANG XỬ LÝ (KHOA)';
                const statusColor = isApproved ? '#4CAF50' : isRejected ? '#EF4444' : COLORS.primary;

                return (
                  <TouchableOpacity 
                    key={doc.id} 
                    style={[styles.progressCard, SHADOWS.light]}
                    onPress={() => {
                      setSelectedPreviewDoc(doc);
                      setPreviewModal(true);
                    }}
                  >
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.iconBoxMini}><FileText size={16} color={statusColor} /></View>
                      <Text style={[styles.cardHeaderTitle, { color: statusColor }]}>Mã HS: #{doc.document_code || doc.id.substring(0, 8).toUpperCase()}</Text>
                    </View>
                    <Text style={styles.docNameTitle}>{doc.title || 'Đơn xin cấp lại tài liệu'}</Text>
                    
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressLabels}>
                        <Text style={[styles.progressStatus, { color: statusColor }]}>{statusLabel}</Text>
                        <Text style={[styles.progressPercent, { color: statusColor }]}>{statusPercent}</Text>
                      </View>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: statusPercent, backgroundColor: statusColor }]} />
                      </View>
                    </View>

                    <View style={styles.cardFooter}>
                      <Clock size={14} color={COLORS.textSecondary} />
                      <Text style={styles.footerText}>
                        {isApproved ? 'Đã hoàn thành thủ tục' : isRejected ? `Lý do từ chối: ${doc.rejection_reason || 'Không rõ'}` : 'Dự kiến trả kết quả: 24h nữa'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}

            <TouchableOpacity 
              style={[styles.requestActionCard, SHADOWS.light]}
              onPress={() => setRequestModal(true)}
            >
              <View style={styles.requestIconOuter}>
                <Plus size={24} color={COLORS.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.requestTitle}>Gửi Yêu cầu Đặc biệt</Text>
                <Text style={styles.requestSub}>Cấp lại giấy tờ, xác nhận mộc đỏ...</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.docList}>
            {isLoadingDocs ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 30 }} />
            ) : publicTemplates.length === 0 ? (
              // Fallback to default static list to keep it visually rich if DB is clean
              [
                { id: 'f-1', title: 'Mẫu Đơn Đăng ký Sinh viên 5 Tốt 2026', document_type: 'DOCX', request_date: '2026-04-20T00:00:00', file_url: '#', purpose: 'Đăng ký xét chọn danh hiệu Sinh viên 5 Tốt cấp Trường niên khóa 2025-2026.' },
                { id: 'f-2', title: 'Quy chế Phân loại rèn luyện sinh viên', document_type: 'PDF', request_date: '2026-01-15T00:00:00', file_url: '#', purpose: 'Quy chế đánh giá điểm rèn luyện và phân loại sinh viên hệ chính quy.' },
                { id: 'f-3', title: 'Mẫu Đơn xin Miễn sinh hoạt Đoàn', document_type: 'PDF', request_date: '2026-01-10T00:00:00', file_url: '#', purpose: 'Thủ tục xin miễn sinh hoạt Đoàn theo quy định điều lệ Đoàn.' },
              ].map((doc) => (
                <TouchableOpacity 
                  key={doc.id} 
                  style={[styles.docItem, SHADOWS.light]}
                  onPress={() => {
                    setSelectedPreviewDoc(doc);
                    setPreviewModal(true);
                  }}
                >
                  <View style={[styles.docIcon, { backgroundColor: doc.document_type === 'PDF' ? '#FFEBEE' : '#E3F2FD' }]}>
                    <Text style={[styles.docTypeText, { color: doc.document_type === 'PDF' ? '#F44336' : '#2196F3' }]}>{doc.document_type}</Text>
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docTitle} numberOfLines={2}>{doc.title}</Text>
                    <Text style={styles.docDate}>Ban hành: {new Date(doc.request_date).toLocaleDateString('vi-VN')}</Text>
                  </View>
                  <ChevronRight size={20} color={COLORS.border} />
                </TouchableOpacity>
              ))
            ) : (
              publicTemplates.map((doc: any) => (
                <TouchableOpacity 
                  key={doc.id} 
                  style={[styles.docItem, SHADOWS.light]}
                  onPress={() => {
                    setSelectedPreviewDoc(doc);
                    setPreviewModal(true);
                  }}
                >
                  <View style={[styles.docIcon, { backgroundColor: doc.document_type === 'PDF' ? '#FFEBEE' : '#E3F2FD' }]}>
                    <Text style={[styles.docTypeText, { color: doc.document_type === 'PDF' ? '#F44336' : '#2196F3' }]}>{doc.document_type || 'PDF'}</Text>
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docTitle} numberOfLines={2}>{doc.title}</Text>
                    <Text style={styles.docDate}>Ban hành: {doc.request_date ? new Date(doc.request_date).toLocaleDateString('vi-VN') : '2026'}</Text>
                  </View>
                  <ChevronRight size={20} color={COLORS.border} />
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>

      <Modal visible={previewModal} animationType="slide">
        <View style={styles.previewContainer}>
          <View style={[styles.previewHeader, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => setPreviewModal(false)} style={styles.closeBtn}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.previewTitle}>TRÍCH XUẤT VĂN BẢN</Text>
            <View style={{ width: 40 }} />
          </View>
          
          <ScrollView style={styles.previewScroll} contentContainerStyle={{ padding: 20 }}>
            <View style={[styles.a4Paper, SHADOWS.heavy]}>
              <View style={styles.a4Header}>
                <Text style={styles.a4LeftText}>ĐOÀN TNCS HỒ CHÍ MINH{"\n"}TRƯỜNG ĐH KỸ THUẬT</Text>
                <Text style={styles.a4RightText}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM{"\n"}Độc lập - Tự do - Hạnh phúc</Text>
              </View>
              
              <Text style={styles.a4DocumentTitle}>{selectedPreviewDoc?.title ? selectedPreviewDoc.title.toUpperCase() : 'VĂN BẢN ĐIỆN TỬ'}</Text>
              
              {selectedPreviewDoc?.is_public === false ? (
                <Text style={styles.a4Paragraph}>
                  Hệ thống số hóa Đoàn TNCS Hồ Chí Minh xác nhận: Sinh viên {"\n"}
                  Họ tên: <Text style={{ fontWeight: 'bold' }}>{user?.full_name}</Text>{"\n"}
                  MSSV: <Text style={{ fontWeight: 'bold' }}>{user?.student_id}</Text>{"\n"}
                  Đã gửi yêu cầu hành chính trực tuyến với nội dung:{"\n"}
                  <Text style={{ fontStyle: 'italic', color: COLORS.textSecondary }}>"{selectedPreviewDoc?.purpose || 'Lý do cá nhân'}"</Text>{"\n"}
                  Hiện hồ sơ đang được thụ lý và xử lý trực tuyến bởi Ban Chấp hành Đoàn Khoa.
                </Text>
              ) : (
                <Text style={styles.a4Paragraph}>
                  Quyết định ban hành tài liệu hướng dẫn nội bộ sinh viên.{"\n"}
                  Văn bản: <Text style={{ fontWeight: 'bold' }}>{selectedPreviewDoc?.title}</Text>{"\n"}
                  Mục đích ban hành: {selectedPreviewDoc?.purpose || 'Tài liệu tham khảo phục vụ phong trào sinh viên và công tác quản lý Đoàn - Hội.'}{"\n"}
                  Sinh viên cần lưu ý tải mẫu đơn và điền đúng quy chế văn bản trước khi ký nộp trực tiếp.
                </Text>
              )}
              
              <View style={styles.digitalSignature}>
                <Text style={styles.signTitle}>KÝ BỞI: ADMIN HỆ THỐNG</Text>
                <Text style={styles.signDate}>Ngày: {selectedPreviewDoc?.request_date ? new Date(selectedPreviewDoc.request_date).toLocaleDateString('vi-VN') : '20/04/2026'}</Text>
                <CheckCircle size={32} color="#D32F2F" style={{ marginTop: 10 }} />
                <Text style={styles.signVerified}>DIGITAL VERIFIED</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={requestModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.bottomSheet, SHADOWS.heavy]}>
            <Text style={styles.sheetTitle}>Tạo Yêu Cầu Mới</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Loại hình dịch vụ</Text>
              <TextInput style={styles.input} value="Cấp lại Giấy chứng nhận" editable={false} />
            </View>

            <FormInput 
              control={control}
              name="reason"
              placeholder="Trình bày lý do hoặc tên sự kiện bạn bị mất giấy tờ..."
              multiline
              numberOfLines={4}
            />

            <View style={styles.btnRow}>
              <PremiumButton 
                title="HUỶ BỎ"
                variant="ghost"
                onPress={() => {
                  setRequestModal(false);
                  reset();
                }}
                style={{ flex: 1 }}
              />
              <PremiumButton 
                title="GỬI YÊU CẦU"
                onPress={handleSubmit(onSubmitRequest)}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.padding,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5',
    borderRadius: 16, paddingHorizontal: 15, height: 50, marginBottom: 20
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: COLORS.text },
  
  tabsContainer: { flexDirection: 'row', gap: 15, marginBottom: 15 },
  tabBtn: { paddingVertical: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.primary, fontWeight: '800' },
  
  scrollContent: { padding: SIZES.padding, paddingBottom: 100 },

  progressCard: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 20, marginBottom: 20 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconBoxMini: { padding: 4, backgroundColor: 'rgba(67, 97, 238, 0.1)', borderRadius: 6, marginRight: 8 },
  cardHeaderTitle: { fontSize: 10, fontWeight: '800', color: COLORS.textSecondary, letterSpacing: 1 },
  docNameTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
  
  progressBarContainer: { marginBottom: 15 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressStatus: { fontSize: 10, fontWeight: '800', color: COLORS.primary },
  progressPercent: { fontSize: 10, fontWeight: '800', color: COLORS.primary },
  progressTrack: { height: 8, backgroundColor: '#EDF2F7', borderRadius: 4 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },

  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 6, borderTopWidth: 1, borderTopColor: '#F0F2F5', paddingTop: 15 },
  footerText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },

  requestActionCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#FFE0B2',
  },
  requestIconOuter: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF3E0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  requestTitle: { fontSize: 16, fontWeight: 'bold', color: '#E65100', marginBottom: 4 },
  requestSub: { fontSize: 12, color: COLORS.textSecondary },

  docList: { gap: 15 },
  docItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: 15, borderRadius: 16 },
  docIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  docTypeText: { fontSize: 11, fontWeight: '900' },
  docInfo: { flex: 1, marginLeft: 15 },
  docTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  docDate: { fontSize: 11, color: COLORS.textSecondary },

  previewContainer: { flex: 1, backgroundColor: '#ECEFF1' },
  previewHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingBottom: 15 },
  closeBtn: { width: 40, height: 40, justifyContent: 'center' },
  previewTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  previewScroll: { flex: 1 },
  
  a4Paper: { backgroundColor: '#FFF', minHeight: 600, padding: 30, borderRadius: 8, position: 'relative' },
  a4Header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  a4LeftText: { fontSize: 10, textAlign: 'center', fontWeight: 'bold' },
  a4RightText: { fontSize: 10, textAlign: 'center', fontWeight: 'bold' },
  a4DocumentTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 20, marginBottom: 30 },
  a4Paragraph: { fontSize: 14, lineHeight: 28, textAlign: 'justify' },
  
  digitalSignature: {
    position: 'absolute', bottom: 40, right: 20, padding: 15,
    borderWidth: 3, borderColor: '#D32F2F', borderRadius: 10,
    alignItems: 'center', transform: [{ rotate: '-10deg' }]
  },
  signTitle: { color: '#D32F2F', fontSize: 10, fontWeight: '900' },
  signDate: { color: '#D32F2F', fontSize: 9, fontWeight: '600' },
  signVerified: { color: '#D32F2F', fontSize: 8, fontWeight: '800', marginTop: 5, opacity: 0.6 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  bottomSheet: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 24 },
  sheetTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8 },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E9ECEF', borderRadius: 12, padding: 15, fontSize: 14 },
  btnRow: { flexDirection: 'row', gap: 15, marginTop: 10 },
  cancelBtn: { flex: 1, paddingVertical: 15, backgroundColor: '#F0F2F5', borderRadius: 12, alignItems: 'center' },
  cancelText: { fontWeight: '700', color: COLORS.textSecondary },
  submitBtn: { flex: 1, paddingVertical: 15, backgroundColor: COLORS.primary, borderRadius: 12, alignItems: 'center' },
  submitText: { fontWeight: '700', color: COLORS.white },
});
