import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../components/theme';
import io from "socket.io-client";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import { Provider, connect } from "react-redux";
import reduxStore from "../redux/store";
import { fetchNotifications } from "../redux/"
import ScrollToTop from "../components/ScrollToTop";
import '../styles/global.scss';
import AOS from "aos";
import "aos/dist/aos.css";

function MyApp(props){
  const { Component, pageProps } = props;
  const ENDPOINT = process.env.SOCKET_URL;
  const { fetchNotifications } = props;

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    let socket = io(ENDPOINT);
    socket.emit('join', {name: 'name', room: 'room'}, (error) => {
    });

    socket.on('notification', (noti) => {
      const {message} = JSON.parse(noti);
      store.addNotification({
        title: "New Notification!",
        message: message,
        type: "info",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
      });
      fetchNotifications();
    })

    fetchNotifications();

  }, [ENDPOINT, fetchNotifications]);

  useEffect(() => {
    AOS.init({
      // Global settings:
      disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
      startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
      initClassName: 'aos-init', // class applied after initialization
      animatedClassName: 'aos-animate', // class applied on animation
      useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
      disableMutationObserver: false, // disables automatic mutations' detections (advanced)
      debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
      throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
    });
  }, [])

  return(
    <React.Fragment>
      <ReactNotification />
      <Head>
        <title>belajar.id</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  )
}

const mapStateToProps = null;
const mapDispatchToProps = (dispatch) => {
  return {
    fetchNotifications: () => dispatch(fetchNotifications())
  }
}

const MyAppWithRedux = connect(mapStateToProps,mapDispatchToProps)(MyApp);

export default function App(props) {
  return (
      <Provider store={reduxStore}>
        <ScrollToTop location={typeof window !== "undefined" ? window.location.pathname : ""}>
          <MyAppWithRedux {...props} />
        </ScrollToTop>
      </Provider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
