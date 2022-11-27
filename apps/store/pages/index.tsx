import { fork, serialize } from 'effector';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import { HeaderMenuDrawer } from '@/widgets/header/ui';
// import { Link } from '@/shared/ui';

const Index = () => {
  // const router = useStore($$navigation.$router);
  //   const router2 = useStore($router2);

  return (
    <div>
      <HeaderMenuDrawer />
      {/* Router =>>>>>>>> {router?.asPath ?? 'empty'}
        Router =>>>>>>>> {router2?.asPath ?? 'empty'} */}
      <Link href="/">____GO_TO_THIS_PAGE_AGAIN___</Link>
      <hr />
       <Link href="/index3">____GO_TO_ANOTHER PAGE___</Link>
    </div>
  );
};

export default Index;

export const getStaticProps: GetStaticProps = async () => {
  const scope = fork({
    values: [],
  });

  return {
    props: {
      initialState: serialize(scope),
    },
  };
};
