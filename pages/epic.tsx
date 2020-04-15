import { NextPage } from 'next';
import { Photos, EpicImagery, Color } from '../src/api/epic';
import Error from 'next/error';
import SwipeableViews from 'react-swipeable-views';
import { useState } from 'react';
import {
  makeStyles,
  MobileStepper,
  Button,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { useRouter } from 'next/router';
import Head from 'next/head';

const cardHeight = 'calc(100vh - 190px)';
const useStyles = makeStyles({
  root: {
    maxWidth: 600,
    height: cardHeight,
    margin: '0 auto',
  },
  img: {
    height: cardHeight,
    width: '100%',
    background: 'black',
    objectFit: 'contain',
    overflow: 'hidden',
    margin: '-5px 0',
  },
});

interface ResponseProps {
  statusCode?: number;
}

const Epic: NextPage<Photos & ResponseProps> = ({
  photos,
  error,
  statusCode = 500,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = photos?.length ?? 0;
  const defaultColor = (
    (router?.query?.color as string) ?? 'natural'
  ).toLowerCase();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return error ? (
    <Error statusCode={statusCode} />
  ) : (
    <div className={classes.root}>
      <Head>
        <title>Spaceview | EPIC</title>
      </Head>
      <Box
        paddingX="10px"
        height={80}
        alignItems="center"
        display="flex"
        flexDirection="row"
        justifyContent="space-between">
        <Typography variant="h4">EPIC</Typography>
        <RadioGroup
          row
          onChange={(_, color) =>
            router.replace({
              pathname: '/epic',
              query: {
                color,
              },
            })
          }
          aria-label="position"
          name="position"
          defaultValue={defaultColor}>
          <FormControlLabel
            value="natural"
            control={<Radio color="secondary" />}
            label="Natural"
          />
          <FormControlLabel
            value="enhanced"
            control={<Radio color="secondary" />}
            label="Enhanced"
          />
        </RadioGroup>
      </Box>
      <SwipeableViews
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents>
        {photos.map((metadata) => (
          <img
            className={classes.img}
            key={metadata.identifier}
            src={metadata.image_src}
          />
        ))}
      </SwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}>
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </div>
  );
};

Epic.getInitialProps = async ({ query, res }) => {
  const epicImagery = new EpicImagery();
  const colorKey = (query.color as string)?.toUpperCase();
  const color: Color = Color[colorKey || 'NATURAL'];

  if (!color) {
    res.statusCode = 404;

    return { error: true, statusCode: 404 };
  }

  const response = await epicImagery.recent(color);

  if (response.error && res) res.statusCode = 500;

  return response;
};

export default Epic;
