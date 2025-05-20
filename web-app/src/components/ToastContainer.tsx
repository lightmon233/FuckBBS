import { ToastContainer } from 'react-toastify';

const backgroundColor = '#fdf2f8';

const CustomToastContainer = () => (
  <ToastContainer
    position="bottom-center"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss={false}
    draggable
    pauseOnHover={false}
    theme="dark"
    toastStyle={{
      backgroundColor
    }}
  />
);

export default CustomToastContainer;
