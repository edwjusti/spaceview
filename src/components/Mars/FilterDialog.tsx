import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { CameraType, Photo, Rover } from '../../api/MarsPhotos';
import useNumberInput from '../../hooks/useNumberInput';

interface Props extends DialogProps {
  photos: Photo[];
  rover: Rover;
}

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const FilterDialog: React.FC<Props> = ({ onClose, open, rover }) => {
  const classes = useStyles();
  const sol = useNumberInput(1, 1, rover.max_sol);
  const page = useNumberInput(1, 1);
  const [camera, setCamera] = useState<CameraType>();
  const router = useRouter();
  const onSubmit = (ev: React.SyntheticEvent) => {
    ev.preventDefault();

    const slug = [page.value.toString(), sol.value.toString()];

    if (camera) {
      slug.push(camera);
    }

    onClose?.({}, 'backdropClick');
    router.push(`/mars/${rover.name}/${slug.join('/')}`);
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
            <MenuItem>
              <em>All</em>
            </MenuItem>
            {rover.cameras.map(camera => (
              <MenuItem
                key={camera.name}
                value={
                  CameraType[
                    camera.name.toUpperCase() as keyof typeof CameraType
                  ]
                }>
                {camera.full_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose?.({}, 'backdropClick')}>Cancel</Button>
        <Button onClick={onSubmit} disabled={sol.error || page.error}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
