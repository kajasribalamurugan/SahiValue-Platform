import React from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';

interface BilingualTextProps {
  officialName: string;
  localHi?: string;
  localMr?: string;
  containerStyle?: ViewStyle;
  primaryStyle?: TextStyle;
  secondaryStyle?: TextStyle;
}

export const BilingualText: React.FC<BilingualTextProps> = ({
  officialName,
  localHi,
  localMr,
  containerStyle,
  primaryStyle,
  secondaryStyle,
}) => {
  const { getBilingualEntity } = useLanguage();
  const { primary, secondary } = getBilingualEntity(officialName, localHi, localMr);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.primary, primaryStyle]}>{primary}</Text>
      {secondary && <Text style={[styles.secondary, secondaryStyle]}>{secondary}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  primary: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  secondary: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748b',
    marginTop: 1,
  },
});
