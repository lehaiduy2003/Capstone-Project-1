import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const OtpInput = ({ length = 6, onOtpChange = () => { } }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputs = useRef([]);

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    onOtpChange(newOtp.join(''));

    // Focus the next input if available
    if (text && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {Array(length).fill('').map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          style={styles.otpInput}
          maxLength={1}
          keyboardType="numeric"
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          value={otp[index]}
        />
      ))}
    </View>
  );
};

OtpInput.propTypes = {
  length: PropTypes.number,
  onOtpChange: PropTypes.func,
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#D9D9D9',
    marginBottom: 40,
  },
});

export default OtpInput;
