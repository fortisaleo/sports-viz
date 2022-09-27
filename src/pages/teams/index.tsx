import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { NextPage } from "next";
import NextLink from "next/link";
import { useTeams } from "../../api";
import styles from "../../styles/Home.module.css";
import Layout from "../../components/Layout";

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
                image={team.logoUrl}
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
    <Layout>
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
    </Layout>
  );
};

export default Home;
