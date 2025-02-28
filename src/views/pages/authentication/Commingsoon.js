import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Container, Grid, Typography } from '@mui/material';
// project imports
import MainCard from 'ui-component/cards/MainCard';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    color: theme.palette.common.white
  },
  textContainer: {
    textAlign: 'center'
  },
  title: {
    marginBottom: theme.spacing(2)
  },
  subtitle: {
    marginBottom: theme.spacing(2)
  }
}));
const commingsoon = () => {
  const classes = useStyles();

  return (
    <>
      <MainCard title="Leave Management">
        <h2 style={{ textAlign: 'center' }}>Coming Soon</h2>
        <Typography variant="body2">
          Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut enif ad
          minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue dolor in
          reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president, sunk in culpa
          qui officiate descent molls anim id est labours.
        </Typography>

        <div className={classes.root}>
          <Container>
            <div className={classes.textContainer}>
              <Typography variant="h1" className={classes.title}>
                Coming Soon
              </Typography>
              <Typography variant="h5" className={classes.subtitle}>
                We're working hard to bring you something amazing.
              </Typography>
            </div>
          </Container>
        </div>
      </MainCard>
    </>
  );
};

export default commingsoon;
