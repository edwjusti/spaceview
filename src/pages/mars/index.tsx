import React from 'react';
import {
  Grid,
  Typography,
  Card,
  CardHeader,
  CardMedia,
  Divider,
  Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  MarsPhotos,
  RoverList,
  RoverType,
  roverThumbnails,
} from '../../api/MarsPhotos';
import { NextPage } from 'next';
import { dateFormatter, numberFormatter } from '../../util';
import LinkWrapper from '../../components/LinkWrapper';
import Error from 'next/error';
import Head from 'next/head';
import { GetStaticProps } from 'next';

const marsPhotos = new MarsPhotos();
const useStyles = makeStyles(theme => ({
  '@global': {
    a: {
      textDecoration: 'none !important',
      color: 'inherit !important',
    },
  },
  root: {
    paddingTop: theme.spacing(2),
  },
  card: {
    borderRadius: 10,
    transition: 'all 0.5s ease',
    '&:hover': {
      transform: 'scale(1.01)',
      boxShadow: theme.shadows[15],
    },
  },
  media: {
    height: 0,
    paddingTop: '60%',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  details: {
    width: '95%',
    display: 'flex',
    flexDirection: 'column',
    padding: '5%',
    '& > span': {
      width: '100%',
      display: 'inline-flex',
      justifyContent: 'space-between',
      '& h6': {
        marginRight: 10,
      },
    },
  },
}));

const Home: NextPage<RoverList> = ({ rovers = [], error = false }) => {
  const classes = useStyles();

  return error ? (
    <Error statusCode={500} />
  ) : (
    <Container className={classes.root} maxWidth="md">
      <Grid container spacing={4}>
        <Head>
          <title>Spaceview | Mars</title>
        </Head>
        <Grid
          item
          xs={12}
          align="center"
          component={Typography}
          variant="h4"
          color="inherit">
          Missions
        </Grid>
        {rovers.map(rover => (
          <Grid
            key={rover.id}
            component={LinkWrapper}
            href={`/mars/${rover.name}`}
            item
            xl={4}
            sm={6}
            lg={6}
            md={6}
            xs={12}>
            <Card elevation={8} className={classes.card}>
              <CardMedia
                className={classes.media}
                title={rover.name}
                image={
                  roverThumbnails[
                    RoverType[
                      rover.name.toUpperCase() as keyof typeof RoverType
                    ]
                  ]
                }
              />
              <CardHeader
                title={rover.name}
                subheader={`${numberFormatter.format(
                  rover.total_photos
                )} photos`}
              />
              <Divider />
              <div className={classes.details}>
                <span>
                  <Typography variant="subtitle2">Status</Typography>
                  <Typography
                    className={classes.capitalize}
                    variant="caption"
                    color="textSecondary">
                    {rover.status}
                  </Typography>
                </span>
                <span>
                  <Typography variant="subtitle2">Launch date</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {dateFormatter.format(new Date(rover.launch_date))}
                  </Typography>
                </span>
                <span>
                  <Typography variant="subtitle2">Landing date</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {dateFormatter.format(new Date(rover.landing_date))}
                  </Typography>
                </span>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<RoverList> = async () => ({
  props: await marsPhotos.rovers(),
});

export default Home;
