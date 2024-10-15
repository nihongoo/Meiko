import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes } from './routes/index'
import 'bootstrap/dist/css/bootstrap.min.css'
import {adminLayout, defaultLayout, loginLayout} from './component/Layout'

function App() {
  return (
    <Router>
      <div className='m-0 p-0'>
        <Routes>
          {privateRoutes.map((route, index) => {
            const Layout = route.layout === 'admin'
            ? adminLayout
            :route.layout === 'login'
            ? loginLayout
            :defaultLayout
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
