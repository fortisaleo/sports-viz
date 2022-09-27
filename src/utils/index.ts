export function generateYearsBetween(startYear: string, endYear: string) {
  let startDate = parseInt(startYear);
  const endDate = parseInt(endYear) || new Date().getFullYear();
  let years = [];

  for (var i = startDate; i <= endDate; i++) {
    years.push(startDate.toString());
    startDate++;
  }
  return years;
}
