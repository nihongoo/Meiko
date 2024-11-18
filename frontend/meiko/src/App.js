import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicProutes } from './Routes/Index'
import 'bootstrap/dist/css/bootstrap.min.css'
import { AdminLayout, DefaultLayout, LoginLayout } from './component/Layout'
function App() {
  return (
    <Router>
      <div className='m-0 p-0'>
        <Routes>
          {publicProutes.map((route, index) => {
            const Layout = route.layout === 'admin'
            ? AdminLayout
            :route.layout === 'login'
            ? LoginLayout
            :DefaultLayout
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

// const tabs = ['Content','GetImg','Subrice']
// const [type, setType] = useState('GetImg')
// const component = {
//   Content: <Content/>,
//   GetImg: <GetImg/>,
//   Subrice: <Subrice/>
// }
// <h1>React App</h1>
// {tabs.map(tab =>(
//   <button 
//     className='btn border'
//     key={tab}
//     style={type === tab ? {
//       color: '#fff',
//       backgroundColor: '#333'
//     }: {}}
//     onClick={()=>setType(tab)}
//   >
//     {tab}
//   </button>
// ))}
// <div style={{marginTop:20}}>
//   {component[type]}
// </div>