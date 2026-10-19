import {
  CommunityAssetCluster,
  CriticalInfrastructure,
  WardSpatialMetric,
  MunicipalDistrictHeatData,
  HeatmapMode,
  CivicInfrastructureProject,
  SimulatedAssetImpact,
} from '../types';

export const INITIAL_ASSET_CLUSTERS: CommunityAssetCluster[] = [
  {
    id: 'cluster-food-01',
    name: 'Somers Town Garden & Community Kitchen CIC',
    sector: 'FOOD',
    wardName: 'Somers Town & St Pancras',
    lat: 51.5322,
    lng: -0.1308,
    capacityDescription: '4,500 kg organic crops / 1,200 hot meals/week emergency buffer',
    verifiedValueGBP: 14400,
    circulatingVouchers: 8000,
    resilienceRole: 'Emergency Food Stockpile & Convalescence Concession',
    linkedVaultId: 'vlt-01',
    nearestInfraDistanceM: 280,
    nearestInfraName: 'St Pancras Hospital & NHS Mental Health Campus',
    spatialResilienceScore: 92,
    bufferCoverageM: 600,
    utilizationRatePercent: 88.5,
    weeklyVoucherVelocity: 4.8,
    activeParticipants: 1240,
    dailyInteractions: 310,
  },
  {
    id: 'cluster-energy-01',
    name: 'North London Solar Microgrid Co-op',
    sector: 'ENERGY',
    wardName: 'Somers Town & St Pancras',
    lat: 51.5342,
    lng: -0.1285,
    capacityDescription: '425,000 kWh/yr rooftop solar capacity + 120kWh battery storage',
    verifiedValueGBP: 76500,
    circulatingVouchers: 55000,
    resilienceRole: 'Islanded Emergency Power Dispatch (Health & Chillers)',
    linkedVaultId: 'vlt-04',
    nearestInfraDistanceM: 350,
    nearestInfraName: 'Camden 132kV Primary Power Substation',
    spatialResilienceScore: 96,
    bufferCoverageM: 800,
    utilizationRatePercent: 94.2,
    weeklyVoucherVelocity: 3.9,
    activeParticipants: 2150,
    dailyInteractions: 520,
  },
  {
    id: 'cluster-care-01',
    name: 'Somers Town Eldercare Mutual Network',
    sector: 'CARE',
    wardName: 'Somers Town & St Pancras',
    lat: 51.5305,
    lng: -0.1332,
    capacityDescription: '3,250 care hours & post-discharge convalescence support',
    verifiedValueGBP: 52000,
    circulatingVouchers: 35000,
    resilienceRole: 'UCH Convalescence Step-Down Bed Relief',
    linkedVaultId: 'vlt-02',
    nearestInfraDistanceM: 680,
    nearestInfraName: 'University College Hospital (UCH)',
    spatialResilienceScore: 89,
    bufferCoverageM: 500,
    utilizationRatePercent: 86.0,
    weeklyVoucherVelocity: 3.2,
    activeParticipants: 890,
    dailyInteractions: 145,
  },
  {
    id: 'cluster-labour-01',
    name: 'Euston Community Bike & Tool Guild',
    sector: 'LABOUR',
    wardName: 'Somers Town & St Pancras',
    lat: 51.5285,
    lng: -0.1345,
    capacityDescription: '1,800 specialist repair hours + 35 cargo bikes for emergency courier dispatch',
    verifiedValueGBP: 28800,
    circulatingVouchers: 18000,
    resilienceRole: 'Off-Grid Last-Mile Relief Dispatch & Mechanical Repair',
    linkedVaultId: 'vlt-03',
    nearestInfraDistanceM: 120,
    nearestInfraName: 'Euston Mainline Station & Logistics Interchange',
    spatialResilienceScore: 94,
    bufferCoverageM: 1000,
    utilizationRatePercent: 91.0,
    weeklyVoucherVelocity: 5.4,
    activeParticipants: 1650,
    dailyInteractions: 410,
  },
  {
    id: 'cluster-bio-01',
    name: 'Regent’s Canal Wetlands Ecological Reserve',
    sector: 'BIODIVERSITY',
    wardName: 'King’s Cross & Elm Village',
    lat: 51.5385,
    lng: -0.1272,
    capacityDescription: '14,200 m² urban reedbed & flood attenuation sponge basin',
    verifiedValueGBP: 42600,
    circulatingVouchers: 28000,
    resilienceRole: 'Urban Stormwater Drainage & Biodiversity Net Gain (BNG)',
    linkedVaultId: 'vlt-06',
    nearestInfraDistanceM: 210,
    nearestInfraName: 'Regent’s Canal Lock & Weirs Flood Barrier',
    spatialResilienceScore: 95,
    bufferCoverageM: 750,
    utilizationRatePercent: 82.5,
    weeklyVoucherVelocity: 2.6,
    activeParticipants: 780,
    dailyInteractions: 95,
  },
  {
    id: 'cluster-housing-01',
    name: 'Phoenix Community Housing Co-operative',
    sector: 'HOUSING',
    wardName: 'Somers Town & St Pancras',
    lat: 51.5330,
    lng: -0.1355,
    capacityDescription: '185 units collective tenure with community mutual heating loop',
    verifiedValueGBP: 110000,
    circulatingVouchers: 65000,
    resilienceRole: 'Extreme Heat & Cold Mutual Shelter Anchor',
    linkedVaultId: 'vlt-05',
    nearestInfraDistanceM: 420,
    nearestInfraName: 'St Pancras Hospital & NHS Mental Health Campus',
    spatialResilienceScore: 88,
    bufferCoverageM: 500,
    utilizationRatePercent: 96.8,
    weeklyVoucherVelocity: 3.1,
    activeParticipants: 540,
    dailyInteractions: 180,
  },
  {
    id: 'cluster-food-02',
    name: 'Calthorpe Community Garden & Kitchen',
    sector: 'FOOD',
    wardName: 'King’s Cross & Elm Village',
    lat: 51.5268,
    lng: -0.1195,
    capacityDescription: '1.2-acre inner-city farm, anaerobic digestor & community café',
    verifiedValueGBP: 31500,
    circulatingVouchers: 22000,
    resilienceRole: 'Decentralized Organic Waste to Energy & Food Hub',
    linkedVaultId: 'vlt-01',
    nearestInfraDistanceM: 550,
    nearestInfraName: 'King’s Cross & St Pancras International Transit Hub',
    spatialResilienceScore: 91,
    bufferCoverageM: 600,
    utilizationRatePercent: 87.4,
    weeklyVoucherVelocity: 4.5,
    activeParticipants: 1420,
    dailyInteractions: 380,
  },
  {
    id: 'cluster-civic-01',
    name: 'The Living Centre at St Pancras',
    sector: 'CIVIC',
    wardName: 'Somers Town & St Pancras',
    lat: 51.5310,
    lng: -0.1292,
    capacityDescription: 'Multipurpose health equity hub, digital inclusion & mutual aid coordination',
    verifiedValueGBP: 48000,
    circulatingVouchers: 31000,
    resilienceRole: 'Decentralised Municipal Welfare Triaging Station',
    linkedVaultId: 'vlt-08',
    nearestInfraDistanceM: 250,
    nearestInfraName: 'Camden Town Hall & 5 Pancras Square Civic Centre',
    spatialResilienceScore: 97,
    bufferCoverageM: 800,
    utilizationRatePercent: 93.6,
    weeklyVoucherVelocity: 4.2,
    activeParticipants: 2890,
    dailyInteractions: 610,
  },
  {
    id: 'cluster-water-01',
    name: 'Camley Street Urban Wetland Drainage',
    sector: 'WATER',
    wardName: 'King’s Cross & Elm Village',
    lat: 51.5352,
    lng: -0.1260,
    capacityDescription: '85,000 litres rainwater retention cisterns & water filtration beds',
    verifiedValueGBP: 34000,
    circulatingVouchers: 20000,
    resilienceRole: 'Potable Water Filtration Reserve & Flash Flood Buffer',
    linkedVaultId: 'vlt-07',
    nearestInfraDistanceM: 390,
    nearestInfraName: 'Regent’s Canal Lock & Weirs Flood Barrier',
    spatialResilienceScore: 93,
    bufferCoverageM: 700,
    utilizationRatePercent: 79.0,
    weeklyVoucherVelocity: 2.1,
    activeParticipants: 450,
    dailyInteractions: 80,
  },
  {
    id: 'cluster-labour-02',
    name: 'Kilburn High Road Makers & Tool Library',
    sector: 'LABOUR',
    wardName: 'Kilburn & West Hampstead North',
    lat: 51.5412,
    lng: -0.1825,
    capacityDescription: 'Carpentry, metalwork, electrical testing, and rapid repair collective',
    verifiedValueGBP: 22500,
    circulatingVouchers: 14000,
    resilienceRole: 'Domestic Retrofit & Emergency Structural Shoring',
    linkedVaultId: 'vlt-03',
    nearestInfraDistanceM: 820,
    nearestInfraName: 'Kentish Town & Kilburn Blue Light Response Node',
    spatialResilienceScore: 81,
    bufferCoverageM: 900,
    utilizationRatePercent: 68.2,
    weeklyVoucherVelocity: 2.4,
    activeParticipants: 620,
    dailyInteractions: 110,
  },
  {
    id: 'cluster-energy-02',
    name: 'West Hampstead Clean Energy Collective',
    sector: 'ENERGY',
    wardName: 'Kilburn & West Hampstead North',
    lat: 51.5455,
    lng: -0.1895,
    capacityDescription: '210,000 kWh community solar arrays across 4 school rooftops',
    verifiedValueGBP: 41000,
    circulatingVouchers: 26000,
    resilienceRole: 'Civic Microgrid Supply to Local Sheltered Accommodation',
    linkedVaultId: 'vlt-04',
    nearestInfraDistanceM: 1100,
    nearestInfraName: 'Camden 132kV Primary Power Substation',
    spatialResilienceScore: 78,
    bufferCoverageM: 700,
    utilizationRatePercent: 71.5,
    weeklyVoucherVelocity: 2.8,
    activeParticipants: 810,
    dailyInteractions: 140,
  },
  {
    id: 'cluster-civic-02',
    name: 'Holborn Legal & Mutual Rights Guild',
    sector: 'CIVIC',
    wardName: 'Holborn & Covent Garden Fringe',
    lat: 51.5195,
    lng: -0.1215,
    capacityDescription: 'Statutory advocacy, debt restructuring & housing tenancy dispute defence',
    verifiedValueGBP: 38000,
    circulatingVouchers: 24000,
    resilienceRole: 'Zero-Cost Eviction Prevention & Debt Defense Parity',
    linkedVaultId: 'vlt-08',
    nearestInfraDistanceM: 650,
    nearestInfraName: 'University College Hospital (UCH)',
    spatialResilienceScore: 90,
    bufferCoverageM: 600,
    utilizationRatePercent: 84.6,
    weeklyVoucherVelocity: 3.6,
    activeParticipants: 1120,
    dailyInteractions: 195,
  },
  {
    id: 'cluster-food-03',
    name: 'Highgate Community Orchard & Beekeepers',
    sector: 'FOOD',
    wardName: 'Regent’s Park East & Highgate',
    lat: 51.5415,
    lng: -0.1455,
    capacityDescription: '60 heirloom fruit trees, 18 apiaries, pollinator corridor maintenance',
    verifiedValueGBP: 19500,
    circulatingVouchers: 12500,
    resilienceRole: 'Biodiversity Buffer & Pollinator Security',
    linkedVaultId: 'vlt-01',
    nearestInfraDistanceM: 950,
    nearestInfraName: 'Camden 132kV Primary Power Substation',
    spatialResilienceScore: 84,
    bufferCoverageM: 650,
    utilizationRatePercent: 74.0,
    weeklyVoucherVelocity: 2.2,
    activeParticipants: 530,
    dailyInteractions: 85,
  },
];

