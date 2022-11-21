export interface DOMProps {
  id?: string;
  className?: string;
}

export interface FocusableDOMProps {
  excludeFromTabOrder?: boolean;
}

export interface AriaLabelingProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-details'?: string;
}

export interface AriaValidationProps {
  'aria-errormessage'?: string;
}
