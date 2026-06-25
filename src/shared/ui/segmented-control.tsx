import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { Button } from '@/shared/ui/button';
import { useTheme } from '@/hooks/use-theme';

type SegmentOption = {
  label: string;
  value: string;
};

type SegmentedControlProps = {
  onValueChange: (value: string) => void;
  options: readonly SegmentOption[];
  value: string;
};

export function SegmentedControl({ onValueChange, options, value }: SegmentedControlProps) {
  const theme = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.backgroundElement }]}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Button
            key={option.value}
            size="sm"
            style={[
              styles.segment,
              selected && {
                backgroundColor: theme.surface,
                borderColor: theme.surface,
              },
            ]}
            textStyle={styles.segmentText}
            variant={selected ? 'secondary' : 'ghost'}
            onPress={() => onValueChange(option.value)}>
            {option.label}
          </Button>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: Spacing.one,
    padding: Spacing.one,
  },
  segment: {
    borderRadius: Radius.md,
    flex: 1,
    minHeight: 40,
    paddingHorizontal: Spacing.two,
  },
  segmentText: {
    textAlign: 'center',
  },
});
