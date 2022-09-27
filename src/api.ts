import useSWR, { mutate } from "swr";
import { Team, TeamGame, TotalStatsByTeam } from "./types";

const teamsPath = "/api/teams";
const teamGamesPath = "/api/teamGame/";
const barChartDataPath = "/api/tikToks";
const nbaTeamsApi = "/api/nba/teams";

export const useTeams = () => useSWR<Team[]>(teamsPath);

export const useTeamGames = (teamId: string) =>
  useSWR<TeamGame[]>(`${teamGamesPath}/${teamId}`);

export const useTikToks = () => useSWR<TotalStatsByTeam>(barChartDataPath);

export const useNbaTeams = (params: any) =>
  useSWR<TotalStatsByTeam>(
    `${nbaTeamsApi}?${new URLSearchParams(params).toString()}`
  );
