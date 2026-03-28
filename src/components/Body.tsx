import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useAppDispatch } from "../utils/hooks";
import { addUser, removeUser } from "../utils/userSlice";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Watchlist from "./Watchlist";

import Login from "./Login";
import Browse from "./Browse";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "./ErrorPage";
import WatchDashboard from "./intelligence/WatchDashboard";
import AppLayout from "./layout/AppLayout";
import Landing from "./Landing";

const Body = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(addUser({ uid, email, displayName, photoURL }));
      } else {
        dispatch(removeUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/browse",
      element: (
        <ProtectedRoute>
          <AppLayout>
            <Browse />
          </AppLayout>
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <AppLayout>
            <WatchDashboard />
          </AppLayout>
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/watchlist",
      element: (
        <ProtectedRoute>
          <AppLayout>
            <Watchlist />
          </AppLayout>
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
    },

    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

  return <RouterProvider router={appRouter} />;
};

export default Body;