export const INITIAL_CRITICAL_INFRASTRUCTURE: CriticalInfrastructure[] = [
  {
    id: 'infra-hosp-01',
    name: 'University College Hospital (UCH)',
    type: 'HEALTHCARE',
    wardName: 'Holborn & Covent Garden Fringe',
    lat: 51.5245,
    lng: -0.1378,
    capacityOrThroughput: '665 Acute Inpatient Beds / Major Trauma & Cancer Centre',
    servicePopulation: 250000,
    statutoryRole: 'NHS Foundation Trust Statutory Provider & Emergency Receiving Unit',
    redundancyTier: 'N+1_CRITICAL',
    emergencyPowerBackup: true,
  },
  {
    id: 'infra-hosp-02',
    name: 'St Pancras Hospital & NHS Mental Health Campus',
    type: 'HEALTHCARE',
    wardName: 'Somers Town & St Pancras',
    lat: 51.5345,
    lng: -0.1330,
    capacityOrThroughput: 'Intermediate Care, Convalescence & Community Mental Health',
    servicePopulation: 95000,
    statutoryRole: 'Camden & Islington NHS Foundation Trust Step-Down Hub',
    redundancyTier: 'N+1_CRITICAL',
    emergencyPowerBackup: true,
  },
  {
    id: 'infra-transit-01',
    name: 'King’s Cross & St Pancras International Transit Hub',
    type: 'TRANSIT_LOGISTICS',
    wardName: 'King’s Cross & Elm Village',
    lat: 51.5315,
    lng: -0.1260,
    capacityOrThroughput: '95 Million Passenger Movements / Year & Freight Logistics Rails',
    servicePopulation: 500000,
    statutoryRole: 'National Critical Transport Infrastructure & Civil Emergency Logistics',
    redundancyTier: 'N+1_CRITICAL',
    emergencyPowerBackup: true,
  },
  {
    id: 'infra-transit-02',
    name: 'Euston Mainline Station & Logistics Interchange',
    type: 'TRANSIT_LOGISTICS',
    wardName: 'Somers Town & St Pancras',
    lat: 51.5280,
    lng: -0.1335,
    capacityOrThroughput: 'West Coast Mainline Terminus & Emergency Freight Corridor',
    servicePopulation: 350000,
    statutoryRole: 'Network Rail Major Station & Designated Evacuation Assembly Zone',
    redundancyTier: 'N+1_CRITICAL',
    emergencyPowerBackup: true,
  },
  {
    id: 'infra-grid-01',
    name: 'Camden 132kV Primary Power Substation',
    type: 'POWER_GRID',
    wardName: 'Somers Town & St Pancras',
    lat: 51.5380,
    lng: -0.1390,
    capacityOrThroughput: '180 MVA High-Voltage Grid Transformation Node',
    servicePopulation: 140000,
    statutoryRole: 'UK Power Networks Strategic Primary Substation',
    redundancyTier: 'N+1_CRITICAL',
    emergencyPowerBackup: true,
  },
  {
    id: 'infra-water-01',
    name: 'Thames Water Euston Deep Drainage Pumping Station',
    type: 'WATER_FLOOD',
    wardName: 'Somers Town & St Pancras',
    lat: 51.5295,
    lng: -0.1380,
    capacityOrThroughput: '12,500 m³/hr Storm Sewer Discharge Rate',
    servicePopulation: 110000,
    statutoryRole: 'Flood & Water Management Act 2010 Statutory Drainage Asset',
    redundancyTier: 'PRIMARY',
    emergencyPowerBackup: true,
  },
  {
    id: 'infra-water-02',
    name: 'Regent’s Canal Lock & Weirs Flood Barrier',
    type: 'WATER_FLOOD',
    wardName: 'King’s Cross & Elm Village',
    lat: 51.5390,
    lng: -0.1440,
    capacityOrThroughput: 'Canal Level Regulation & River Fleet Overflow Sluice',
    servicePopulation: 85000,
    statutoryRole: 'Canal & River Trust Flood Defense System',
    redundancyTier: 'PRIMARY',
    emergencyPowerBackup: false,
  },
  {
    id: 'infra-emerg-01',
    name: 'Euston Fire & Rescue Station',
    type: 'EMERGENCY_SERVICES',
    wardName: 'Somers Town & St Pancras',
    lat: 51.5260,
    lng: -0.1305,
    capacityOrThroughput: '2 Frontline Pumping Appliances + High-Volume Pumping Unit',
    servicePopulation: 160000,
    statutoryRole: 'London Fire Brigade Strategic Central Response Node',
    redundancyTier: 'N+1_CRITICAL',
    emergencyPowerBackup: true,
  },
  {
    id: 'infra-eoc-01',
    name: 'Camden Town Hall & 5 Pancras Square Civic Centre',
    type: 'COUNCIL_EOC',
    wardName: 'King’s Cross & Elm Village',
    lat: 51.5310,
    lng: -0.1250,
    capacityOrThroughput: 'Borough Emergency Operations Centre (EOC) & Crisis Cabinet',
    servicePopulation: 220000,
    statutoryRole: 'Civil Contingencies Act 2004 Category 1 Responder Headquarters',
    redundancyTier: 'N+1_CRITICAL',
    emergencyPowerBackup: true,
  },
];

