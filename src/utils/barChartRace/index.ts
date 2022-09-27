import { TotalStatsByTeam } from "../../types";
import _ from "lodash";
import * as d3 from "d3";
import { NBA_TEAM_COLORS } from "./colors";

interface D3Object {
  date: string;
  name: string;
  value: string;
}

const n = 12;
const k = 10;

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

function halo(text, strokeWidth) {
  text
    .select(function () {
      return this.parentNode.insertBefore(this.cloneNode(true), this);
    })
    .style("fill", "#ffffff")
    .style("stroke", "#ffffff")
    .style("stroke-width", strokeWidth)
    .style("stroke-linejoin", "round")
    .style("opacity", 1);
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

function toDecimalYear(d: Date) {
  // Copy date so don't affect original and set to start of day
  d.setHours(0, 0, 0, 0);
  let year = d.getFullYear();
  let yearStart = new Date(year, 0, 1);
  let dayNum = Math.round((d.valueOf() - yearStart.valueOf()) / 8.64e7);
  let daysInYear = Math.round(
    (new Date(year + 1, 0, 1).valueOf() - yearStart.valueOf()) / 8.64e7
  );
  return +(year + dayNum / daysInYear).toFixed(1);
}

function getKeyFrames(datevalues: any, names: any) {
  const keyframes = [];
  let ka, a, kb, b;
  for ([[ka, a], [kb, b]] of d3.pairs<any>(datevalues)) {
    for (let i = 0; i < k; ++i) {
      const t = i / k;
      keyframes.push([
        toDecimalYear(new Date(ka * (1 - t) + kb * t)),
        rank(
          (name) => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t,
          names
        ),
      ]);
    }
  }
  keyframes.push([
    toDecimalYear(new Date(kb)),
    rank((name) => b.get(name) || 0, names),
  ]);
  return keyframes;
}

interface Data {
  name: string;
  value: number;
  rank: number;
  lastValue: number;
  barColor: d3.HSLColorFactory;
  textColor: d3.HSLColorFactory;
}

type Keyframe = [number, Data[]];

function getValidYears(keyFrames: Keyframe[]) {
  return keyFrames.map((keyFrame) => keyFrame[0]);
}

function addLastValueToKeyFrames(oldKeyFrames: any): Keyframe[] {
  let keyFrames = _.cloneDeep(oldKeyFrames);
  const names = {};
  for (let i = 0; i != keyFrames.length; i++) {
    const lastEntryI = Math.max(0, i - 1);
    const lastEntry = keyFrames[lastEntryI];
    const currentYearValue = keyFrames[i][1];
    const lastYearValue = keyFrames[lastEntryI][1];
    for (const entry of currentYearValue) {
      const lastYearEntry = lastYearValue.find(
        (lastYearEntry) => lastYearEntry.name === entry.name
      );
      entry.lastValue = lastYearEntry.value;
      if (!names[entry.name]) {
        names[entry.name] = d3.hsl(Math.random() * 360, 0.75, 0.75);
      }
      const color = NBA_TEAM_COLORS[entry.name];
      entry.barColor = d3.rgb(color.bar.r, color.bar.g, color.bar.b);
      entry.textColor = d3.rgb(color.text.r, color.text.g, color.text.b);
    }
  }
  return keyFrames;
}

function appendMetaData(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
) {
  const { height, width } = getBarChatConfig();
  let title = svg
    .append("text")
    .attr("class", "title")
    .attr("y", 24)
    .html("39 Years of Baseketball");

  let subtitle = svg
    .append("text")
    .attr("class", "subTitle")
    .attr("y", 55)
    .html("Points, $m");

  let caption = svg
    .append("text")
    .attr("class", "caption")
    .attr("x", width)
    .attr("y", height - 5)
    .style("text-anchor", "end")
    .html("Nba Api");
  return { title, subtitle, caption };
}

function getBarChatConfig() {
  const height = 600;
  const width = 960;
  const margin = {
    top: 80,
    right: 0,
    bottom: 5,
    left: 0,
  };
  const tickDuration = 500;
  const top_n = 12;
  const barPadding = (height - (margin.bottom + margin.top)) / (top_n * 5);
  return { height, width, margin, tickDuration, top_n, barPadding };
}

export function renderBarChart({
  stat,
  barCharts,
  containerDiv,
}: {
  stat: string;
  barCharts: TotalStatsByTeam;
  containerDiv: HTMLElement;
}) {
  let ticker = null;
  let data = formatData(barCharts, stat);
  const { height, width, margin, tickDuration, top_n, barPadding } =
    getBarChatConfig();
  const svg = d3
    .select(containerDiv)
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  const { title, subtitle, caption } = appendMetaData(svg);
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
  const formattedKeyFrames = addLastValueToKeyFrames(keyframes);
  const validYears = getValidYears(formattedKeyFrames);
  const yearTracker = 0;
  let year = validYears[yearTracker];

  let yearSlice = formattedKeyFrames
    .filter((d) => d[0] === year)
    .map((e) => e[1])[0];

  let x = d3
    .scaleLinear()
    .domain([0, d3.max(yearSlice, (d) => d.value)])
    .range([margin.left, width - margin.right - 65]);

  let y = d3
    .scaleLinear()
    .domain([top_n, 0])
    .range([height - margin.bottom, margin.top]);

  let xAxis = d3
    .axisTop(x)
    .ticks(width > 500 ? 5 : 2)
    .tickSize(-(height - margin.top - margin.bottom))
    .tickFormat((d) => d3.format(",")(d));

  svg
    .append("g")
    .attr("class", "axis xAxis")
    .attr("transform", `translate(0, ${margin.top})`)
    .call(xAxis)
    .selectAll(".tick line")
    .classed("origin", (d) => d == 0);

  svg
    .selectAll("rect.bar")
    .data(yearSlice, (d) => (d as any).name)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", x(0) + 1)
    .attr("width", (d) => x(d.value) - x(0) - 1)
    .attr("y", (d) => y(d.rank) + 5)
    .attr("height", y(1) - y(0) - barPadding)
    .style("fill", (d) => d.barColor as any);

  svg
    .selectAll("text.label")
    .data(yearSlice, (d) => (d as any).name)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", (d) => x((d as any).value) - 8)
    .attr("y", (d) => y((d as any).rank) + 5 + (y(1) - y(0)) / 2 + 1)
    .style("text-anchor", "end")
    .style("fill", (d) => d.textColor as any)
    .html((d) => (d as any).name);

  svg
    .selectAll("text.valueLabel")
    .data(yearSlice, (d) => (d as any).name)
    .enter()
    .append("text")
    .attr("class", "valueLabel")
    .attr("x", (d) => x((d as any).value) + 5)
    .attr("y", (d) => y((d as any).rank) + 5 + (y(1) - y(0)) / 2 + 1)
    .text((d) => d3.format(",.0f")((d as any).lastValue));

  let yearText = svg
    .append("text")
    .attr("class", "yearText")
    .attr("x", width - margin.right)
    .attr("y", height - 25)
    .style("text-anchor", "end")
    .html(~~year as any)
    .call(halo, 10);

  ticker = d3.interval((e) => {
    yearSlice = formattedKeyFrames
      .filter(
        (d) => parseFloat(d[0].toString()) === parseFloat(year.toString())
      )
      .map((e) => e[1])[0];

    x.domain([0, d3.max(yearSlice, (d) => d.value)]);

    svg
      .select(".xAxis")
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .call(xAxis as any);

    let bars = svg.selectAll(".bar").data(yearSlice, (d) => (d as any).name);

    bars
      .enter()
      .append("rect")
      .attr("class", (d) => `bar ${(d as any).name.replace(/\s/g, "_")}`)
      .attr("x", x(0) + 1)
      .attr("width", (d) => x((d as any).value) - x(0) - 1)
      .attr("y", (d) => y(top_n + 1) + 5)
      .attr("height", y(1) - y(0) - barPadding)
      .style("fill", (d) => (d as any).colour)
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr("y", (d) => y((d as any).rank) + 5);

    bars
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr("width", (d) => x((d as any).value) - x(0) - 1)
      .attr("y", (d) => y((d as any).rank) + 5);

    bars
      .exit()
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr("width", (d) => x((d as any).value) - x(0) - 1)
      .attr("y", (d) => y(top_n + 1) + 5)
      .remove();

    let labels = svg
      .selectAll(".label")
      .data(yearSlice, (d) => (d as any).name);

    labels
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x((d as any).value) - 8)
      .attr("y", (d) => y(top_n + 1) + 5 + (y(1) - y(0)) / 2)
      .style("text-anchor", "end")
      .html((d) => (d as any).name)
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr("y", (d) => y((d as any).rank) + 5 + (y(1) - y(0)) / 2 + 1);

    labels
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr("x", (d) => x((d as any).value) - 8)
      .attr("y", (d) => y((d as any).rank) + 5 + (y(1) - y(0)) / 2 + 1);

    labels
      .exit()
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr("x", (d) => x((d as any).value) - 8)
      .attr("y", (d) => y(top_n + 1) + 5)
      .remove();

    let valueLabels = svg
      .selectAll(".valueLabel")
      .data(yearSlice, (d) => (d as any).name);

    valueLabels
      .enter()
      .append("text")
      .attr("class", "valueLabel")
      .attr("x", (d) => x((d as any).value) + 5)
      .attr("y", (d) => y(top_n + 1) + 5)
      .text((d) => d3.format(",.0f")((d as any).lastValue))
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr("y", (d) => y((d as any).rank) + 5 + (y(1) - y(0)) / 2 + 1);

    valueLabels
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr("x", (d) => x((d as any).value) + 5)
      .attr("y", (d) => y((d as any).rank) + 5 + (y(1) - y(0)) / 2 + 1)
      .tween("text", function (d) {
        let i = d3.interpolateRound((d as any).lastValue, (d as any).value);
        return function (t) {
          (this as any).textContent = d3.format(",")(i(t));
        };
      });

    valueLabels
      .exit()
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr("x", (d) => x((d as any).value) + 5)
      .attr("y", (d) => y(top_n + 1) + 5)
      .remove();

    yearText.html(~~year as any);

    const lastYear = validYears[validYears.length - 1];

    if (year >= lastYear) {
      ticker.stop();
      return;
    }
    let possibleNextYear = d3.format(".1f")(+year + 0.1);
    while (
      year != lastYear &&
      !validYears.includes(parseFloat(possibleNextYear))
    ) {
      possibleNextYear = d3.format(".1f")(+possibleNextYear + 0.1);
    }
    (year as any) = possibleNextYear;
  }, tickDuration);
  return ticker;
}
