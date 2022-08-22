import { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { useMemo, useState } from "react";
import { useTeams } from "../api";
import styles from "../styles/Home.module.css";

const Teams = () => {
  const { data: teams, error } = useTeams();

  if (error != null) return <div>Error loading teams...</div>;
  if (teams == null) return <div>Loading...</div>;

  if (teams.length === 0) {
    return <div className={styles.emptyState}>No teams loaded ☝️️</div>;
  }
  return (
    <ul className={styles.todoList}>
      {teams.map((team) => (
        <li>
          <Link href={`/teams/${team.id}`}>{team.fullName}</Link>
        </li>
      ))}
    </ul>
  );
};

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nba Viz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1 className={styles.title}>Teams</h1>
      </header>

      <main className={styles.main}>
        <Teams />
      </main>
    </div>
  );
};

export default Home;
