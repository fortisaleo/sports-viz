import { NextPage } from "next";
import { useTikToks } from "../../api";

const BarCharts: NextPage = () => {
  const { data: barCharts, error: barChartsError } = useTikToks();

  if (barChartsError != null) return <div>Error loading team games...</div>;

  if (!barCharts) return <div>Loading...</div>;

  if (barCharts.length === 0) {
    return <div>No team games loaded</div>;
  }
  console.log("The bar charts");
  return <div>Bar charts loaded</div>;
};

export default BarCharts;
