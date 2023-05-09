// export namespace client {
//     export namespace test {
//         export function hello(): string {
//             const message = 'Hello world!';
//             console.log(message);
//             return message;
//         }
//     }
// }


// export namespace client {
//     export namespace utils {
//         export function hello(): string {
//             const message = 'Hello world2!';
//             console.log(message);
//             return message;
//         }
//     }
// }

import * as utils from './utils';
import * as auth from './auth';

export * from './dialogs';

export { utils, auth };
