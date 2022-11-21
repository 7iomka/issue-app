/* eslint-disable @typescript-eslint/no-unused-vars */
import * as yup from 'yup';

declare module 'yup' {
  interface StringSchema<TType, TContext, TDefault, TFlags> {
    phoneRu(): yup.StringSchema;
  }
}

export default yup;
