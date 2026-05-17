import React, { useMemo, useState } from 'react';
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
  Plus,
} from 'lucide-react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { COLORS, SHADOWS, SIZES } from '../src/constants/theme';
import { useAuth } from '../src/context/AuthContext';
import { createDocumentRequest, getDocuments } from '../src/api/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormInput from '../src/components/common/FormInput';
import PremiumButton from '../src/components/common/PremiumButton';

const documentRequestSchema = z.object({
  reason: z.string().min(10, 'Ly do qua ngan. Vui long trinh bay chi tiet hon.'),
});

type DocumentRequestFormData = z.infer<typeof documentRequestSchema>;

export default function DocumentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [previewModal, setPreviewModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const { control, handleSubmit, reset } = useForm<DocumentRequestFormData>({
    resolver: zodResolver(documentRequestSchema),
    defaultValues: { reason: '' },
  });

  const { data: docs = [] } = useQuery({
    queryKey: ['mobile-documents'],
    queryFn: getDocuments,
    enabled: !!user,
  });

  const myRequests = useMemo(
    () => (Array.isArray(docs) ? docs.filter((doc: any) => doc.user_id === user?.id && !doc.is_public) : []),
    [docs, user?.id]
  );

  const publicDocs = useMemo(
    () => (Array.isArray(docs) ? docs.filter((doc: any) => doc.is_public) : []),
    [docs]
  );

  const templateDocs = useMemo(
    () =>
      publicDocs.filter((doc: any) => {
        const text = `${doc.title || ''} ${doc.document_type || ''}`.toLowerCase();
        return text.includes('mau') || text.includes('don') || text.includes('form');
      }),
    [publicDocs]
  );

  const facultyDocs = useMemo(
    () =>
      publicDocs.filter((doc: any) => {
        const text = `${doc.title || ''} ${doc.document_type || ''}`.toLowerCase();
        return !(text.includes('mau') || text.includes('don') || text.includes('form'));
      }),
    [publicDocs]
  );

  const filteredList = useMemo(() => {
    const source = activeTab === 1 ? templateDocs : facultyDocs;
    if (!searchQuery.trim()) return source;
    const query = searchQuery.toLowerCase();
    return source.filter((doc: any) =>
      `${doc.title || ''} ${doc.document_type || ''} ${doc.document_code || ''}`.toLowerCase().includes(query)
    );
  }, [activeTab, facultyDocs, searchQuery, templateDocs]);

  const submitMutation = useMutation({
    mutationFn: (data: DocumentRequestFormData) =>
      createDocumentRequest({
        document_type: 'Yeu cau hanh chinh',
        title: 'Yeu cau dac biet',
        purpose: data.reason,
        is_public: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobile-documents'] });
      setRequestModal(false);
      reset();
      Alert.alert('Thanh cong', 'Yeu cau da duoc gui.');
    },
    onError: () => {
      Alert.alert('Loi', 'Khong the gui yeu cau luc nay.');
    },
  });

  const latestRequest = myRequests[0];
  const progressPercent = latestRequest?.status === 'APPROVED' ? 100 : latestRequest?.status === 'PROCESSING' ? 60 : 30;

  const openPreview = (doc: any) => {
    setSelectedDoc(doc);
    setPreviewModal(true);
  };

  const onSubmitRequest = (data: DocumentRequestFormData) => {
    submitMutation.mutate(data);
  };

  const tabs = ['Tien do Thu tuc', 'Khuon mau', 'Van ban Khoa'];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hanh chinh & Tai lieu</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.searchBar}>
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput
            placeholder="Tim kiem giay to..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <View style={styles.tabsContainer}>
          {tabs.map((tab, idx) => (
            <TouchableOpacity key={idx} style={[styles.tabBtn, activeTab === idx && styles.tabBtnActive]} onPress={() => setActiveTab(idx)}>
              <Text style={[styles.tabText, activeTab === idx && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 0 ? (
          <View>
            <View style={[styles.progressCard, SHADOWS.light]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.iconBoxMini}>
                  <FileText size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.cardHeaderTitle}>MA HS: {latestRequest?.document_code || 'CHO CAP NHAT'}</Text>
              </View>
              <Text style={styles.docNameTitle}>{latestRequest?.title || 'Chua co yeu cau hanh chinh nao'}</Text>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressStatus}>{latestRequest?.status || 'PENDING'}</Text>
                  <Text style={styles.progressPercent}>{progressPercent}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Clock size={14} color={COLORS.textSecondary} />
                <Text style={styles.footerText}>
                  {latestRequest?.request_date
                    ? `Gui ngay ${new Date(latestRequest.request_date).toLocaleDateString('vi-VN')}`
                    : 'Gui yeu cau de he thong bat dau theo doi'}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.requestActionCard, SHADOWS.light]} onPress={() => setRequestModal(true)}>
              <View style={styles.requestIconOuter}>
                <Plus size={24} color={COLORS.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.requestTitle}>Gui Yeu cau dac biet</Text>
                <Text style={styles.requestSub}>Cap lai giay to, xac nhan, bo sung thu tuc...</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.docList}>
            {filteredList.map((doc: any) => (
              <TouchableOpacity key={doc.id} style={[styles.docItem, SHADOWS.light]} onPress={() => openPreview(doc)}>
                <View style={[styles.docIcon, { backgroundColor: '#FFEBEE' }]}>
                  <Text style={[styles.docTypeText, { color: '#F44336' }]}>{doc.document_type || 'DOC'}</Text>
                </View>
                <View style={styles.docInfo}>
                  <Text style={styles.docTitle} numberOfLines={2}>{doc.title || 'Tai lieu'}</Text>
                  <Text style={styles.docDate}>
                    Ban hanh: {doc.request_date ? new Date(doc.request_date).toLocaleDateString('vi-VN') : 'N/A'}
                  </Text>
                </View>
                <ChevronRight size={20} color={COLORS.border} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={previewModal} animationType="slide">
        <View style={styles.previewContainer}>
          <View style={[styles.previewHeader, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => setPreviewModal(false)} style={styles.closeBtn}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.previewTitle}>TRICH XUAT VAN BAN</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.previewScroll} contentContainerStyle={{ padding: 20 }}>
            <View style={[styles.a4Paper, SHADOWS.heavy]}>
              <View style={styles.a4Header}>
                <Text style={styles.a4LeftText}>DOAN TNCS HO CHI MINH{'\n'}TRUONG DH KY THUAT</Text>
                <Text style={styles.a4RightText}>CONG HOA XA HOI CHU NGHIA VIET NAM{'\n'}Doc lap - Tu do - Hanh phuc</Text>
              </View>

              <Text style={styles.a4DocumentTitle}>{selectedDoc?.document_type || 'VAN BAN DIEN TU'}</Text>
              <Text style={styles.a4Paragraph}>{selectedDoc?.purpose || 'Chua co noi dung chi tiet duoc cap nhat.'}</Text>

              <View style={styles.digitalSignature}>
                <Text style={styles.signTitle}>KY BOI: ADMIN HE THONG</Text>
                <Text style={styles.signDate}>
                  Ngay: {selectedDoc?.request_date ? new Date(selectedDoc.request_date).toLocaleDateString('vi-VN') : 'N/A'}
                </Text>
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
            <Text style={styles.sheetTitle}>Tao Yeu cau moi</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Loai hinh dich vu</Text>
              <TextInput style={styles.input} value="Cap lai / xac nhan hanh chinh" editable={false} />
            </View>

            <FormInput control={control} name="reason" placeholder="Trinh bay ly do, ten su kien, noi dung can ho tro..." multiline numberOfLines={4} />

            <View style={styles.btnRow}>
              <PremiumButton
                title="HUY BO"
                variant="ghost"
                onPress={() => {
                  setRequestModal(false);
                  reset();
                }}
                style={{ flex: 1 }}
              />
              <PremiumButton
                title={submitMutation.isPending ? 'DANG GUI' : 'GUI YEU CAU'}
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE0B2',
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
    position: 'absolute',
    bottom: 40,
    right: 20,
    padding: 15,
    borderWidth: 3,
    borderColor: '#D32F2F',
    borderRadius: 10,
    alignItems: 'center',
    transform: [{ rotate: '-10deg' }],
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
});
