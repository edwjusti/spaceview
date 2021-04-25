import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme';
import PageFrame from '../components/PageFrame';

export default class MyApp extends App {
  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles) {
      jssStyles.remove();
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>Spaceview</title>
          <meta name="description" content="Explore images from space." />
          <meta property="og:title" content="Spaceview" />
          <meta name="og:description" content="Explore images from space." />
          <meta name="og:url" content="https://spaceview.now.sh" />
          <meta
            name="og:image"
            content="https://spaceview.now.sh/images/app-icon.png"
          />
          <meta property="og:type" content="website" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <PageFrame>
            <Component {...pageProps} />
          </PageFrame>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}
