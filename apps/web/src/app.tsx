import './app.scss';
import { observer } from 'mobx-react-lite';
import { ApolloProvider } from '@apollo/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ReportPage } from './pages/report/reportPage';
import { ProductListPage } from './pages/productList/productListPage';
import { ApiClient } from './api/apiClient';
import { MasterLayout } from './components/masterLayout/masterLayout';

const months = [
  "Ianuarie",
  "Februarie",
  "Martie",
  "Aprilie",
  "Mai",
  "Iunie",
  "Iulie",
  "August",
  "Septembrie",
  "Octombrie",
  "Noiembrie",
  "Decembrie"
]

export const ReportRouteRedirect = observer(() => {
  return <Navigate to="reports/2025/0" />;
});

const router = createBrowserRouter([
  {
    id: 'root',
    path: "/",
    element: <MasterLayout />,
    children: [
      {
        id: 'reports',
        path: "reports",
        element: <ReportPage />,
        loader: async ({ params }) => {
          return {
            breadcrumb: ['Rapoarte']
          }
        },
        children: [
          {
            id: 'reports/year',
            path: ":year",
            element: <ReportPage />,
            loader: async ({ params }) => {
              return {
                breadcrumb: [
                  'Rapoarte', 
                  params.year]
              }
            },
            children: [
              {
                id: 'reports/year/month',
                path: ":month",
                element: <ReportPage />,
                loader: async ({ params }) => {
                  return {
                    breadcrumb: [
                      'Rapoarte', 
                      params.year, 
                      months[(Number(params.month) ?? 0) - 1]]
                  }
                },
              }
            ]
          }
        ]
      },
      {
        id: 'products',
        path: "products",
        loader: async ({ params }) => {
          return {
            breadcrumb: ['Produse']
          }
        },
        element: <ProductListPage />
      }
    ]
  }
]);

export const App = observer(() => {
  return (
    <ApolloProvider client={ApiClient}>
      <RouterProvider router={router} />
    </ApolloProvider>
  );
});