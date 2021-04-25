import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { PhotoList, EpicImagery, Color } from '../../api/epic';
import SwipeableViews from 'react-swipeable-views';
import { useState } from 'react';
import {
  MobileStepper,
  Button,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { useRouter } from 'next/router';
import Head from 'next/head';

type PageParams = { color?: Color[] };

export const getStaticPaths: GetStaticPaths<PageParams> = async () => ({
  paths: [
    {
      params: {
        color: ['enhanced'],
      },
    },
    {
      params: {
        color: ['natural'],
      },
    },
  ],
  fallback: 'blocking',
});

export const getStaticProps: GetStaticProps<PhotoList, PageParams> = async ({
  params,
}) => {
  const { color = ['natural'] } = params ?? {};
  const epicImagery = new EpicImagery();
  const photoList = await epicImagery.recent(color[0]);

  if (!photoList.photos)
    return {
      notFound: true,
    };

  return {
    props: photoList,
    revalidate: 60 * 60 * 24, // Once a day
  };
};
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

const Epic: NextPage<PhotoList> = ({ photos = [] }) => {
  const classes = useStyles();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = photos?.length ?? 0;
  const defaultColor = ((router?.query?.color as string[]) ?? ['natural'])[0];

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <div className={classes.root}>
      <Head>
        <title>Spaceview | EPIC</title>
        {!!photos.length && (
          <link rel="preload" href={photos[0].image_src} as="image" />
        )}
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
          onChange={(_, color) => {
            setActiveStep(0);
            router.replace({
              pathname: `/epic/${color}`,
            });
          }}
          aria-label="position"
          name="position"
          value={defaultColor}>
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
        {photos.map(metadata => (
          <img
            loading="lazy"
            height={600}
            width={600}
            style={{
              background: [
                `center / contain no-repeat url(${metadata.thumbnail_src})`,
                'linear-gradient(black, black)',
              ].join(','),
            }}
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

export default Epic;
