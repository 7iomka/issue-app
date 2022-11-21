import { SegmentedControl as NativeSegmentedControl } from '@mantine/core';
import { createField } from '../create-field';

export const SegmentedControl = createField(NativeSegmentedControl, ['error']);
