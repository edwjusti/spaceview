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
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CameraType, Photo, Rover } from '../../api/MarsPhotos';

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
  const router = useRouter();
  const { handleSubmit, register, errors, control, reset } = useForm({
    defaultValues: {
      page: 1,
      sol: 1,
      camera: '',
    },
  });

  useEffect(() => {
    if (router.isReady) {
      const [pageString = '1', solString = '1', camera = ''] =
        (router.query.slug as string[]) ?? [];

      reset({
        page: parseInt(pageString),
        sol: parseInt(solString),
        camera,
      });
    }
  }, [router.isReady]);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      PaperProps={{
        component: 'form',
        // @ts-ignore
        noValidate: true,
        onSubmit: handleSubmit(data => {
          const slug = [data.page.toString(), data.sol.toString()];

          if (data.camera) {
            slug.push(data.camera);
          }

          onClose?.({}, 'backdropClick');
          router.push(`/mars/${rover.name}/${slug.join('/')}`);
        }),
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
          error={!!errors.sol}
          helperText={errors.sol?.message}
          inputRef={register({
            required: {
              value: true,
              message: 'Sol is required',
            },
            min: {
              value: 1,
              message: 'Sol cannot be lower than 1',
            },
            max: {
              value: rover.max_sol,
              message: `Sol must be lower than ${rover.max_sol}`,
            },
            valueAsNumber: true,
          })}
        />
        <TextField
          className={classes.formControl}
          label="Page"
          name="page"
          error={!!errors.page}
          helperText={errors.page?.message}
          inputRef={register({
            required: {
              value: true,
              message: 'Page is required',
            },
            min: {
              value: 1,
              message: 'Page cannot be lower than 1',
            },
            valueAsNumber: true,
          })}
        />
        <FormControl className={classes.formControl}>
          <InputLabel>Camera</InputLabel>
          <Controller
            name="camera"
            control={control}
            as={
              <Select name="camera">
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
            }
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose?.({}, 'backdropClick')}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
