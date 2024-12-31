
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const CardContent = ({ children, style }) => (
  <View style={[styles.content, style]}>{children}</View>
);

export const CardHeader = ({ children, style }) => (
  <View style={[styles.header, style]}>{children}</View>
);

export const CardTitle = ({ children, style }) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  card: { padding: 16, margin: 8, backgroundColor: '#fff', borderRadius: 8 },
  content: { marginTop: 8 },
  header: { marginBottom: 8 },
  title: { fontSize: 18, fontWeight: 'bold' },
});
