import { NextPage } from "next";

import { useRouter } from "next/router";
import { useTeamGames, useTeams } from "../../api";

const TeamGames = ({ teamId }: { teamId: string }) => {
  const { data: teamGames, error: teamGamesError } = useTeamGames(teamId);

  if (teamGamesError != null) return <div>Error loading team games...</div>;

  if (!teamGames) return <div>Loading...</div>;

  if (teamGames.length === 0) {
    return <div>No team games loaded</div>;
  }

  return (
    <ul>
      {teamGames.map((teamGame) => {
        return (
          <li>
            {teamGame.GAME_DATE}
            {teamGame.MATCHUP}
          </li>
        );
      })}
    </ul>
  );
};

const Team = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: teams, error: teamsError } = useTeams();

  if (teamsError != null) return <div>Error loading teams...</div>;

  if (teams == null) return <div>Loading...</div>;

  if (teams.length === 0) {
    return <div>No teams loaded ☝️️</div>;
  }

  if (typeof id !== "string") {
    return null;
  }

  const team = teams.find((team) => team.id === parseInt(id as string));

  if (!team) {
    return <div>No team found</div>;
  }

  return (
    <div>
      <p>Team: {team.fullName}</p>
      <TeamGames teamId={id} />
    </div>
  );
};

const TeamPage: NextPage = () => {
  return <Team />;
};

export default TeamPage;
