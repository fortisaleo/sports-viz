import { NextPage } from "next";
import { useTikToks } from "../../api";
import { TotalStatsByTeam } from "../../types";
import _ from "lodash";
import { useEffect } from "react";
import * as d3 from "d3";

interface D3Object {
  date: string;
  name: string;
  value: string;
}

const n = 12;
const k = 10;

const margin = { top: 16, right: 6, bottom: 6, left: 0 };
const barSize = 48;
const height = margin.top + barSize * n + margin.bottom;
const width = window ? window.innerWidth : 0;
const y = d3
  .scaleBand()
  .domain(d3.range(n + 1).map((l) => l.toString()))
  .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
  .padding(0.1);

const x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);

const duration = 250;

const formatDate = d3.utcFormat("%Y");

const formatNumber = d3.format(",d");

function textTween(a, b) {
  const i = d3.interpolateNumber(a, b);
  return function (t) {
    this.textContent = formatNumber(i(t));
  };
}

function labels(svg: any, prev: any, next: any) {
  let label = svg
    .append("g")
    .style("font", "bold 12px var(--sans-serif)")
    .style("font-variant-numeric", "tabular-nums")
    .attr("text-anchor", "end")
    .selectAll("text");

  return ([date, data], transition) =>
    (label = label
      .data(data.slice(0, n), (d) => d.name)
      .join(
        (enter) =>
          enter
            .append("text")
            .attr(
              "transform",
              (d) =>
                `translate(${x((prev.get(d) || d).value)},${y(
                  (prev.get(d) || d).rank
                )})`
            )
            .attr("y", y.bandwidth() / 2)
            .attr("x", -6)
            .attr("dy", "-0.25em")
            .text((d) => d.name)
            .call((text) =>
              text
                .append("tspan")
                .attr("fill-opacity", 0.7)
                .attr("font-weight", "normal")
                .attr("x", -6)
                .attr("dy", "1.15em")
            ),
        (update) => update,
        (exit) =>
          exit
            .transition(transition)
            .remove()
            .attr(
              "transform",
              (d) =>
                `translate(${x((next.get(d) || d).value)},${y(
                  (next.get(d) || d).rank
                )})`
            )
            .call((g) =>
              g
                .select("tspan")
                .tween("text", (d) =>
                  textTween(d.value, (next.get(d) || d).value)
                )
            )
      )
      .call((bar) =>
        bar
          .transition(transition)
          .attr("transform", (d) => `translate(${x(d.value)},${y(d.rank)})`)
          .call((g) =>
            g
              .select("tspan")
              .tween("text", (d) =>
                textTween((prev.get(d) || d).value, d.value)
              )
          )
      ));
}

function ticker(svg: any, keyframes: any) {
  const now = svg
    .append("text")
    .style("font", `bold ${barSize}px var(--sans-serif)`)
    .style("font-variant-numeric", "tabular-nums")
    .attr("text-anchor", "end")
    .attr("x", width - 6)
    .attr("y", margin.top + barSize * (n - 0.45))
    .attr("dy", "0.32em")
    .text(formatDate(keyframes[0][0]));

  return ([date], transition) => {
    transition.end().then(() => now.text(formatDate(date)));
  };
}

function axis(svg) {
  const g = svg.append("g").attr("transform", `translate(0,${margin.top})`);

  const axis = d3
    .axisTop(x)
    .ticks(width / 160)
    .tickSizeOuter(0)
    .tickSizeInner(-barSize * (n + y.padding()));

  return (_, transition) => {
    g.transition(transition).call(axis);
    g.select(".tick:first-of-type text").remove();
    g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
    g.select(".domain").remove();
  };
}

function formatData(
  totalStatsByTeam: TotalStatsByTeam,
  stat: string
): D3Object[] {
  const finalData = [];
  const teams = Object.keys(totalStatsByTeam);
  for (const team of teams) {
    const data = totalStatsByTeam[team];
    const years = Object.keys(data);
    for (const year of years) {
      const yearStats = totalStatsByTeam[team][year];
      const statValue = yearStats[stat];
      const row = { date: `${year}-01-01`, name: team, value: statValue };
      finalData.push(row);
    }
  }
  return _.sortBy(finalData, ["year"]);
}

