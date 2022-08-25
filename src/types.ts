export interface Team {
  id: number;
  uuId: string;
  createdAt: string;
  fullName: string;
  abbreviation: string;
  yearFounded: number;
  nbaApiId: number;
  addressCity: string;
  addressState: string;
  nickName: string;
}

export interface TeamGame {
  AST: number;
  BLK: number;
  DREB: number;
  FG3A: number;
  FG3M: number;
  FG3_PCT: number;
  FGA: number;
  FGM: number;
  FG_PCT: number;
  FTA: number;
  FTM: number;
  FT_PCT: number;
  GAME_DATE: string;
  GAME_ID: string;
  MATCHUP: string;
  MIN: number;
  OREB: number;
  PF: number;
  PLUS_MINUS: number;
  PTS: number;
  REB: number;
  SEASON_ID: string;
  STL: number;
  TEAM_ABBREVIATION: string;
  TEAM_ID: number;
  TEAM_NAME: string;
  TOV: number;
  WL: string;
  id: number;
  uuId: string;
  nbaApiId: string;
  teamId: number;
  createdAt: string;
}

export interface TotalStats {
  AST: number;
  BLK: number;
  DREB: number;
  FG3A: number;
  FG3M: number;
  FGA: number;
  FGM: number;
  FTA: number;
  FTM: number;
  OREB: number;
  PTS: number;
  REB: number;
  STL: number;
  TOV: number;
  W: number;
  L: number;
}

export interface TotalStatsByTeam {
  [team: string]: TotalStats;
}
