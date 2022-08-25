import useSWR, { mutate } from "swr";
import { Team, TeamGame } from "./types";

const teamsPath = "/api/teams";
const teamGamesPath = "/api/teamGame/";
const barChartDataPath = "/api/tikToks";

export const useTeams = () => useSWR<Team[]>(teamsPath);

export const useTeamGames = (teamId: string) =>
  useSWR<TeamGame[]>(`${teamGamesPath}/${teamId}`);

export const useTikToks = () => useSWR<any>(barChartDataPath);