function rank(value: any, names: any) {
  const data = Array.from(names, (name) => ({
    name,
    value: value(name),
    rank: null,
  }));
  data.sort((a, b) => d3.descending(a.value, b.value));
  for (let i = 0; i < data.length; ++i) {
    data[i].rank = Math.min(12, i);
  }
  return data;
}

function getColor(name: string) {
  const scale = d3.scaleOrdinal(d3.schemeTableau10);
  return scale(name);
}

function getKeyFrames(datevalues: any, names: any) {
  const keyframes = [];
  let ka, a, kb, b;
  for ([[ka, a], [kb, b]] of d3.pairs<any>(datevalues)) {
    for (let i = 0; i < k; ++i) {
      const t = i / k;
      keyframes.push([
        new Date(ka * (1 - t) + kb * t),
        rank(
          (name) => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t,
          names
        ),
      ]);
    }
  }
  keyframes.push([new Date(kb), rank((name) => b.get(name) || 0, names)]);
  return keyframes;
}

function bars(svg: any, prev: any, next: any) {
  let bar = svg.append("g").attr("fill-opacity", 0.6).selectAll("rect");

  return ([date, data], transition) =>
    (bar = bar
      .data(data.slice(0, n), (d) => d.name)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("fill", (d) => getColor(d.name))
            .attr("height", y.bandwidth())
            .attr("x", x(0))
            .attr("y", (d) => y((prev.get(d) || d).rank))
            .attr("width", (d) => x((prev.get(d) || d).value) - x(0)),
        (update) => update,
        (exit) =>
          exit
            .transition(transition)
            .remove()
            .attr("y", (d) => y((next.get(d) || d).rank))
            .attr("width", (d) => x((next.get(d) || d).value) - x(0))
      )
      .call((bar) =>
        bar
          .transition(transition)
          .attr("y", (d) => y(d.rank))
          .attr("width", (d) => x(d.value) - x(0))
      ));
}

const BarChartRace = ({
  stat,
  barCharts,
}: {
  stat: string;
  barCharts: TotalStatsByTeam;
}) => {
  let data = formatData(barCharts, stat);
  useEffect(() => {
    const node = document.createElement("div");
    const names = new Set(data.map((d) => d.name));
    const dateValues = Array.from(
      d3.rollup(
        data,
        ([d]) => d.value,
        (d) => d.date,
        (d) => d.name
      )
    )
      .map(([date, data]) => [new Date(date), data])
      .sort(([a], [b]) => {
        const aTyped = a as Date;
        const bTyped = b as Date;
        return d3.ascending(aTyped, bTyped);
      });
    const keyframes = getKeyFrames(dateValues, names);
    const nameFrames = d3.groups(
      keyframes.flatMap(([, data]) => data),
      (d) => d.name
    );
    const prev = new Map(
      nameFrames.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a]))
    );
    const next = new Map(nameFrames.flatMap(([, data]) => d3.pairs(data)));
    const svg = d3
      .select(node)
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

    const updateBars = bars(svg, prev, next);
    const updateAxis = axis(svg);
    const updateLabels = labels(svg, prev, next);
    const updateTicker = ticker(svg, keyframes);

    for (const keyframe of keyframes) {
      const transition = svg
        .transition()
        .duration(duration)
        .ease(d3.easeLinear);

      // Extract the top bar’s value.
      x.domain([0, keyframe[1][0].value]);

      updateAxis(keyframe, transition);
      updateBars(keyframe, transition);
      updateLabels(keyframe, transition);
      updateTicker(keyframe, transition);

      transition.end();
    }
  }, []);

  return null;
};

const BarCharts: NextPage = () => {
  const { data: barCharts, error: barChartsError } = useTikToks();

  if (barChartsError != null) return <div>Error loading team games...</div>;

  if (!barCharts) return <div>Loading...</div>;

  if (Object.keys(barCharts).length === 0) {
    return <div>No team games loaded</div>;
  }
  return (
    <div>
      <BarChartRace stat="PTS" barCharts={barCharts} />
    </div>
  );
};

export default BarCharts;
