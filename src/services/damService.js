import { DAMS_DATA } from "../data/damData";

let localDams = [...DAMS_DATA];

export const damService = {
  async getAllDams() {
    // Simulating async API call for future FastAPI backend
    return Promise.resolve([...localDams]);
  },

  async getDamById(id) {
    const dam = localDams.find((d) => d.id === id) || localDams[0];
    return Promise.resolve(dam);
  },

  async updateDam(id, updatedFields) {
    localDams = localDams.map((d) => (d.id === id ? { ...d, ...updatedFields } : d));
    return Promise.resolve(localDams.find((d) => d.id === id));
  },

  async addDam(newDam) {
    const dam = {
      ...newDam,
      id: `dam-${Date.now()}`,
      storagePercentage: Math.round(((newDam.currentWaterLevel / newDam.fullReservoirLevel) * 100) * 10) / 10,
    };
    localDams.unshift(dam);
    return Promise.resolve(dam);
  },

  getWaterLevelTrend(damId, hours = 24) {
    const baseDam = localDams.find((d) => d.id === damId) || localDams[0];
    const data = [];
    const now = new Date();

    for (let i = hours; i >= 0; i -= 2) {
      const time = new Date(now.getTime() - i * 3600 * 1000);
      const timeLabel = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const variation = Math.sin(i / 3) * 1.8 + (hours - i) * 0.15;
      const level = Math.min(baseDam.fullReservoirLevel + 0.5, baseDam.currentWaterLevel - 2.5 + variation);

      data.push({
        time: timeLabel,
        level: Math.round(level * 100) / 100,
        warningLevel: baseDam.warningLevel,
        dangerLevel: baseDam.dangerLevel,
        fullLevel: baseDam.fullReservoirLevel,
        inflow: Math.round(baseDam.inflow * (0.85 + Math.random() * 0.3)),
        outflow: Math.round(baseDam.outflow * (0.88 + Math.random() * 0.25)),
      });
    }

    return data;
  },
};
