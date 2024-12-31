// src/components/UI/Tabs.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const Tabs = ({ value, onValueChange, children }) => {
  return <View style={styles.tabs}>{children}</View>;
};

export const TabsList = ({ children, style }) => {
  return <View style={[styles.tabsList, style]}>{children}</View>;
};

export const TabsTrigger = ({ value, children, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(value)}
      style={styles.tabsTrigger}>
      <Text style={styles.tabsTriggerText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabs: { marginTop: 16 },
  tabsList: { flexDirection: 'row', justifyContent: 'space-around' },
  tabsTrigger: { padding: 8, borderBottomWidth: 2, borderBottomColor: 'blue' },
  tabsTriggerText: { fontSize: 16, color: 'blue' },
});
