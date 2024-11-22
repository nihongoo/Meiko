import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes/index'
import 'bootstrap/dist/css/bootstrap.min.css'
import { adminLayout, loginLayout, UserLayout } from './component/Layout'

function App() {
  return (
    <Router>
      <div className='m-0 p-0'>
        <Routes>
          {privateRoutes.map((route, index) => {
            const Layout = route.layout === 'admin'
              ? adminLayout
              : loginLayout
            const Page = route.component
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }>
              </Route>
            )
          })}
          {publicRoutes.map((route, index) => {
            const Layout = route.layout === 'user'
              ? UserLayout
              : loginLayout;
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
