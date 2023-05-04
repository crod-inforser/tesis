/**
 * Express router paths go here.
 */

import { Immutable } from '@other/types';


const Paths = {
  Base: '/api',
  Convert: {
    Base: '/convert',
    Url: '/url',
    Pause: '/pause',
    Resume: '/resume',
  },
};


// **** Export **** //

export type TPaths = Immutable<typeof Paths>;
export default Paths as TPaths;
