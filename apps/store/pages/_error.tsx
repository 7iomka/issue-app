import type { NextPageContext } from 'next';
import type { ReactNode } from 'react';

const statusCodes: { [code: number]: string } = {
  400: 'Bad Request',
  404: 'This page could not be found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error',
};

interface ErrorPageProps {
  statusCode: number;
  children?: ReactNode;
  // title?: string;
}

/**
 * `Error` component used for handling errors.
 */

const ErrorPage = (props: ErrorPageProps) => {
  const { children, statusCode } = props;
  return (
    <div>
      <h1 className="text-center">
        {statusCodes[statusCode]} {statusCode}
      </h1>
      {children}
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  // eslint-disable-next-line no-nested-ternary
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
