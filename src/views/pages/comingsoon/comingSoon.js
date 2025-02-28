import React from 'react';
import { makeStyles } from '@mui/styles';
import { Container, Typography } from '@mui/material';

const ComingSoon = () => {
    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            color: theme.palette.common.white,
        },
        textContainer: {
            textAlign: 'center',
        },
        title: {
            marginBottom: theme.spacing(2),
        },
        subtitle: {
            marginBottom: theme.spacing(2),
        },
    }));

    const classes = useStyles(); // Don't forget to call useStyles

    return (
        <div>
            <div className={classes.root}>
                <Container>
                    <div className={classes.textContainer}>
                        <Typography variant="h1" className={classes.title}>
                            Coming Soon
                        </Typography>
                        {/* <Typography variant="h5" className={classes.subtitle}>
                            We're working hard to bring you something amazing.
                        </Typography> */}
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default ComingSoon;
