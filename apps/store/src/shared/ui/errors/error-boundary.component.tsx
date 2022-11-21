/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable react/destructuring-assignment */
import { Component, createContext, useContext } from 'react';
import type { ErrorInfo, FC, ReactNode } from 'react';

/**
 * @see https://gist.github.com/jamiebuilds/2a40f565cba317a80bed1eec127340f6
 */
function assert(value: boolean, message?: string): asserts value;
function assert<T>(value: T | null | undefined, message?: string): asserts value is T;
function assert(value: unknown, message?: string): void {
  if (value === false || value == null) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(message || 'Assertion failed');
    }
  }
}

interface ErrorBoundaryState {
  error: Error | null;
}

interface ErrorFallbackProps {
  error: Error;
  onReset: () => void;
}

const ErrorBoundaryContext = createContext<ErrorFallbackProps | null>(null);

function useError(): ErrorFallbackProps {
  const errorBoundaryContext = useContext(ErrorBoundaryContext);

  assert(
    errorBoundaryContext !== null,
    '`useError` must be nested inside an `ErrorBoundaryProvider`.',
  );

  return errorBoundaryContext;
}

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback: FC<React.PropsWithChildren<ErrorFallbackProps>> | JSX.Element;
  onError?: (error: Error, info: ErrorInfo) => void;
  onReset?: () => void;
}

const initialState = { error: null };

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.onReset = this.onReset.bind(this);

    this.state = initialState;
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  onReset(): void {
    this.props.onReset?.();
    this.setState(initialState);
  }

  render() {
    const { error } = this.state;

    if (error !== null) {
      const { fallback: Fallback } = this.props;

      // eslint-disable-next-line react/jsx-no-constructed-context-values
      const contextValue = { error, onReset: this.onReset };

      return (
        <ErrorBoundaryContext.Provider value={contextValue}>
          {typeof Fallback === 'function' ? <Fallback {...contextValue} /> : Fallback}
        </ErrorBoundaryContext.Provider>
      );
    }

    return this.props.children;
  }
}

export type { ErrorBoundaryState, ErrorFallbackProps, ErrorBoundaryProps };
export { useError, ErrorBoundaryContext, ErrorBoundary };
