import { View, Text, StyleSheet, Pressable, ActivityIndicator, Modal, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import useProductStore from '../../store/useProductStore';
import useUploadMultipleImages from '../../hooks/useUploadMultipleImages';
import useUploadVideo from '../../hooks/useUploadVideo';
import ImagePreview from '../UI/ImagePreview';
import { Video } from 'expo-av';

const AddProductModal = ({ visible, onClose, onSuccess }) => {
  const { addProduct, loading } = useProductStore();
  const {
    images,
    pickImage,
    uploadImages,
    loading: uploadingImages,
    removeImage,
  } = useUploadMultipleImages("products");

  const {
    video,
    pickVideo,
    uploadVideo,
    setVideo,
    uploading: uploadingVideo,
  } = useUploadVideo("products");

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    type: '',
    description_content: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    let validatedValue = value;
    if (field === 'price' || field === 'quantity') {
      validatedValue = value.replace(/[^0-9]/g, '');
    }
    if (field === 'name') {
      validatedValue = value.replace(/[^a-zA-Z0-9\s]/g, '').slice(0, 50);
    }
    setFormData(prev => ({
      ...prev,
      [field]: validatedValue
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.price || !formData.quantity || !formData.type) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return false;
    }
    if (!images || images.length === 0) {
      setError('Vui lòng chọn ít nhất 1 hình ảnh');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const uploadedImages = await uploadImages();
      let uploadedVideo = null;
      if (video) {
        uploadedVideo = await uploadVideo();
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        description_imgs: uploadedImages,
        img: uploadedImages[0],
        video: uploadedVideo,
      };

      const result = await addProduct(productData);
      if (result) {
        onSuccess(result);
        onClose();
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi thêm sản phẩm');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Thêm sản phẩm mới</Text>
            <Pressable onPress={onClose}>
              <Feather name="x" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.formContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.uploadBox}>
              <Text style={styles.uploadText}>CHỌN 1-6 HÌNH ẢNH</Text>
            </TouchableOpacity>
            <ImagePreview images={images} onRemove={removeImage} />

            <TouchableOpacity onPress={pickVideo} style={styles.uploadBox}>
              <Text style={styles.uploadText}>CHỌN TỐI ĐA 1 VIDEO</Text>
            </TouchableOpacity>
            {video && (
              <View style={styles.videoPreviewContainer}>
                <Video
                  source={{ uri: video }}
                  style={styles.videoPlayer}
                  useNativeControls
                  resizeMode="contain"
                />
                <TouchableOpacity onPress={() => setVideo(null)} style={styles.removeVideoButton}>
                  <Text style={styles.removeVideoText}>Xóa video</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tên sản phẩm *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Nhập tên sản phẩm"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Giá *</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                placeholder="Nhập giá"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Số lượng *</Text>
              <TextInput
                style={styles.input}
                value={formData.quantity}
                onChangeText={(value) => handleInputChange('quantity', value)}
                placeholder="Nhập số lượng"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Loại sản phẩm *</Text>
              <TextInput
                style={styles.input}
                value={formData.type}
                onChangeText={(value) => handleInputChange('type', value)}
                placeholder="Nhập loại sản phẩm"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Mô tả</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description_content}
                onChangeText={(value) => handleInputChange('description_content', value)}
                placeholder="Nhập mô tả sản phẩm"
                multiline={true}
                numberOfLines={4}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
              style={[styles.submitButton, (loading || uploadingImages || uploadingVideo) && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading || uploadingImages || uploadingVideo}
            >
              {loading || uploadingImages || uploadingVideo ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Thêm sản phẩm</Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    maxHeight: '90%',
    borderRadius: theme.radius.lg,
    padding: wp(4),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  modalTitle: {
    fontSize: hp(2.4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  formContainer: {
    flex: 1,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    borderRadius: theme.radius.lg,
    height: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  uploadText: {
    fontSize: hp(1.8),
    color: theme.colors.text,
  },
  videoPreviewContainer: {
    marginBottom: hp(2),
  },
  videoPlayer: {
    width: '100%',
    height: hp(20),
    borderRadius: theme.radius.lg,
  },
  removeVideoButton: {
    backgroundColor: theme.colors.danger,
    padding: wp(2),
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    marginTop: hp(1),
  },
  removeVideoText: {
    color: 'white',
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
  },
  formGroup: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: hp(1),
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    borderRadius: theme.radius.lg,
    padding: wp(3),
    fontSize: hp(1.8),
  },
  textArea: {
    height: hp(12),
    textAlignVertical: 'top',
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: hp(1.8),
    marginBottom: hp(2),
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: wp(4),
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    marginTop: hp(2),
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: hp(1.8),
    fontWeight: theme.fonts.bold,
  },
});

export default AddProductModal;