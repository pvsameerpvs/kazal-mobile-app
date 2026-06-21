import { ComponentProps } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type IonName = ComponentProps<typeof Ionicons>['name'];
type MciName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type IconRef =
  | { set: 'ion'; name: IonName }
  | { set: 'mci'; name: MciName };
