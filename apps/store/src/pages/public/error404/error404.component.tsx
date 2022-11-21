import { createView } from '@/shared/lib/view';

const Error404 = createView().view(() => (
  <div>
    <h1 className="text-center">404 - Страница не найдена</h1>
  </div>
));

export { Error404 };
