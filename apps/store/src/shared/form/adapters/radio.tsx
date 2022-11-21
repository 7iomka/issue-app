import { Radio as NativeRadio } from '@mantine/core';
import { RadioCard as NativeRadioCard } from '@/shared/ui';
import { createField } from '../create-field';

const Radio = createField(NativeRadio);
const RadioGroup = createField(NativeRadio.Group);
const RadioCard = createField(NativeRadioCard);

export { Radio, RadioGroup, RadioCard };
