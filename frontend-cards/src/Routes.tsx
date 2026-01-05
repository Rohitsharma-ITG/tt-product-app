import {
  Routes as ReactRouterRoutes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import LoginPage from './pages/ugapp/cards/casting-shadows/loginPage.tsx';
import { useAuth } from './hooks/useAuth';

/**
 * File-based routing.
 * @desc File-based routing that uses React Router under the hood.
 * To create a new route create a new .jsx file in `/pages` with a default export.
 *
 * Some examples:
 * * `/pages/index.jsx` matches `/`
 * * `/pages/blog/[id].jsx` matches `/blog/123`
 * * `/pages/[...catchAll].jsx` matches any URL not explicitly matched
 *
 * @param {object} pages value of import.meta.globEager(). See https://vitejs.dev/guide/features.html#glob-import
 *
 * @return {Routes} `<Routes/>` from React Router, with a `<Route/>` for each file in `pages`
 */
interface PagesReqInterface {
  pages: Record<string, unknown>;
}
interface PageInterface {
  default: React.FC;
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    // Redirect to the login page if not authenticated
    // TODO: uncomment this
    // return <Navigate to="/login" />;
  }

  return children;
}

export default function Routes(req: PagesReqInterface) {
  const routes = useRoutes(req.pages);
  const routeComponents = routes.map(({ path, component: Component}) => {
    if (path === '/') {
      return (
        <Route
          key={path}
          path={path}
          element={<Navigate to="/apps/ugapp/cards/casting-shadows" />}
        />
      );
    }

    if (path === '/apps/ugapp/cards/casting-shadows/create') {
      // Wrap the create route in a ProtectedRoute
      return (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <Component />
            </ProtectedRoute>
          }
        />
      );
    }

    return (
      <Route key={path} path={path} element={<Component />} />
    );
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const NotFound = routes!.find(({ path }) => path === "/apps/notFound").component;

  return (
    <ReactRouterRoutes>
      {routeComponents}
      <Route path="/apps/ugapp/login" element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />
    </ReactRouterRoutes>
  );
}

function useRoutes(pages: Record<string, unknown>) {
  const routes = Object.keys(pages)
    .map((key) => {
      let path = key
        .replace("./pages", "")
        .replace(/\.(t|j)sx?$/, "")
        /**
         * Replace /index with /
         */
        .replace(/\/index$/i, "/")
        /**
         * Only lowercase the first letter. This allows the developer to use camelCase
         * dynamic paths while ensuring their standard routes are normalized to lowercase.
         */
        .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
        /**
         * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
         */
        .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`);

      if (path.endsWith("/") && path !== "/") {
        path = path.substring(0, path.length - 1);
      }
      if (!(pages[key] as PageInterface).default) {
        console.warn(`${key} doesn't export a default React component`);
      }
      return {
        path: '/apps' + path,
        component: (pages[key] as PageInterface).default,
      };
    })
    .filter((route) => route.component);
  return routes;
}
