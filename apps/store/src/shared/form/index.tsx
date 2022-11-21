import {
  Form,
  TextInput,
  PhoneInput,
  PasswordInput,
  RadioGroup,
  Radio,
  RadioCard,
  SegmentedControl,
  Select,
} from './adapters';
import { createField } from './create-field';

import { createObjectValidator } from './create-validator';

const Field = {
  TextInput,
  PhoneInput,
  PasswordInput,
  RadioGroup,
  Radio,
  RadioCard,
  SegmentedControl,
  Select,
};

export { Form, Field, createObjectValidator, createField };