export const WARD_SPATIAL_METRICS: WardSpatialMetric[] = [
  {
    wardName: 'Somers Town & St Pancras',
    centroidLat: 51.5315,
    centroidLng: -0.1310,
    population: 14200,
    terScore: 0.94,
    localMultiplier: 1.74,
    hardshipDisbursedGBP: 84500,
    anchorSpendPercent: 42.5,
    assetClusterCount: 6,
    infraCount: 5,
    resilienceScore: 94.2,
    coverageStatus: 'OPTIMAL',
  },
  {
    wardName: 'King’s Cross & Elm Village',
    centroidLat: 51.5365,
    centroidLng: -0.1245,
    population: 16800,
    terScore: 0.98,
    localMultiplier: 1.68,
    hardshipDisbursedGBP: 56200,
    anchorSpendPercent: 38.0,
    assetClusterCount: 3,
    infraCount: 3,
    resilienceScore: 91.8,
    coverageStatus: 'OPTIMAL',
  },
  {
    wardName: 'Kilburn & West Hampstead North',
    centroidLat: 51.5420,
    centroidLng: -0.1850,
    population: 15300,
    terScore: 1.04,
    localMultiplier: 1.52,
    hardshipDisbursedGBP: 71800,
    anchorSpendPercent: 29.4,
    assetClusterCount: 2,
    infraCount: 0,
    resilienceScore: 78.5,
    coverageStatus: 'UNDER_SERVED',
  },
  {
    wardName: 'Holborn & Covent Garden Fringe',
    centroidLat: 51.5185,
    centroidLng: -0.1220,
    population: 13100,
    terScore: 0.89,
    localMultiplier: 1.82,
    hardshipDisbursedGBP: 42300,
    anchorSpendPercent: 51.2,
    assetClusterCount: 1,
    infraCount: 1,
    resilienceScore: 88.6,
    coverageStatus: 'MODERATE',
  },
  {
    wardName: 'Regent’s Park East & Highgate',
    centroidLat: 51.5390,
    centroidLng: -0.1470,
    population: 12900,
    terScore: 0.92,
    localMultiplier: 1.64,
    hardshipDisbursedGBP: 31900,
    anchorSpendPercent: 34.8,
    assetClusterCount: 1,
    infraCount: 0,
    resilienceScore: 84.0,
    coverageStatus: 'MODERATE',
  },
];

