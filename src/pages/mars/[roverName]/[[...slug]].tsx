import React, { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import {
  RoverType,
  MarsPhotos,
  CameraType,
  Rover,
  Photo,
} from '../../../api/MarsPhotos';
import { Typography, Grid, Button, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FilterIcon from '@material-ui/icons/FilterList';
import PhotoCard from '../../../components/PhotoCard';
import Head from 'next/head';
import FilterDialog from '../../../components/Mars/FilterDialog';

interface Props {
  photos: Photo[];
  rover: Rover;
}

type RouteParams = {
  roverName: string;
  slug?: string[];
};

export const getStaticPaths: GetStaticPaths<RouteParams> = async () => {
  const marsPhotos = new MarsPhotos();
  const { rovers = [] } = await marsPhotos.rovers();

  return {
    fallback: 'blocking',
    paths: rovers.map(rover => ({
      params: {
        roverName: rover.name,
        slug: [],
      },
    })),
  };
};

export const getStaticProps: GetStaticProps<Props, RouteParams> = async ({
  params,
}) => {
  if (!params)
    return {
      notFound: true,
    };

  const [pageString = '1', solString = '1', cameraName = ''] =
    params.slug ?? [];
  const rover: RoverType =
    RoverType[params.roverName.toUpperCase() as keyof typeof RoverType];
  const api = new MarsPhotos();
  const page = parseInt(pageString);
  const sol = parseInt(solString);
  const camera =
    CameraType[cameraName.toUpperCase() as keyof typeof CameraType];

  const [roverInfo, roverPhotos] = await Promise.all([
    api.rover(rover),
    api.photos(rover, {
      camera,
      page,
      sol,
    }),
  ]);

  if (!roverInfo.rover || !page || !sol) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      rover: roverInfo.rover,
      photos: roverPhotos.photos ?? [],
    },
    revalidate: 60 * 60 * 24,
  };
};

const useStyles = makeStyles(() => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
  },
}));

const Photos: React.FC<Props> = ({ photos, rover }) => {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={1}>
        <Head>
          <title>Spaceview | {rover.name} rover</title>
        </Head>
        <Grid item xs={12} className={classes.header}>
          <Typography variant="h4">{rover.name}</Typography>
          <Button onClick={() => setDialogOpen(true)}>
            Filter <FilterIcon />
          </Button>
          <FilterDialog
            photos={photos}
            rover={rover}
            onClose={() => setDialogOpen(false)}
            open={dialogOpen}
          />
        </Grid>
        {!photos?.length && (
          <Grid xs={12}>
            <Typography
              style={{ lineHeight: '40vh' }}
              align="center"
              variant="h5">
              No search results
            </Typography>
          </Grid>
        )}
        {photos.map(photo => (
          <Grid key={photo.id} item xl={2} lg={2} xs={4} sm={3}>
            <PhotoCard photo={photo} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Photos;
