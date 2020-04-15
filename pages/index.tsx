import React, { Fragment } from 'react';
import {
  makeStyles,
  Typography,
  Link,
  IconButton,
  Grid,
  Button,
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import LinkWrapper from '../src/components/LinkWrapper';

const useStyles = makeStyles({
  '@global': {
    '*': {
      scrollBehavior: 'smooth',
    },
  },
  hero: {
    height: 'calc(100vh - 60px)',
    width: '100%',
    paddingBottom: '15px',
    background: [
      'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8))',
      'url(https://images-assets.nasa.gov/image/iss029e008433/iss029e008433~orig.jpg) center / cover',
    ].join(','),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& p': {
      maxWidth: '90%',
      fontWeight: 400,
      fontSize: 22,
      margin: 'auto',
    },
    '& a': {
      animation: '2s $bounce ease infinite',
    },
  },
  '@keyframes bounce': {
    '0%': { transform: 'scale(1,1) translateY(0)' },
    '10%': { transform: 'scale(1.1,.9) translateY(0)' },
    '30%': { transform: 'scale(.9,1.1) translateY(-20px)' },
    '50%': { transform: 'scale(1,1) translateY(0)' },
    '100%': { transform: 'scale(1,1) translateY(0)' },
  },
  grid: {
    width: '100%',
    margin: '0',
    '& > *': {
      padding: '20px !important',
      height: 400,
      display: 'flex',
      flexDirection: 'column',
      '& h4': {
        margin: 'auto',
      },
      '& a, & button': {
        margin: '0 auto',
      },
    },
  },
  mars: {
    background: [
      'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))',
      'url(/images/curiosity-selfie.jpg) center / cover',
    ].join(','),
  },
  epic: {
    background: [
      'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))',
      'url(/images/epic.png) center / cover',
    ].join(','),
  },
});

function Home() {
  const classes = useStyles();

  return (
    <Fragment>
      <div className={classes.hero}>
        <Typography variant="body2" align="center">
          Explore images from space. Data provided by{' '}
          <Link href="https://api.nasa.gov/">NASA Open APIs</Link>.
        </Typography>
        <IconButton href="#list">
          <ArrowDownwardIcon />
        </IconButton>
      </div>
      <Grid id="list" className={classes.grid} container spacing={10}>
        <Grid className={classes.mars} item xl={6} sm={6} lg={6} md={6} xs={12}>
          <Typography variant="h4">Mars rover photos</Typography>
          <Button component={LinkWrapper} href="/mars">
            Explore
          </Button>
        </Grid>
        <Grid className={classes.epic} item xl={6} sm={6} lg={6} md={6} xs={12}>
          <Typography variant="h4">
            Earth Polychromatic Imaging Camera
          </Typography>
          <Button component={LinkWrapper} href="/epic">
            Explore
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default Home;
