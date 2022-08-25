import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { NextPage } from "next";
import NextLink from "next/link";
import Head from "next/head";
import { useMemo, useState } from "react";
import { useTeams } from "../api";
import styles from "../styles/Home.module.css";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const Teams = () => {
  const { data: teams, error } = useTeams();

  if (error != null) return <div>Error loading teams...</div>;
  if (teams == null) return <div>Loading...</div>;

  if (teams.length === 0) {
    return <div className={styles.emptyState}>No teams loaded ☝️️</div>;
  }

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      {/* End hero unit */}
      <Grid container spacing={4}>
        {teams.map((team) => (
          <Grid item key={team.fullName} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  // 16:9
                  pt: "56.25%",
                }}
                image="https://source.unsplash.com/random"
                alt="random"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {team.fullName}
                </Typography>
                <Typography>City: {team.addressCity}</Typography>
                <Typography>State: {team.addressState}</Typography>
              </CardContent>
              <CardActions>
                <NextLink href={`/teams/${team.id}`}>
                  <Button size="small">View season</Button>
                </NextLink>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Nba Viz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <CameraIcon sx={{ mr: 2 }} />
            <Typography variant="h6" color="inherit" noWrap>
              Sports Visualizations
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          {/* Hero unit */}
          <Box
            sx={{
              bgcolor: "background.paper",
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Teams
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                Click on any team below to get some more information about a
                particular season
              </Typography>
            </Container>
          </Box>
          <Teams />

          <NextLink href={`/barchats`}>
            <Button size="small">View season</Button>
          </NextLink>
        </main>
        {/* Footer */}
        <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
          <Typography variant="h6" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            Something here to give the footer a purpose!
          </Typography>
          <Copyright />
        </Box>
        {/* End footer */}
      </ThemeProvider>
    </div>
  );
};

export default Home;