export const MUNICIPAL_DISTRICT_HEAT_DATA: MunicipalDistrictHeatData[] = [
  {
    districtId: 'dist-01',
    districtName: 'Somers Town Core & St Pancras Urban Corridor',
    boroughWard: 'Somers Town & St Pancras',
    assetDensityPerKm2: 8.4,
    utilizationRatePercent: 92.4,
    weeklyCirculationCOMMONS: 182000,
    activeParticipants: 4850,
    heatIndex: 96,
    heatLevel: 'CRITICAL_CONGESTION',
    primaryDominantSector: 'ENERGY',
    centroidLat: 51.5315,
    centroidLng: -0.1310,
    boundaryPolygon: [
      [51.5365, -0.1385],
      [51.5375, -0.1265],
      [51.5265, -0.1250],
      [51.5255, -0.1370],
    ],
    hotspotNames: ['Chalton St Market', 'Phoenix Housing Loop', 'St Pancras Convalescence'],
    demurrageTurnoverDays: 14.2,
  },
  {
    districtId: 'dist-02',
    districtName: 'King’s Cross Logistics & Canal Ecological Spine',
    boroughWard: 'King’s Cross & Elm Village',
    assetDensityPerKm2: 5.6,
    utilizationRatePercent: 86.8,
    weeklyCirculationCOMMONS: 114000,
    activeParticipants: 3240,
    heatIndex: 88,
    heatLevel: 'VIBRANT_HIGH',
    primaryDominantSector: 'BIODIVERSITY',
    centroidLat: 51.5365,
    centroidLng: -0.1245,
    boundaryPolygon: [
      [51.5420, -0.1320],
      [51.5405, -0.1190],
      [51.5300, -0.1165],
      [51.5290, -0.1285],
    ],
    hotspotNames: ['Regent’s Canal Wetlands', 'Calthorpe Farm', 'Camley Street SuDS'],
    demurrageTurnoverDays: 18.6,
  },
  {
    districtId: 'dist-03',
    districtName: 'Holborn Commercial & Civic Health Fringe',
    boroughWard: 'Holborn & Covent Garden Fringe',
    assetDensityPerKm2: 4.2,
    utilizationRatePercent: 81.5,
    weeklyCirculationCOMMONS: 76000,
    activeParticipants: 2100,
    heatIndex: 79,
    heatLevel: 'STABLE_BALANCED',
    primaryDominantSector: 'CIVIC',
    centroidLat: 51.5185,
    centroidLng: -0.1220,
    boundaryPolygon: [
      [51.5245, -0.1320],
      [51.5235, -0.1150],
      [51.5135, -0.1140],
      [51.5140, -0.1290],
    ],
    hotspotNames: ['UCH Health Corridor', 'Holborn Legal Clinic', 'Bloomsbury Mutual'],
    demurrageTurnoverDays: 22.4,
  },
  {
    districtId: 'dist-04',
    districtName: 'Regent’s Park East & Highgate Perimeter',
    boroughWard: 'Regent’s Park East & Highgate',
    assetDensityPerKm2: 3.1,
    utilizationRatePercent: 74.2,
    weeklyCirculationCOMMONS: 42000,
    activeParticipants: 1450,
    heatIndex: 68,
    heatLevel: 'STABLE_BALANCED',
    primaryDominantSector: 'FOOD',
    centroidLat: 51.5390,
    centroidLng: -0.1470,
    boundaryPolygon: [
      [51.5460, -0.1550],
      [51.5440, -0.1380],
      [51.5340, -0.1390],
      [51.5350, -0.1560],
    ],
    hotspotNames: ['Highgate Orchard', 'Camden Barracks Solar', 'Perimeter Pollinators'],
    demurrageTurnoverDays: 28.1,
  },
  {
    districtId: 'dist-05',
    districtName: 'Kilburn & West Hampstead Northern Arc',
    boroughWard: 'Kilburn & West Hampstead North',
    assetDensityPerKm2: 2.4,
    utilizationRatePercent: 65.4,
    weeklyCirculationCOMMONS: 31000,
    activeParticipants: 980,
    heatIndex: 54,
    heatLevel: 'EMERGING_LOW',
    primaryDominantSector: 'LABOUR',
    centroidLat: 51.5420,
    centroidLng: -0.1850,
    boundaryPolygon: [
      [51.5490, -0.1980],
      [51.5480, -0.1740],
      [51.5360, -0.1720],
      [51.5370, -0.1950],
    ],
    hotspotNames: ['Kilburn High Rd Guild', 'West Hampstead School Arrays', 'Mill Lane Hub'],
    demurrageTurnoverDays: 36.5,
  },
];

