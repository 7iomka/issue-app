/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import React, { memo } from 'react';
import styles from './error.module.scss';

interface ErrorDebugProps {
  // eslint-disable-next-line react/require-default-props
  error?: Error;
  // eslint-disable-next-line react/require-default-props
  context?: Record<string, unknown>;
}

const ErrorDebug = memo((props: ErrorDebugProps) => {
  const { error, context } = props;
  const { message, stack } = error || {};

  let stringifiedContext;

  if (context) {
    try {
      stringifiedContext = JSON.stringify(context, null, 2);
    } catch (e) {
      stringifiedContext = null;
    }
  }

  return (
    <div>
      <hr className="divide-y w-48 mx-auto" />
      <i>
        The below debug info are only displayed on non-production stages.
        <br />
        Note that debug information about the error are also available on the server/browser
        console.
      </i>

      <h2 className="text-base mt-14">Debug information:</h2>

      <pre className={styles.errorDebugContent}>
        <b>Error message</b>:<br />
        <code>{message}</code>
        <hr />
        {context && (
          <>
            <b>Error additional context</b>:<br />
            <code>{stringifiedContext}</code>
            <hr />
          </>
        )}
        {stack && (
          <>
            <b>Stack trace</b>:<br />
            <code>{stack}</code>
          </>
        )}
      </pre>
    </div>
  );
});

ErrorDebug.displayName = 'ErrorDebug';

export { ErrorDebug };
