import { Text, TextProps } from 'react-native';
import { Type } from '@/theme';

/** Typography helper bound to the design-system text styles. */
export function Txt({
  variant = 'body',
  style,
  ...rest
}: TextProps & { variant?: keyof typeof Type }) {
  return <Text {...rest} style={[Type[variant], style]} />;
}