// Haversine distance calculator in meters
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Generate high-density heatmap points for Leaflet.heat
export function generateHeatmapPoints(
  mode: HeatmapMode,
  assets: CommunityAssetCluster[],
  districts: MunicipalDistrictHeatData[]
): [number, number, number][] {
  const points: [number, number, number][] = [];

  if (mode === 'ASSET_DENSITY') {
    // Weight based on asset density & capacity
    assets.forEach((asset) => {
      const baseIntensity = Math.min(1.0, (asset.verifiedValueGBP / 80000) * 0.9 + 0.2);
      // Main cluster point
      points.push([asset.lat, asset.lng, baseIntensity]);

      // Micro satellite points around cluster (radius ~ 80-160m) to create continuous organic heat contour
      const offsets = [
        [0.0008, 0.0006],
        [-0.0007, 0.0008],
        [0.0006, -0.0009],
        [-0.0008, -0.0006],
        [0.0012, 0.0002],
        [-0.0011, -0.0003],
      ];

      offsets.forEach(([dLat, dLng], idx) => {
        const falloff = baseIntensity * (0.65 - idx * 0.06);
        points.push([asset.lat + dLat, asset.lng + dLng, Math.max(0.1, falloff)]);
      });
    });

    // Add district core weight
    districts.forEach((d) => {
      const densityWeight = Math.min(1.0, d.assetDensityPerKm2 / 9.0);
      points.push([d.centroidLat, d.centroidLng, densityWeight]);
    });
  } else if (mode === 'UTILIZATION_INTENSITY') {
    // Weight based on circulating COMMONS vouchers and weekly transaction velocity
    assets.forEach((asset) => {
      const utilizationWeight =
        (asset.utilizationRatePercent / 100) * 0.6 +
        Math.min(1.0, asset.weeklyVoucherVelocity / 5.0) * 0.4;

      points.push([asset.lat, asset.lng, utilizationWeight]);

      // Add high-velocity interaction satellites
      const satellites = [
        [0.0005, 0.0004],
        [-0.0006, 0.0005],
        [0.0004, -0.0006],
        [-0.0005, -0.0004],
        [0.0009, -0.0008],
      ];

      satellites.forEach(([dLat, dLng]) => {
        points.push([asset.lat + dLat, asset.lng + dLng, utilizationWeight * 0.75]);
      });
    });

    // District-level velocity injection
    districts.forEach((d) => {
      const districtUtilWeight = (d.heatIndex / 100) * 0.95;
      points.push([d.centroidLat, d.centroidLng, districtUtilWeight]);
      points.push([d.centroidLat + 0.001, d.centroidLng - 0.001, districtUtilWeight * 0.8]);
      points.push([d.centroidLat - 0.001, d.centroidLng + 0.001, districtUtilWeight * 0.8]);
    });
  } else {
    // WELFARE_DEMAND: Weight based on hardship disbursement and demographic protection
    districts.forEach((d) => {
      const demandWeight = d.districtId === 'dist-01' ? 0.95 : d.districtId === 'dist-02' ? 0.78 : d.districtId === 'dist-05' ? 0.88 : 0.62;
      points.push([d.centroidLat, d.centroidLng, demandWeight]);

      // Scatter demand points
      const offsets = [
        [0.0012, 0.0010],
        [-0.0011, 0.0012],
        [0.0010, -0.0013],
        [-0.0013, -0.0010],
      ];
      offsets.forEach(([dLat, dLng]) => {
        points.push([d.centroidLat + dLat, d.centroidLng + dLng, demandWeight * 0.7]);
      });
    });

    // Asset welfare nodes
    assets.filter(a => a.sector === 'CARE' || a.sector === 'FOOD' || a.sector === 'HOUSING').forEach(a => {
      points.push([a.lat, a.lng, 0.9]);
      points.push([a.lat + 0.0006, a.lng - 0.0006, 0.7]);
    });
  }

  return points;
}

