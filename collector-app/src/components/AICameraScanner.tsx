import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Camera, RefreshCw, CheckCircle2, Sparkles, X, ArrowRight, AlertCircle } from 'lucide-react-native';
import { classifyEWasteImage, AIClassifyResponse } from '../services/aiService';
import { useApp } from '../context/AppContext';
import { mapAiMaterialToId } from '../utils/aiMaterialMapper';

interface AICameraScannerProps {
  onConfirmClassification: (materialId: string, aiResult: AIClassifyResponse) => void;
}

export const AICameraScanner: React.FC<AICameraScannerProps> = ({ onConfirmClassification }) => {
  const { materials } = useApp();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [step, setStep] = useState<'camera' | 'preview' | 'analyzing' | 'result'>('camera');
  const [aiResult, setAiResult] = useState<AIClassifyResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStartCamera = async () => {
    setErrorMsg(null);
    setCapturedUri(null);
    setAiResult(null);

    // Request permissions
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        // Fallback to ImagePicker camera
        const pickerRes = await ImagePicker.requestCameraPermissionsAsync();
        if (!pickerRes.granted) {
          Alert.alert(
            'Camera Permission Required',
            'Please grant camera permissions to capture e-waste images for AI classification.'
          );
          return;
        }
      }
    }

    setStep('camera');
    setIsModalVisible(true);
  };

  const handleTakePicture = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        if (photo?.uri) {
          setCapturedUri(photo.uri);
          setStep('preview');
          return;
        }
      }
      
      // Fallback if cameraRef not ready
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCapturedUri(result.assets[0].uri);
        setStep('preview');
      }
    } catch (e: any) {
      console.log('Camera capture error:', e);
      // Fallback launcher
      try {
        const result = await ImagePicker.launchCameraAsync({
          quality: 0.8,
        });
        if (!result.canceled && result.assets?.[0]?.uri) {
          setCapturedUri(result.assets[0].uri);
          setStep('preview');
        }
      } catch (err2: any) {
        Alert.alert('Capture Failed', err2.message || 'Could not capture photo.');
      }
    }
  };

  const handleUsePhoto = async () => {
    if (!capturedUri) return;

    setStep('analyzing');
    setErrorMsg(null);

    try {
      const response = await classifyEWasteImage(capturedUri);
      setAiResult(response);
      setStep('result');
    } catch (err: any) {
      console.log('AI classify error:', err);
      setErrorMsg(err.message || 'Failed to connect to AI server. Please try again.');
      setStep('preview');
    }
  };

  const handleRetake = () => {
    setCapturedUri(null);
    setAiResult(null);
    setErrorMsg(null);
    setStep('camera');
  };

  const handleConfirm = () => {
    if (!aiResult) return;
    const mappedMaterialId = mapAiMaterialToId(aiResult.material, materials);
    setIsModalVisible(false);
    onConfirmClassification(mappedMaterialId, aiResult);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCapturedUri(null);
    setAiResult(null);
    setErrorMsg(null);
  };

  return (
    <>
      {/* Action Banner in Sell E-Waste Screen */}
      <View style={styles.actionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <Sparkles size={22} color="#059669" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeRow}>
              <Text style={styles.aiBadge}>AI POWERED CLASSIFIER</Text>
              <Text style={styles.geminiTag}>Gemini 2.0</Text>
            </View>
            <Text style={styles.cardTitle}>Auto-Identify E-Waste with Camera</Text>
            <Text style={styles.cardDesc}>
              Point your camera at PCB, copper wire, batteries, or devices for instant AI sorting & benchmark pricing.
            </Text>
          </View>
        </View>

        <Pressable style={styles.scanBtn} onPress={handleStartCamera}>
          <Camera size={18} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.scanBtnText}>Scan E-Waste with Camera</Text>
        </Pressable>
      </View>

      {/* Modal Interface for Camera / Preview / AI Results */}
      <Modal visible={isModalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          {/* Top Bar */}
          <View style={styles.topHeader}>
            <Text style={styles.modalTitle}>
              {step === 'camera' && 'Capture E-Waste Photo'}
              {step === 'preview' && 'Review Photo'}
              {step === 'analyzing' && 'AI Processing'}
              {step === 'result' && 'AI Classification Result'}
            </Text>
            <Pressable onPress={handleCloseModal} style={styles.closeBtn}>
              <X size={24} color="#0f172a" />
            </Pressable>
          </View>

          {/* STEP 1: Real In-App Camera View (CameraView MUST HAVE NO CHILDREN) */}
          {step === 'camera' && (
            <View style={styles.cameraWrapper}>
              {permission?.granted ? (
                <>
                  <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
                  <View style={styles.cameraOverlay}>
                    <View style={styles.targetFrame}>
                      <Text style={styles.targetFrameText}>Position E-Waste Item Here</Text>
                    </View>
                    <View style={styles.cameraControls}>
                      <Pressable style={styles.shutterBtn} onPress={handleTakePicture}>
                        <View style={styles.shutterInner} />
                      </Pressable>
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.permissionFallback}>
                  <Camera size={48} color="#059669" />
                  <Text style={styles.fallbackText}>Camera permission requested</Text>
                  <Pressable style={styles.primaryActionBtn} onPress={handleTakePicture}>
                    <Text style={styles.primaryActionBtnText}>Launch System Camera</Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}

          {/* STEP 2: Photo Preview (Retake vs Use Photo) */}
          {step === 'preview' && capturedUri && (
            <View style={styles.previewWrapper}>
              <Image source={{ uri: capturedUri }} style={styles.previewImage} resizeMode="contain" />

              {errorMsg && (
                <View style={styles.errorBox}>
                  <AlertCircle size={18} color="#dc2626" />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}

              <View style={styles.previewActions}>
                <Pressable style={styles.secondaryBtn} onPress={handleRetake}>
                  <RefreshCw size={18} color="#475569" style={{ marginRight: 6 }} />
                  <Text style={styles.secondaryBtnText}>Retake</Text>
                </Pressable>

                <Pressable style={styles.primaryActionBtn} onPress={handleUsePhoto}>
                  <CheckCircle2 size={18} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text style={styles.primaryActionBtnText}>Use Photo</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* STEP 3: Analyzing State */}
          {step === 'analyzing' && (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color="#059669" />
              <Text style={styles.loadingTitle}>Analyzing e-waste...</Text>
              <Text style={styles.loadingSubtitle}>
                Sending image securely to Gemini AI via FastAPI backend...
              </Text>
            </View>
          )}

          {/* STEP 4: Real Gemini AI Classification Result */}
          {step === 'result' && aiResult && (
            <ScrollView style={styles.resultContainer} contentContainerStyle={styles.resultContent}>
              {capturedUri && (
                <Image source={{ uri: capturedUri }} style={styles.resultThumb} resizeMode="cover" />
              )}

              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Sparkles size={20} color="#059669" />
                  <Text style={styles.resultHeaderTitle}>AI Identified Material</Text>
                </View>

                <Text style={styles.materialName}>{aiResult.material}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Category</Text>
                    <Text style={styles.metaValue}>{aiResult.category}</Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Confidence</Text>
                    <Text style={styles.confidenceValue}>
                      {Math.round((aiResult.confidence || 0) * 100)}%
                    </Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Provider</Text>
                    <Text style={styles.providerValue}>
                      {aiResult.provider ? aiResult.provider.toUpperCase() : 'GEMINI'}
                    </Text>
                  </View>
                </View>

                {aiResult.description ? (
                  <View style={styles.descBox}>
                    <Text style={styles.descLabel}>AI Visual Notes</Text>
                    <Text style={styles.descText}>{aiResult.description}</Text>
                  </View>
                ) : null}
              </View>

              {/* Action Buttons: Confirm & Retake */}
              <View style={styles.finalActions}>
                <Pressable style={styles.secondaryBtn} onPress={handleRetake}>
                  <RefreshCw size={18} color="#475569" style={{ marginRight: 6 }} />
                  <Text style={styles.secondaryBtnText}>Retake</Text>
                </Pressable>

                <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
                  <Text style={styles.confirmBtnText}>Confirm Material</Text>
                  <ArrowRight size={18} color="#ffffff" style={{ marginLeft: 6 }} />
                </Pressable>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  actionCard: {
    width: '100%',
    backgroundColor: '#ecfdf5',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  aiBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.5,
  },
  geminiTag: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4f46e5',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#064e3b',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 16,
  },
  scanBtn: {
    width: '100%',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scanBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  closeBtn: {
    padding: 6,
  },

  cameraWrapper: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  targetFrame: {
    width: '80%',
    height: 280,
    borderWidth: 2,
    borderColor: '#10b981',
    borderRadius: 16,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  targetFrameText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cameraControls: {
    alignItems: 'center',
  },
  shutterBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  permissionFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    gap: 16,
  },
  fallbackText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
  },

  previewWrapper: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  previewImage: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#000000',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fecaca',
    marginVertical: 10,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    flex: 1,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  secondaryBtnText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
  },
  primaryActionBtn: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryActionBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },

  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 12,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 8,
  },
  loadingSubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },

  resultContainer: {
    flex: 1,
  },
  resultContent: {
    padding: 16,
    gap: 16,
  },
  resultThumb: {
    width: '100%',
    height: 180,
    borderRadius: 16,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  resultHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
    textTransform: 'uppercase',
  },
  materialName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 14,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#047857',
  },
  providerValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4f46e5',
  },
  descBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 12,
  },
  descLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 2,
  },
  descText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  finalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
    marginBottom: 24,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
