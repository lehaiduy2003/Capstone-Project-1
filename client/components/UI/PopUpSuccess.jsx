import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import PropTypes from "prop-types";
import LottieView from "lottie-react-native";
import { hp, wp } from "../../helpers/common";

const PopupSuccess = ({ visible, onClose }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Animation Section */}
          <LottieView
            style={styles.animationMail}
            source={require("../../assets/animation/animation_success.json")}
            autoPlay
            loop
          />

          {/* Title */}
          <Text style={styles.title}>Add Success</Text>

          {/* Description */}
          <Text style={styles.description}>
            Added successfully! You can now see the details in the list.
          </Text>

          {/* Go to Homepage Button */}
          {/* <TouchableOpacity style={styles.homeButton} onPress={onClose}>
            <Text style={styles.homeButtonText}>Go to Sign In</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

PopupSuccess.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  iconSection: {
    marginBottom: 20,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0FFE5", // Light green background for icon
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 40,
    color: "#34A853", // Checkmark color
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
  },
  homeButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  animationMail: {
    height: hp(30),
    width: wp(100),
    alignItems: "center",
  },
});

export default PopupSuccess;