// PROPOSED & FUNDED CIVIC INFRASTRUCTURE PROJECTS (Historical Planning Delivery Model)
export const CIVIC_INFRASTRUCTURE_PROJECTS: CivicInfrastructureProject[] = [
  {
    id: 'proj-suds-01',
    name: 'HS2 Euston Green Link & SuDS Sponge Corridor',
    type: 'WATER_FLOOD',
    targetWard: 'Somers Town & St Pancras',
    lat: 51.5298,
    lng: -0.1345,
    budgetGBP: 4850000,
    completionYear: 2027,
    planningReference: 'CAMDEN-LBC/2026/0491-CIL',
    description:
      'Continuous linear SuDS park and bio-retention swales intercepting Churchway & Euston runoff, protecting residential basements and urban agriculture.',
    historicalBenchmarkBasis:
      'Camden Climate Action Review (2018–2024): SuDS bioswale networks along Euston & Regent’s Canal delivered a 43.8% reduction in local surface water pooling and an empirical +9.2 pt uplift in community asset operational resilience within 900m.',
    targetBenefitSectors: ['FOOD', 'BIODIVERSITY', 'WATER', 'HOUSING'],
    impactRadiusM: 950,
    scoreBoostCoefficients: {
      directProximityBoost: 11,
      sectorAlignmentBoost: 5,
      systemicCapacityBoost: 3,
    },
    projectedKeyBenefit:
      'Guarantees 1-in-100-year flood attenuation protecting Somers Town Community Garden & Oakshott Co-op basement food stores.',
    status: 'APPROVED_FUNDED',
  },
  {
    id: 'proj-bess-02',
    name: 'Camden Lock 3.5MWh Battery Energy Storage (BESS) & Microgrid Interconnect',
    type: 'POWER_GRID',
    targetWard: 'Camden Town & Chalk Farm',
    lat: 51.5422,
    lng: -0.1462,
    budgetGBP: 3200000,
    completionYear: 2026,
    planningReference: 'CAMDEN-LBC/2026/1182-SEC106',
    description:
      'Containerized lithium-iron-phosphate (LFP) utility battery system buffering local solar microgrids and providing automated blackstart capability.',
    historicalBenchmarkBasis:
      'Greater London Authority Local Energy Infrastructure Evaluation (2019–2024): Shared 3MWh BESS interconnects boosted microgrid islanding uptime to 99.98% during National Grid triad events, delivering +12.4 resilience pts to local solar & repair co-operatives.',
    targetBenefitSectors: ['ENERGY', 'LABOUR', 'CIVIC'],
    impactRadiusM: 1200,
    scoreBoostCoefficients: {
      directProximityBoost: 13,
      sectorAlignmentBoost: 6,
      systemicCapacityBoost: 4,
    },
    projectedKeyBenefit:
      'Provides 8 hours of autonomous islanded power for cold storage, health refrigeration, and local solar dispatch.',
    status: 'APPROVED_FUNDED',
  },
  {
    id: 'proj-health-03',
    name: 'West Hampstead Integrated Community Diagnostic & Convalescence Hub',
    type: 'HEALTHCARE',
    targetWard: 'Kilburn & West Hampstead North',
    lat: 51.5468,
    lng: -0.1882,
    budgetGBP: 6500000,
    completionYear: 2027,
    planningReference: 'CAMDEN-LBC/2026/0833-IDP',
    description:
      'Decentralized community health diagnostic facility providing step-down post-acute convalescence, phlebotomy, and geriatric telemedicine.',
    historicalBenchmarkBasis:
      'North Central London Integrated Care System (2020–2025): Hyperlocal diagnostic access within 750m reduced unplanned geriatric emergency transfers by 34.6%, uplifting eldercare mutual network resilience by +14.8 pts.',
    targetBenefitSectors: ['CARE', 'FOOD', 'CIVIC'],
    impactRadiusM: 1100,
    scoreBoostCoefficients: {
      directProximityBoost: 12,
      sectorAlignmentBoost: 5,
      systemicCapacityBoost: 3,
    },
    projectedKeyBenefit:
      'Unlocks direct step-down convalescence beds and telehealth link for Kilburn & West Hampstead care circles.',
    status: 'PLANNED',
  },
  {
    id: 'proj-highline-04',
    name: 'Camden Highline Ecological Transit & Circular Repair Viaduct',
    type: 'TRANSIT_LOGISTICS',
    targetWard: 'King’s Cross & Bloomsbury East',
    lat: 51.5385,
    lng: -0.1378,
    budgetGBP: 8900000,
    completionYear: 2028,
    planningReference: 'CAMDEN-LBC/2026/2209-HIGHLINE',
    description:
      'Elevated active mobility park with dedicated electric cargo bike freight lanes and maker repair exchange depots connecting Camden Town to King’s Cross.',
    historicalBenchmarkBasis:
      'Preston Model Civic Wealth & Camden S106 Social Value Audit (2018–2024): Active freight & repair viaduct infrastructure reduced cross-borough logistics latency by 46% and generated a +9.7 pt increase in mutual trade velocity.',
    targetBenefitSectors: ['LABOUR', 'BIODIVERSITY', 'FOOD', 'CIVIC'],
    impactRadiusM: 1050,
    scoreBoostCoefficients: {
      directProximityBoost: 10,
      sectorAlignmentBoost: 4,
      systemicCapacityBoost: 3,
    },
    projectedKeyBenefit:
      'Enables zero-emission cargo-bike freight corridors and connects King’s Cross Makers with Camden repair guilds.',
    status: 'UNDER_CONSULTATION',
  },
];

