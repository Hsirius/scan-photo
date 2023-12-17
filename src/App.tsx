import React from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';

import routes from './routes';

const Routers: React.FC = () => {
  const renderRouter = (routers: RouteObject[]): RouteObject[] => {
    return routers.map((item: RouteObject) => {
      if (item.children) {
        return {
          ...item,
          element: (
            <React.Suspense>
              <item.component />
            </React.Suspense>
          ),
          children: renderRouter(item.children),
        };
      }
      return {
        ...item,
        element: (
          <React.Suspense>
            <item.component />
          </React.Suspense>
        ),
      };
    });
  };

  return useRoutes(renderRouter(routes));
};

export default Routers;
