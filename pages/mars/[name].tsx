import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import {
  RoverType,
  MarsPhotos,
  CameraType,
  Rover,
  Photo,
} from '../../src/api/MarsPhotos';
import {
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogProps,
  TextField,
  DialogContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  DialogActions,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FilterIcon from '@material-ui/icons/FilterList';
import Router from 'next/router';
import Error from 'next/error';
import PhotoCard from '../../src/components/PhotoCard';
import { capitalize } from '../../src/util';
import Head from 'next/head';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '95%',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

interface Props {
  photos?: Photo[];
  rover?: Rover;
  statusCode?: number;
  error?: boolean;
}

interface InputError {
  error: boolean;
  helperText?: string;
}

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

function useNumberInput(
  initial: number,
  min: number = 0,
  max: number = Infinity
) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState<InputError>({ error: false });
  const onChange = useCallback((ev: ChangeEvent) => {
    const currentValue = ev.target.value.trim();
    const name = capitalize(ev.target.name ?? 'value');

    setError({ error: false });

    if (!currentValue) {
      setError({
        error: true,
        helperText: `${name} is required`,
      });
      setValue(null);
      return;
    }

    if (!/^-?[0-9]+$/.test(currentValue)) return ev.preventDefault();

    const num = parseInt(currentValue);

    if (num < min)
      setError({
        error: true,
        helperText: `${name} must be greater than ${min}`,
      });

    if (num > max)
      setError({
        error: true,
        helperText: `${name} must be lower than ${max}`,
      });

    setValue(num);
  }, []);

  return {
    value,
    onChange,
    ...error,
  };
}

function FilterDialog({ onClose, open, rover }: Props & DialogProps) {
  const classes = useStyles();
  const sol = useNumberInput(1, 1, rover.max_sol);
  const page = useNumberInput(1, 1);
  const [camera, setCamera] = useState<CameraType>(null);
  const onSubmit = (ev: React.SyntheticEvent) => {
    ev.preventDefault();

    onClose({}, 'backdropClick');
    Router.push(
      `/mars/[name]?sol=${sol.value}&camera=${camera}&page=${page.value}`,
      `/mars/${rover.name}?sol=${sol.value}&camera=${camera}&page=${page.value}`
    );
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      PaperProps={{
        component: 'form',
        onSubmit,
      }}
      keepMounted
      open={open}
      onClose={onClose}>
      <DialogTitle>Filter</DialogTitle>
      <DialogContent
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
        <TextField
          className={classes.formControl}
          label="Sol"
          name="sol"
          {...sol}
        />
        <TextField
          className={classes.formControl}
          label="Page"
          name="page"
          {...page}
        />
        <FormControl className={classes.formControl}>
          <InputLabel>Camera</InputLabel>
          <Select
            name="camera"
            value={camera ?? ''}
            onChange={event => setCamera(event.target.value as CameraType)}>
            <MenuItem value={null}>
              <em>All</em>
            </MenuItem>
            {rover.cameras.map(camera => (
              <MenuItem
                key={camera.name}
                value={CameraType[camera.name.toUpperCase()]}>
                {camera.full_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose({}, 'backdropClick')}>Cancel</Button>
        <Button onClick={onSubmit} disabled={sol.error || page.error}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Photos: NextPage<Props> = ({
  photos,
  rover,
  error,
  statusCode = 500,
}) => {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);

  return error ? (
    <Error statusCode={statusCode} />
  ) : (
    <Grid className={classes.root} container spacing={1}>
      <Head>
        <title>Spaceview | {rover.name} rover</title>
      </Head>
      <Grid item xs={12} className={classes.header}>
        <Typography variant="h4">{rover.name}</Typography>
        <Button onClick={() => setDialogOpen(true)}>
          Filter <FilterIcon />
        </Button>
        <FilterDialog
          rover={rover}
          onClose={() => setDialogOpen(false)}
          open={dialogOpen}
        />
      </Grid>
      {!photos.length && (
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
  );
};

Photos.getInitialProps = async ({ query, res }) => {
  const name = query.name as string;
  const cameraName = query.camera as string;
  const rover: RoverType = RoverType[name?.toUpperCase()];
  const api = new MarsPhotos();
  const page = parseInt((query.page ?? '1') as string);
  const sol = parseInt((query.sol ?? '1') as string);
  const camera = CameraType[cameraName?.toUpperCase()];

  res?.setHeader('Cache-Control', 's-maxage=86400');

  if (rover == undefined) {
    if (res) res.statusCode = 404;

    return { error: true, statusCode: 404 };
  }

  const [roverInfo, roverPhotos] = await Promise.all([
    api.rover(rover),
    api.photos(rover, {
      camera,
      page,
      sol,
    }),
  ]);
  const error = roverInfo.error || roverPhotos.error;

  if (error && res) res.statusCode = 500;

  return {
    rover: roverInfo.rover,
    photos: roverPhotos.photos ?? [],
    error,
  };
};

export default Photos;