// HISTORICAL BENCHMARK CITATIONS & METHODOLOGY
export const HISTORICAL_INFRASTRUCTURE_BENCHMARKS = [
  {
    dataset: 'Camden Climate Action Outturn 2018–2024',
    sampleSize: '42 local community projects',
    empiricalObservation: 'Linear bioswales and SuDS reduced basement flooding downtime by 84%, yielding +11.8 pts resilience.',
    regressionCoefficient: '+0.038 score pts / £10k CIL invested within 800m',
  },
  {
    dataset: 'GLA Decarbonisation & Community Microgrid Study 2019–2024',
    sampleSize: '18 London microgrid co-operatives',
    empiricalObservation: 'Utility BESS storage interconnects increased mutual voucher velocity by 2.4x during power grid tariff spikes.',
    regressionCoefficient: '+12.4 resilience score lift per 1MWh dedicated storage',
  },
  {
    dataset: 'NCL ICS Health & Social Value Audit 2020–2025',
    sampleSize: '65,000 patient episodes',
    empiricalObservation: 'Community diagnostic walk-in centers within 10 min walking buffer reduced hospital readmission penalties by 32%.',
    regressionCoefficient: '+14.8 resilience points for mutual care networks within 1km',
  },
];

// SIMULATION CALCULATOR: Evaluates empirical uplift of civic infrastructure on asset resilience scores
export function calculateSimulatedAssetScores(
  assets: CommunityAssetCluster[],
  projects: CivicInfrastructureProject[],
  activeProjectIds?: string[]
): Record<string, SimulatedAssetImpact> {
  const activeProjects = activeProjectIds
    ? projects.filter((p) => activeProjectIds.includes(p.id))
    : projects;

  const result: Record<string, SimulatedAssetImpact> = {};

  assets.forEach((asset) => {
    let totalDirectBoost = 0;
    let totalSectorBoost = 0;
    let totalSystemicBoost = 0;
    const contributingProjects: string[] = [];
    const rationales: string[] = [];

    activeProjects.forEach((proj) => {
      const distanceM = calculateHaversineDistance(asset.lat, asset.lng, proj.lat, proj.lng);
      const isWithinRadius = distanceM <= proj.impactRadiusM;
      const isSectorAligned = proj.targetBenefitSectors.includes(asset.sector);

      if (isWithinRadius) {
        // Proximity decay calculation: 1.0 at epicenter down to 0.25 at perimeter
        const proximityFactor = Math.max(0.25, 1 - distanceM / (proj.impactRadiusM * 1.15));
        const directLift = proj.scoreBoostCoefficients.directProximityBoost * proximityFactor;
        totalDirectBoost += directLift;
        contributingProjects.push(proj.name);
        rationales.push(
          `${proj.name} (${distanceM}m away): +${directLift.toFixed(1)} pts via proximity buffer`
        );
      }

      if (isSectorAligned && isWithinRadius) {
        totalSectorBoost += proj.scoreBoostCoefficients.sectorAlignmentBoost;
      }

      // Systemic capacity boost if project is within 2x impact radius
      if (distanceM <= proj.impactRadiusM * 2) {
        totalSystemicBoost += proj.scoreBoostCoefficients.systemicCapacityBoost * 0.45;
      }
    });

    const netScoreDelta = Math.min(
      22,
      Math.round(totalDirectBoost + totalSectorBoost + totalSystemicBoost)
    );
    const simulatedScore = Math.min(99, asset.spatialResilienceScore + netScoreDelta);

    result[asset.id] = {
      assetId: asset.id,
      baselineScore: asset.spatialResilienceScore,
      simulatedScore,
      scoreDelta: simulatedScore - asset.spatialResilienceScore,
      contributingProjects: Array.from(new Set(contributingProjects)),
      historicalRationale:
        rationales.length > 0
          ? rationales.join('; ')
          : 'Borough-wide systemic infrastructure redundancy buffering',
    };
  });

  return result;
}
