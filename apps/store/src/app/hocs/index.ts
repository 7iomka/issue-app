import compose from 'lodash.flowright';
import { withEffectorProvider } from './with-effector-provider';

/**
 * @hoc Application initialization logic
 * @remark Contains:
 * - Effector itinialisation logic (Provider, scope bindings, etc.) (withEffectorProvider)
 */
const withHocs = compose(withEffectorProvider);

export { withHocs };
