import React, { Fragment, useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  LinearProgress,
} from '@material-ui/core';
import LinkWrapper from './LinkWrapper';
import { Router } from 'next/router';

const useStyles = makeStyles(theme => ({
  title: {
    fontFamily: 'Teko',
    fontWeight: 'bold',
    position: 'relative',
    fontSize: 24,
    color: 'inherit !important',
    textDecoration: 'none',
    transition: 'transform 0.5s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      '&:before': {
        transform: 'translateX(10px)',
      },
      '&:after': {
        transform: 'translateX(-10px)',
      },
    },
    '&:after, &:before': {
      content: '""',
      position: 'absolute',
      height: '2px',
      width: '80%',
      background: 'currentColor',
      transition: 'transform 0.5s ease',
    },
    '&:before': {
      top: 0,
      right: -4,
      animation: '0.5s ease $slideInLeft',
    },
    '&:after': {
      bottom: -2,
      left: -4,
      animation: '0.5s ease $slideInRight',
    },
  },
  progress: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: theme.zIndex.appBar + 1,
  },
  '@keyframes slideInLeft': {
    from: {
      transform: 'translateX(100px)',
    },
    to: {
      transform: 'translateX(0px)',
    },
  },
  '@keyframes slideInRight': {
    from: {
      transform: 'translateX(-100px)',
    },
    to: {
      transform: 'translateX(0px)',
    },
  },
}));

const PageFrame: React.FC = ({ children }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Router.events.on('routeChangeStart', () => setLoading(true));
    Router.events.on('routeChangeComplete', () => setLoading(false));
    Router.events.on('routeChangeError', () => setLoading(false));
  }, []);

  return (
    <Fragment>
      {loading && (
        <LinearProgress
          className={classes.progress}
          variant="query"
          color="secondary"
        />
      )}
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            component={LinkWrapper}
            href="/"
            className={classes.title}
            variant="h6">
            Spaceview
          </Typography>
        </Toolbar>
      </AppBar>
      {React.Children.only(children)}
    </Fragment>
  );
};

export default PageFrame;
