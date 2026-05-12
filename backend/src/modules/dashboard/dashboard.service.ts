import * as dashboardRepository from "./dashboard.repository";

export async function getSummary() {
  return dashboardRepository.getSummary();
}

export async function getRecentMovements() {
  return dashboardRepository.getRecentMovements();
}
