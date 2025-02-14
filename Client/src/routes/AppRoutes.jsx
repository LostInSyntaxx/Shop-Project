import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const AppRoutes = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout/>,
            children:[
                { index: true, element: <Home /> },
                { path: 'shop', element: <Shop/> },
                { path: 'cart', element: <Cart/>},
                { path: 'History', element: <History/> },
                { path: 'Checkout', element:<Checkout/> },
                { path: 'login', element:<Login/>},
                { path: 'register', element: <Register/> }
            ]
        },
        {
            path: '/admin',
            element: <ProtectRouteAdmin element={<LayoutAdmin/>} />,
            children: [
                { index: true, element: <Dashboard/> },
                { path: 'category', element: <Category/> },
                { path: 'product', element: <Product/> },
                { path: 'manage', element: <Manage/>}
            ]
        },
        {
            path: '/user',
            //element: <LayoutUser/>,
            element: <ProtectRouteUser element={<LayoutUser/>}/>,
            children: [
                { index: true, element: <HomeUser/> },
            ]
        }


    ])
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}
export default AppRoutes
