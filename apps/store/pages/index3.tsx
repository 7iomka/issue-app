import { useStore, useUnit, useEvent } from 'effector-react/scope';
import { fork, serialize } from 'effector';
import Link from 'next/link';
import { HeaderMenuDrawer } from '@/widgets/header/ui';
import { fetchCalled } from '@/shared/router';

const Index3 = () => {
  const callFetch = useUnit(fetchCalled);

  return (
    <div>
      <HeaderMenuDrawer />
      <button type="button" onClick={() => callFetch()}>
        call fx and after go to home
      </button>
      <hr />
      <Link href="/">Manual go to homepage PAGE___</Link>
    </div>
  );
};

export default Index3;

export const getStaticProps = async () => {
  const scope = fork({
    values: [],
  });

  return {
    props: {
      initialState: serialize(scope),
    },
  };
};
