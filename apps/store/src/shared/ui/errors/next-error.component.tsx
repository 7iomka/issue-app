import type { NextPage, NextPageContext } from 'next';

const statusCodes: { [code: number]: string } = {
  400: 'Bad Request',
  404: 'This page could not be found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error',
};

type ErrorPageProps = {
  statusCode?: number;
};

/**
 * `Error` component used for handling errors.
 */

const ErrorPage: NextPage<ErrorPageProps> = (props) => {
  const { statusCode } = props;

  return (
    <div>
      <p style={{ background: 'red' }}>
        {statusCode
          ? `An error ${statusCode} occurred on server, ${statusCodes[statusCode]}`
          : 'An error occurred on client'}
      </p>
    </div>
  );
};

ErrorPage.getInitialProps = async ({ res, err }: NextPageContext) => {
  // eslint-disable-next-line no-nested-ternary
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return { statusCode };
};

export { statusCodes, ErrorPage };
