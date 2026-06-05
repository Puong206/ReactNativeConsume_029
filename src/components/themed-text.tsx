import { Colors } from '@/constants/theme';
import { Platform, StyleSheet, Text, useColorScheme, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'code';
};

export function ThemedText({ style, type = 'default', lightColor, darkColor, ...rest }: ThemedTextProps) {
  const theme = useColorScheme() ?? 'light';
  const color = theme === 'light'
    ? (lightColor ?? Colors.light.text)
    : (darkColor ?? Colors.dark.text);
  return (
    <Text
      style={[
        { color },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'defaultSemiBold' && styles.defaultSemiBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  defaultSemiBold: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 24,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 600,
  },
  link: {
    lineHeight: 24,
    fontSize: 16,
    color: '#0284c7',
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    lineHeight: 20
  },
});
