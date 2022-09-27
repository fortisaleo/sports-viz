import { NextPage } from "next";
import Layout from "../components/Layout";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Dialog,
  Grid,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { isArray } from "util";
import { useNbaTeams } from "../api";
import { generateYearsBetween } from "../utils";
import { renderBarChart } from "../utils/barChartRace";

const yearRange = generateYearsBetween("2000", "2021");

const years = yearRange.map((year) => {
  return { label: year };
});

const columns = [
  "WL",
  "MIN",
  "PTS",
  "FGM",
  "FGA",
  "FG_PCT",
  "FG3M",
  "FG3A",
  "FG3_PCT",
  "FTM",
  "FTA",
  "FT_PCT",
  "OREB",
  "DREB",
  "REB",
  "AST",
  "STL",
  "BLK",
  "TOV",
  "PF",
  "PLUS_MINUS",
];
const stats = columns.map((column) => {
  return { label: column };
});

interface ShowResultsProps {
  startYear: string;
  endYear: string;
  stat: string;
}

const ShowResults: React.FC<ShowResultsProps> = ({
  startYear,
  endYear,
  stat,
}) => {
  const { data: barCharts, error: barChartsError } = useNbaTeams({
    startYear,
    endYear,
  });
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [shouldRenderBarChart, setShouldRenderBarChart] =
    useState<boolean>(false);

  if (barChartsError != null) return <div>Error loading team games...</div>;

  if (!barCharts) return <div>Loading...</div>;

  if (Object.keys(barCharts).length === 0) {
    return <div>No team games loaded</div>;
  }

  function handleClickOpen() {
    setIsDialogOpen(true);
  }

  let ticker = null;

  function handleRenderBarChart() {
    const containerDiv = document.getElementById("render-bar-chart");
    if (!shouldRenderBarChart) {
      ticker = renderBarChart({ stat, barCharts, containerDiv });
      setShouldRenderBarChart(true);
    } else {
      ticker?.stop();
      setShouldRenderBarChart(false);
    }
  }

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open BarChart Dialog
      </Button>
      <Dialog fullScreen={true} open={isDialogOpen}>
        <Button variant="outlined" onClick={handleRenderBarChart}>
          {`${
            shouldRenderBarChart ? "Remove bar chart" : "Render Bar chart"
          } BarChart`}
        </Button>
        <div id="render-bar-chart"></div>
        <Button variant="outlined" onClick={() => setIsDialogOpen(false)}>
          Close
        </Button>
      </Dialog>
    </>
  );
};

const Home: NextPage = () => {
  const [startYear, setStartYear] = useState<string | null>(null);
  const [endYear, setEndYear] = useState<string | null>(null);
  const [stat, setStat] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  function onChangeStartYear(
    event: any,
    value: any,
    reason: any,
    details: any
  ) {
    setStartYear(value.label as any);
  }

  function onChangeEndYear(event: any, value: any, reason: any, details: any) {
    setEndYear(value.label as any);
  }

  function onChangeStat(event: any, value: any, reason: any, details: any) {
    setStat(value.label);
  }

  function getResults() {
    if (!startYear || !endYear || !stat) {
      throw new Error("Unable to get results");
    }
    setShowResults(true);
  }

  return (
    <Layout>
      <Container maxWidth="sm" className="mt-10">
        <Box mt={8}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={years}
                renderInput={(params) => (
                  <TextField {...params} label="Start Year" />
                )}
                onChange={onChangeStartYear}
              />
            </Grid>

            <Grid item xs={4}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={years}
                renderInput={(params) => (
                  <TextField {...params} label="End Year" />
                )}
                onChange={onChangeEndYear}
              />
            </Grid>

            <Grid item xs={4}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={stats}
                renderInput={(params) => <TextField {...params} label="Stat" />}
                onChange={onChangeStat}
              />
            </Grid>
          </Grid>
        </Box>
        <Box mt={8}>
          <Button variant="contained" onClick={getResults}>
            Get Results
          </Button>
        </Box>
        {showResults && startYear && endYear && stat && (
          <Box mt={8}>
            <ShowResults startYear={startYear} endYear={endYear} stat={stat} />
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default Home;
