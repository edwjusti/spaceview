import React, { Fragment, useReducer, useEffect, useState } from 'react';
import {
  makeStyles,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItemText,
  ListItemIcon,
  ListItem,
  Typography,
} from '@material-ui/core';
import BackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import CameraIcon from '@material-ui/icons/Camera';
import TodayIcon from '@material-ui/icons/Today';
import { Photo } from '../api/MarsPhotos';
import { dateFormatter } from '../util';

const useStyles = makeStyles(theme => ({
  img: {
    height: '100%',
    width: '100%',
    background: theme.palette.background.paper,
  },
  fullImg: {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
  appBar: {
    background: 'linear-gradient(rgba(0, 0, 0, 0.15) 80%, rgba(0, 0, 0, 0))',
  },
  spacer: {
    flex: 1,
  },
  list: {
    minWidth: 250,
  },
  paper: {
    background: 'black',
    userSelect: 'none',
  },
}));

interface Props {
  photo: Photo;
}

function PhotoCard({ photo }: Props) {
  const classes = useStyles();
  const [drawerOpen, toggleDrawer] = useReducer(v => !v, false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const imageSrc = photo.img_src.replace('http:', 'https:');

  useEffect(() => {
    setDialogOpen(window.location.hash === `#${photo.id}`);

    function onHashChange(ev: HashChangeEvent) {
      setDialogOpen(window.location.hash === `#${photo.id}`);
      ev.stopPropagation();
      ev.preventDefault();
    }

    window.addEventListener('hashchange', onHashChange);

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function openDialog() {
    window.location.hash = photo.id.toString();
  }

  function closeDialog() {
    window.location.hash = '';
  }

  return (
    <Fragment>
      <img
        onClick={openDialog}
        height="300"
        width="300"
        src={imageSrc}
        className={classes.img}
      />
      <Dialog
        fullScreen
        PaperProps={{
          className: classes.paper,
        }}
        open={dialogOpen}
        onClose={closeDialog}>
        <AppBar
          elevation={0}
          position="fixed"
          color="transparent"
          className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={closeDialog}
              aria-label="close">
              <BackIcon />
            </IconButton>
            <div className={classes.spacer} />
            <IconButton
              color="inherit"
              onClick={toggleDrawer}
              aria-label="information">
              <InfoIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer anchor="right" onClose={toggleDrawer} open={drawerOpen}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleDrawer}
              aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6">Info</Typography>
          </Toolbar>
          <List className={classes.list}>
            <ListItem>
              <ListItemIcon>
                <CameraIcon />
              </ListItemIcon>
              <ListItemText
                primary="Camera"
                secondary={photo.camera.full_name}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TodayIcon />
              </ListItemIcon>
              <ListItemText
                primary="Earth date"
                secondary={dateFormatter.format(new Date(photo.earth_date))}
              />
            </ListItem>
          </List>
        </Drawer>
        <img src={imageSrc} className={classes.fullImg} />
      </Dialog>
    </Fragment>
  );
}

export default React.memo(PhotoCard);
