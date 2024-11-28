import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import Button from '../Button';

const StatusPopup = ({ visible, onClose, title, description, animationSource, buttonTitle }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Animation Section */}
          <LottieView
            style={styles.animation}
            source={animationSource}
            autoPlay
            loop={false}
          />

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Description */}
          <Text style={styles.description}>{description}</Text>

          {/* Action Button */}
          <Button title={buttonTitle || "Close"} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

StatusPopup.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  animationSource: PropTypes.node.isRequired,
  buttonTitle: PropTypes.string, // Optional prop to customize button title
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 5, // Add shadow effect for better visibility
  },
  animation: {
    height: 150,
    width: 150,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 15,
    color: '#555',
  },
});

export default StatusPopup;
