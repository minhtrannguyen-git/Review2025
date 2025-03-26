import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router/router'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Toaster } from 'react-hot-toast'


export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
        <Toaster position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: '',
            duration: 5000,
            removeDelay: 1000,
            style: {
              background: '#363636',
              color: '#fff',
            },

            // Default options for specific types
            success: {
              duration: 3000,
              iconTheme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }} />
      </BrowserRouter>
    </Provider>
  )
}
