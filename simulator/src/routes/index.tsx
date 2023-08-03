import {
    createBrowserRouter
} from "react-router-dom";

import Simulator from '../views/Simulator'
import App from '../views'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
    },
    {
        path: "/simulator",
        element: <Simulator/>,
    }
  ]);

export default router;