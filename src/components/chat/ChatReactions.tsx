import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Colors } from '@/theme';
import { Txt } from '@/components';
import { CHAT_REACTIONS } from '@/constants/chat';

type Props = {
  isMine: boolean;
  onReact: (emoji: string) => void;
  onClose: () => void;
};

export function ChatReactions({ isMine, onReact, onClose }: Props) {
  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(100)}
      style={[styles.row, isMine ? styles.rowMine : styles.rowTheirs]}
    >
      {CHAT_REACTIONS.map((emoji) => (
        <TouchableOpacity
          key={emoji}
          onPress={() => onReact(emoji)}
          style={styles.btn}
        >
          <Txt style={{ fontSize: 22 }}>{emoji}</Txt>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 2,
    marginHorizontal: 8,
    marginBottom: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.bgRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  rowMine: { alignSelf: 'flex-end' },
  rowTheirs: { alignSelf: 'flex-start' },
  btn: { padding: 4 },
});
