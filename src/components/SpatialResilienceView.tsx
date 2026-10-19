// src/components/SpatialResilienceView.tsx
import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
if (typeof window !== 'undefined') {
  (window as any).L = L;
}
import 'leaflet.heat';
import { useCivicTrust } from '../context/CivicTrustContext';
import {
  CommunityAssetCluster,
  CriticalInfrastructure,
  AssetClusterSector,
  CriticalInfraType,
  WardSpatialMetric,
  MunicipalDistrictHeatData,
  HeatmapMode,
  CivicInfrastructureProject,
  SimulatedAssetImpact,
} from '../types';
import {
  INITIAL_ASSET_CLUSTERS,
  INITIAL_CRITICAL_INFRASTRUCTURE,
  WARD_SPATIAL_METRICS,
  MUNICIPAL_DISTRICT_HEAT_DATA,
  CIVIC_INFRASTRUCTURE_PROJECTS,
  HISTORICAL_INFRASTRUCTURE_BENCHMARKS,
  calculateSimulatedAssetScores,
  generateHeatmapPoints,
  calculateHaversineDistance,
} from '../data/spatialResilienceData';
import { PredictiveResilienceChart } from './PredictiveResilienceChart';
import { generateSpatialResiliencePDF } from '../utils/pdfReportGenerator';
import {
  Compass,
  MapPin,
  Layers,
  ShieldCheck,
  Building2,
  Hospital,
  Train,
  Zap,
  Droplets,
  Flame,
  Scale,
  Wheat,
  Heart,
  Wrench,
  Trees,
  Home,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Maximize2,
  Filter,
  Download,
  Info,
  ChevronRight,
  TrendingUp,
  Activity,
  Gauge,
  Sparkles,
  Users,
  RotateCcw,
  CheckSquare,
  Square,
  Check,
} from 'lucide-react';

const ALL_SECTORS: AssetClusterSector[] = [
  'ENERGY',
  'FOOD',
  'HOUSING',
  'CARE',
  'LABOUR',
  'BIODIVERSITY',
  'WATER',
  'CIVIC',
];

export const SpatialResilienceView: React.FC = () => {
  const { councilWards } = useCivicTrust();

  // State
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const heatLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedAsset, setSelectedAsset] = useState<CommunityAssetCluster | null>(
    INITIAL_ASSET_CLUSTERS[0]
  );
  const [selectedInfra, setSelectedInfra] = useState<CriticalInfrastructure | null>(null);
  const [selectedWard, setSelectedWard] = useState<WardSpatialMetric | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<MunicipalDistrictHeatData | null>(
    MUNICIPAL_DISTRICT_HEAT_DATA[0]
  );

  // Heatmap Overlay State
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>('UTILIZATION_INTENSITY');
  const [heatRadius, setHeatRadius] = useState<number>(36);
  const [heatBlur, setHeatBlur] = useState<number>(22);
  const [heatOpacity, setHeatOpacity] = useState<number>(0.85);
  const [showDistrictMesh, setShowDistrictMesh] = useState<boolean>(true);

  // Control Panel Filter States (Sector & Resilience Score)
  const [selectedSectors, setSelectedSectors] = useState<AssetClusterSector[]>(ALL_SECTORS);
  const [minResilienceScore, setMinResilienceScore] = useState<number>(70);
  const [autoFitOnFilter, setAutoFitOnFilter] = useState<boolean>(false);

  // Layer Visibility Toggles
  const [showInfra, setShowInfra] = useState<boolean>(true);
  const [showBuffers, setShowBuffers] = useState<boolean>(false);
  const [showProximityLinks, setShowProximityLinks] = useState<boolean>(true);
  const [showWards, setShowWards] = useState<boolean>(false);
  const [simulationScenario, setSimulationScenario] = useState<
    'NOMINAL' | 'FLOOD_SURGE' | 'GRID_BLACKOUT' | 'NHS_CARE_SURGE'
  >('NOMINAL');

  // Civic Infrastructure Historical Impact Simulator State (Request 6)
  const [simulateCivicProjects, setSimulateCivicProjects] = useState<boolean>(true);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(
    CIVIC_INFRASTRUCTURE_PROJECTS.map((p) => p.id)
  );
  const [selectedCivicProject, setSelectedCivicProject] = useState<CivicInfrastructureProject | null>(
    CIVIC_INFRASTRUCTURE_PROJECTS[0]
  );
  const [impactFilterMode, setImpactFilterMode] = useState<'ALL' | 'UPLIFTED_ONLY'>('ALL');
  const [showCivicProjectBuffers, setShowCivicProjectBuffers] = useState<boolean>(true);

  // S106 / CIL Planning Investment Simulator State
  const [cilInvestmentGBP, setCilInvestmentGBP] = useState<number>(350000);
  const [targetInvestmentWard, setTargetInvestmentWard] = useState<string>(
    'Kilburn & West Hampstead North'
  );

  // PDF Report Generation State
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [pdfNotification, setPdfNotification] = useState<string | null>(null);
  const [showPdfOptionsModal, setShowPdfOptionsModal] = useState<boolean>(false);
  const [pdfOfficerName, setPdfOfficerName] = useState<string>('Amara Okafor (Senior Planning Economist)');
  const [pdfDepartment, setPdfDepartment] = useState<string>('Camden Directorate of Economy, Regeneration & Climate Resilience');

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      setPdfNotification('Compiling Council PDF Report: rasterizing Leaflet map & 5-year recovery trajectory...');

      const chartEl = document.getElementById('predictive-recovery-chart');
      await generateSpatialResiliencePDF({
        mapElement: mapContainerRef.current,
        chartElement: chartEl,
        filteredAssets: filteredAssets.length > 0 ? filteredAssets : INITIAL_ASSET_CLUSTERS,
        allProjects: CIVIC_INFRASTRUCTURE_PROJECTS,
        selectedProjectIds,
        simulateCivicProjects,
        cilInvestmentGBP,
        selectedSectors,
        minResilienceScore,
        heatmapMode,
        showHeatmap,
        selectedDistrict,
        officerName: pdfOfficerName,
        department: pdfDepartment,
      });

      setPdfNotification('Council PDF Report successfully compiled and downloaded.');
      setShowPdfOptionsModal(false);
      setTimeout(() => setPdfNotification(null), 5000);
    } catch (err) {
      console.error('Failed to generate PDF report:', err);
      setPdfNotification('PDF report compilation encountered an issue. Please try again.');
      setTimeout(() => setPdfNotification(null), 5000);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Sector Color and Label Mapping
  const getSectorMeta = (sector: AssetClusterSector) => {
    switch (sector) {
      case 'FOOD':
        return { color: '#f59e0b', bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Food & Urban Agri' };
      case 'ENERGY':
        return { color: '#38bdf8', bg: 'bg-sky-500/20', text: 'text-sky-400', label: 'Clean Energy & Microgrid' };
      case 'CARE':
        return { color: '#f43f5e', bg: 'bg-rose-500/20', text: 'text-rose-400', label: 'Mutual Care & Health' };
      case 'LABOUR':
        return { color: '#818cf8', bg: 'bg-indigo-500/20', text: 'text-indigo-400', label: 'Labour Guild & Repair' };
      case 'BIODIVERSITY':
        return { color: '#10b981', bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Biodiversity Sponge' };
      case 'HOUSING':
        return { color: '#06b6d4', bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'Cooperative Housing' };
      case 'WATER':
        return { color: '#0ea5e9', bg: 'bg-sky-500/20', text: 'text-sky-400', label: 'Water & SuDS' };
      case 'CIVIC':
      default:
        return { color: '#a855f7', bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Civic Advocacy Hub' };
    }
  };

  const getSectorIcon = (sector: AssetClusterSector) => {
    switch (sector) {
      case 'FOOD':
        return <Wheat className="w-3.5 h-3.5 text-amber-400" />;
      case 'ENERGY':
        return <Zap className="w-3.5 h-3.5 text-sky-400" />;
      case 'HOUSING':
        return <Home className="w-3.5 h-3.5 text-cyan-400" />;
      case 'CARE':
        return <Heart className="w-3.5 h-3.5 text-rose-400" />;
      case 'LABOUR':
        return <Wrench className="w-3.5 h-3.5 text-indigo-400" />;
      case 'BIODIVERSITY':
        return <Trees className="w-3.5 h-3.5 text-emerald-400" />;
      case 'WATER':
        return <Droplets className="w-3.5 h-3.5 text-sky-400" />;
      case 'CIVIC':
      default:
        return <Scale className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const getInfraMeta = (type: CriticalInfraType) => {
    switch (type) {
      case 'HEALTHCARE':
        return { color: '#ef4444', label: 'NHS Hospital / Trauma' };
      case 'TRANSIT_LOGISTICS':
        return { color: '#f97316', label: 'Major Rail & Logistics' };
      case 'POWER_GRID':
        return { color: '#eab308', label: '132kV Power Substation' };
      case 'WATER_FLOOD':
        return { color: '#3b82f6', label: 'Flood Defense & SuDS' };
      case 'EMERGENCY_SERVICES':
        return { color: '#ec4899', label: 'Fire & Blue-Light' };
      case 'COUNCIL_EOC':
      default:
        return { color: '#6366f1', label: 'Council Emergency Centre' };
    }
  };

  const getDistrictHeatColor = (level: MunicipalDistrictHeatData['heatLevel']) => {
    switch (level) {
      case 'CRITICAL_CONGESTION':
        return '#f43f5e'; // Rose / Red
      case 'VIBRANT_HIGH':
        return '#f59e0b'; // Amber / Orange
      case 'STABLE_BALANCED':
        return '#10b981'; // Emerald
      case 'EMERGING_LOW':
      default:
        return '#38bdf8'; // Sky Blue
    }
  };

  // Simulated Asset Impact Lookup based on historical infrastructure regression model
  const simulatedImpactLookup = useMemo(() => {
    if (!simulateCivicProjects) return null;
    return calculateSimulatedAssetScores(
      INITIAL_ASSET_CLUSTERS,
      CIVIC_INFRASTRUCTURE_PROJECTS,
      selectedProjectIds
    );
  }, [simulateCivicProjects, selectedProjectIds]);

  // Aggregate simulation metrics & historical confidence
  const simulationMetrics = useMemo(() => {
    if (!simulatedImpactLookup) return null;
    const impacts = Object.values(simulatedImpactLookup);
    const avgLift =
      impacts.length > 0
        ? impacts.reduce((sum, i) => sum + i.scoreDelta, 0) / impacts.length
        : 0;
    const countBaselineGradeA = INITIAL_ASSET_CLUSTERS.filter(
      (a) => a.spatialResilienceScore >= 90
    ).length;
    const countSimulatedGradeA = impacts.filter((i) => i.simulatedScore >= 90).length;
    const totalSimulatedGBP = INITIAL_ASSET_CLUSTERS.reduce(
      (sum, a) => sum + a.verifiedValueGBP,
      0
    );
    const activeProjects = CIVIC_INFRASTRUCTURE_PROJECTS.filter((p) =>
      selectedProjectIds.includes(p.id)
    );
    const totalCapitalCommitted = activeProjects.reduce((sum, p) => sum + p.budgetGBP, 0);

    return {
      avgLift: avgLift.toFixed(1),
      countBaselineGradeA,
      countSimulatedGradeA,
      totalSimulatedGBP,
      activeProjectsCount: selectedProjectIds.length,
      totalCapitalCommitted,
    };
  }, [simulatedImpactLookup, selectedProjectIds]);

  // Filtered Assets based on multi-sector selection, resilience score threshold, and simulation impact
  const filteredAssets = useMemo(() => {
    return INITIAL_ASSET_CLUSTERS.filter((asset) => {
      const matchesSector = selectedSectors.includes(asset.sector);
      const effectiveScore =
        simulateCivicProjects && simulatedImpactLookup
          ? (simulatedImpactLookup[asset.id]?.simulatedScore ?? asset.spatialResilienceScore)
          : asset.spatialResilienceScore;
      const matchesScore = effectiveScore >= minResilienceScore;
      const matchesImpactFilter =
        impactFilterMode === 'ALL'
          ? true
          : (simulatedImpactLookup?.[asset.id]?.scoreDelta ?? 0) > 0;
      return matchesSector && matchesScore && matchesImpactFilter;
    });
  }, [
    selectedSectors,
    minResilienceScore,
    simulateCivicProjects,
    simulatedImpactLookup,
    impactFilterMode,
  ]);

  // Sector counts & resilience matching statistics for the control panel
  const sectorCounts = useMemo(() => {
    const counts: Record<AssetClusterSector, { total: number; matchingScore: number }> = {
      FOOD: { total: 0, matchingScore: 0 },
      ENERGY: { total: 0, matchingScore: 0 },
      HOUSING: { total: 0, matchingScore: 0 },
      CARE: { total: 0, matchingScore: 0 },
      LABOUR: { total: 0, matchingScore: 0 },
      BIODIVERSITY: { total: 0, matchingScore: 0 },
      WATER: { total: 0, matchingScore: 0 },
      CIVIC: { total: 0, matchingScore: 0 },
    };

    INITIAL_ASSET_CLUSTERS.forEach((a) => {
      counts[a.sector].total += 1;
      const effectiveScore =
        simulateCivicProjects && simulatedImpactLookup
          ? (simulatedImpactLookup[a.id]?.simulatedScore ?? a.spatialResilienceScore)
          : a.spatialResilienceScore;
      if (effectiveScore >= minResilienceScore) {
        counts[a.sector].matchingScore += 1;
      }
    });

    return counts;
  }, [minResilienceScore, simulateCivicProjects, simulatedImpactLookup]);

  // Overall statistics for the filtered assets
  const filteredStats = useMemo(() => {
    const count = filteredAssets.length;
    const totalVerifiedGBP = filteredAssets.reduce((sum, a) => sum + a.verifiedValueGBP, 0);
    const totalCirculating = filteredAssets.reduce((sum, a) => sum + a.circulatingVouchers, 0);
    const avgScore =
      count > 0
        ? (
            filteredAssets.reduce((sum, a) => {
              const effective =
                simulateCivicProjects && simulatedImpactLookup
                  ? (simulatedImpactLookup[a.id]?.simulatedScore ?? a.spatialResilienceScore)
                  : a.spatialResilienceScore;
              return sum + effective;
            }, 0) / count
          ).toFixed(1)
        : '0.0';
    const baselineAvgScore =
      count > 0
        ? (filteredAssets.reduce((sum, a) => sum + a.spatialResilienceScore, 0) / count).toFixed(1)
        : '0.0';
    const avgProximityM =
      count > 0
        ? Math.round(filteredAssets.reduce((sum, a) => sum + a.nearestInfraDistanceM, 0) / count)
        : 0;

    return {
      count,
      totalVerifiedGBP,
      totalCirculating,
      avgScore,
      baselineAvgScore,
      avgProximityM,
    };
  }, [filteredAssets, simulateCivicProjects, simulatedImpactLookup]);

  // Combined Ward Metrics merging with context council wards
  const enrichedWardMetrics = useMemo(() => {
    return WARD_SPATIAL_METRICS.map((wm) => {
      const match = councilWards.find((cw) => cw.wardName === wm.wardName);
      return {
        ...wm,
        terScore: match ? match.terScore : wm.terScore,
        hardshipDisbursedGBP: match ? match.hardshipDisbursedGBP : wm.hardshipDisbursedGBP,
        localMultiplier: match ? match.localMultiplier : wm.localMultiplier,
        anchorSpendPercent: match ? match.anchorSpendPercent : wm.anchorSpendPercent,
      };
    });
  }, [councilWards]);

  // Aggregated Municipal District Heat Statistics
  const totalWeeklyCirculation = useMemo(() => {
    return MUNICIPAL_DISTRICT_HEAT_DATA.reduce(
      (sum, d) => sum + d.weeklyCirculationCOMMONS,
      0
    );
  }, []);

  const avgUtilizationRate = useMemo(() => {
    return (
      MUNICIPAL_DISTRICT_HEAT_DATA.reduce((sum, d) => sum + d.utilizationRatePercent, 0) /
      MUNICIPAL_DISTRICT_HEAT_DATA.length
    );
  }, []);

  const totalActiveParticipants = useMemo(() => {
    return MUNICIPAL_DISTRICT_HEAT_DATA.reduce(
      (sum, d) => sum + d.activeParticipants,
      0
    );
  }, []);

  // LEAFLET MAP STATE MANAGEMENT HANDLERS
  // Fit map viewport to currently matching filtered clusters
  const handleFitFilteredBounds = () => {
    if (!mapInstanceRef.current || filteredAssets.length === 0) return;
    const bounds = L.latLngBounds(filteredAssets.map((a) => [a.lat, a.lng]));
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
  };

  // Reset all filters to default and restore central view
  const handleResetFilters = () => {
    setSelectedSectors(ALL_SECTORS);
    setMinResilienceScore(70);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([51.5335, -0.134], 14, { duration: 1.0 });
    }
  };

  // Quick sector preset handlers
  const handleSelectAllSectors = () => setSelectedSectors(ALL_SECTORS);
  const handleClearAllSectors = () => setSelectedSectors([]);
  const handleToggleSector = (sec: AssetClusterSector) => {
    setSelectedSectors((prev) =>
      prev.includes(sec) ? prev.filter((s) => s !== sec) : [...prev, sec]
    );
  };

  // Auto-fit bounds on filter change effect
  useEffect(() => {
    if (autoFitOnFilter && mapInstanceRef.current && filteredAssets.length > 0) {
      const bounds = L.latLngBounds(filteredAssets.map((a) => [a.lat, a.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [filteredAssets, autoFitOnFilter]);

  // Keep selected asset in sync with filtered assets
  useEffect(() => {
    if (selectedAsset && !filteredAssets.some((a) => a.id === selectedAsset.id)) {
      setSelectedAsset(filteredAssets[0] || null);
    }
  }, [filteredAssets, selectedAsset]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create Map centered over Somers Town / King's Cross (Camden)
      const map = L.map(mapContainerRef.current, {
        center: [51.5335, -0.134],
        zoom: 14,
        zoomControl: true,
        attributionControl: true,
      });

      // CartoDB Dark Matter tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Dedicated layer groups for heatmap and vector features
      const heatGroup = L.layerGroup().addTo(map);
      const layersGroup = L.layerGroup().addTo(map);

      heatLayerGroupRef.current = heatGroup;
      layersGroupRef.current = layersGroup;
      mapInstanceRef.current = map;

      // Invalidate size on load
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    }
  }, []);

  // Render Heatmap and Vector Layers when map, data, or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layersGroup = layersGroupRef.current;
    const heatGroup = heatLayerGroupRef.current;
    if (!map || !layersGroup || !heatGroup) return;

    // Clear previous layers
    layersGroup.clearLayers();
    heatGroup.clearLayers();

    // 1. RENDER HEATMAP OVERLAY (Synchronized with filteredAssets)
    if (showHeatmap && typeof (L as any).heatLayer === 'function') {
      const heatPoints = generateHeatmapPoints(
        heatmapMode,
        filteredAssets,
        MUNICIPAL_DISTRICT_HEAT_DATA
      );

      // Gradients tailored by mode
      const gradientsByMode: Record<HeatmapMode, Record<number, string>> = {
        UTILIZATION_INTENSITY: {
          0.2: '#06b6d4', // Cyan (Emerging trade)
          0.4: '#10b981', // Emerald (Healthy circulation)
          0.6: '#eab308', // Amber (High velocity)
          0.8: '#f97316', // Orange (Vibrant pressure)
          1.0: '#ef4444', // Red/Crimson (Critical congestion)
        },
        ASSET_DENSITY: {
          0.2: '#6366f1', // Indigo
          0.4: '#06b6d4', // Cyan
          0.6: '#10b981', // Emerald
          0.8: '#84cc16', // Lime
          1.0: '#eab308', // Gold
        },
        WELFARE_DEMAND: {
          0.2: '#3b82f6', // Blue
          0.4: '#8b5cf6', // Violet
          0.6: '#ec4899', // Pink
          0.8: '#f43f5e', // Rose
          1.0: '#e11d48', // Crimson Red
        },
      };

      const heat = (L as any).heatLayer(heatPoints, {
        radius: heatRadius,
        blur: heatBlur,
        maxZoom: 17,
        max: 1.0,
        minOpacity: heatOpacity * 0.4,
        gradient: gradientsByMode[heatmapMode],
      });

      heatGroup.addLayer(heat);
    }

    // 2. RENDER MUNICIPAL DISTRICT CHOROPLETH MESH
    if (showDistrictMesh) {
      MUNICIPAL_DISTRICT_HEAT_DATA.forEach((district) => {
        const color = getDistrictHeatColor(district.heatLevel);
        const isSelected = selectedDistrict?.districtId === district.districtId;

        const polygon = L.polygon(district.boundaryPolygon, {
          color: color,
          fillColor: color,
          fillOpacity: isSelected ? 0.22 : 0.08,
          weight: isSelected ? 2.5 : 1.2,
          dashArray: isSelected ? undefined : '5, 5',
        });

        polygon.bindTooltip(
          `<strong>${district.districtName}</strong><br/>Heat Index: <strong>${district.heatIndex}/100</strong> &middot; Util: <strong>${district.utilizationRatePercent}%</strong><br/>Weekly: £${district.weeklyCirculationCOMMONS.toLocaleString()} COMMONS`,
          { className: 'leaflet-custom-tooltip' }
        );

        polygon.on('click', () => {
          setSelectedDistrict(district);
          setSelectedAsset(null);
          setSelectedInfra(null);
          setSelectedWard(null);
        });

        layersGroup.addLayer(polygon);
      });
    }

    // 3. RENDER COUNCIL WARDS (if toggled)
    if (showWards) {
      enrichedWardMetrics.forEach((ward) => {
        const isOptimal = ward.terScore <= 1.0;
        const wardColor = isOptimal ? '#10b981' : '#f59e0b';

        const circle = L.circle([ward.centroidLat, ward.centroidLng], {
          radius: 650,
          color: wardColor,
          fillColor: wardColor,
          fillOpacity: 0.06,
          weight: 1.5,
          dashArray: '4, 4',
        });

        circle.bindTooltip(
          `<strong>${ward.wardName}</strong><br/>TER: ${ward.terScore.toFixed(
            2
          )} &middot; Multiplier: ${ward.localMultiplier}x`,
          { className: 'leaflet-custom-tooltip' }
        );

        circle.on('click', () => {
          setSelectedWard(ward);
          setSelectedAsset(null);
          setSelectedInfra(null);
          setSelectedDistrict(null);
        });

        layersGroup.addLayer(circle);
      });
    }

    // 4. RENDER CRITICAL INFRASTRUCTURE
    if (showInfra) {
      INITIAL_CRITICAL_INFRASTRUCTURE.forEach((infra) => {
        const meta = getInfraMeta(infra.type);

        const customInfraIcon = L.divIcon({
          className: 'custom-infra-marker',
          html: `
            <div style="
              width: 26px;
              height: 26px;
              border-radius: 6px;
              background-color: rgba(15, 23, 42, 0.95);
              border: 2px solid ${meta.color};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 10px ${meta.color}66;
              cursor: pointer;
            ">
              <div style="width: 8px; height: 8px; border-radius: 2px; background-color: ${meta.color};"></div>
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([infra.lat, infra.lng], { icon: customInfraIcon });
        marker.bindTooltip(
          `<strong>[CRITICAL INFRA]</strong><br/>${infra.name}<br/><span style="color:${meta.color}">${meta.label}</span>`,
          { className: 'leaflet-custom-tooltip' }
        );

        marker.on('click', () => {
          setSelectedInfra(infra);
          setSelectedAsset(null);
          setSelectedWard(null);
          setSelectedDistrict(null);
        });

        layersGroup.addLayer(marker);
      });
    }

    // 5. RENDER FILTERED COMMUNITY ASSET CLUSTERS (Synchronized with Control Panel state)
    filteredAssets.forEach((asset) => {
      const meta = getSectorMeta(asset.sector);

      // Walking buffer circle
      if (showBuffers) {
        const bufferCircle = L.circle([asset.lat, asset.lng], {
          radius: asset.bufferCoverageM,
          color: meta.color,
          fillColor: meta.color,
          fillOpacity: 0.1,
          weight: 1,
        });
        layersGroup.addLayer(bufferCircle);
      }

      // Proximity line
      if (showProximityLinks) {
        const nearest = INITIAL_CRITICAL_INFRASTRUCTURE.find(
          (i) => i.name === asset.nearestInfraName
        );
        if (nearest) {
          const polyline = L.polyline(
            [
              [asset.lat, asset.lng],
              [nearest.lat, nearest.lng],
            ],
            {
              color: meta.color,
              weight: 1.2,
              dashArray: '3, 6',
              opacity: 0.6,
            }
          );
          layersGroup.addLayer(polyline);
        }
      }

      // Custom HTML Marker showing sector, utilization badge, and resilience score (with simulation lift when active)
      const impact = simulatedImpactLookup?.[asset.id];
      const effectiveScore = impact ? impact.simulatedScore : asset.spatialResilienceScore;
      const scoreDelta = impact ? impact.scoreDelta : 0;
      const isSimulatedUplift = simulateCivicProjects && scoreDelta > 0;

      const customAssetIcon = L.divIcon({
        className: 'custom-asset-marker',
        html: `
          <div style="
            position: relative;
            width: ${isSimulatedUplift ? '38px' : '34px'};
            height: ${isSimulatedUplift ? '38px' : '34px'};
            border-radius: 50%;
            background-color: #020617;
            border: 2px solid ${isSimulatedUplift ? '#10b981' : meta.color};
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 ${isSimulatedUplift ? '18px #10b981cc' : `16px ${meta.color}aa`};
            cursor: pointer;
          ">
            <span style="font-size: 10px; font-weight: 800; color: ${meta.color}; font-family: monospace;">
              ${asset.sector.substring(0, 2)}
            </span>
            <div style="
              position: absolute;
              bottom: -5px;
              right: -5px;
              background-color: ${isSimulatedUplift ? '#065f46' : meta.color};
              color: ${isSimulatedUplift ? '#a7f3d0' : '#020617'};
              font-size: 8px;
              font-weight: 900;
              font-family: monospace;
              padding: 1px 4px;
              border-radius: 4px;
              border: 1px solid ${isSimulatedUplift ? '#34d399' : '#020617'};
              white-space: nowrap;
            ">
              ${effectiveScore}${isSimulatedUplift ? ` +${scoreDelta}` : ''}
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([asset.lat, asset.lng], { icon: customAssetIcon });
      marker.bindTooltip(
        `<strong>${asset.name}</strong><br/>Sector: ${meta.label}<br/>Resilience Score: <strong>${effectiveScore}/100</strong> ${
          isSimulatedUplift ? `<span style="color:#34d399; font-weight:bold;">(+${scoreDelta} Simulated Lift)</span>` : ''
        }<br/>Utilization: <strong>${asset.utilizationRatePercent}%</strong> &middot; Velocity: ${asset.weeklyVoucherVelocity}x${
          isSimulatedUplift && impact?.contributingProjects.length
            ? `<br/><span style="color:#38bdf8; font-size:10px;">Catalysts: ${impact.contributingProjects.join(', ')}</span>`
            : ''
        }`,
        { className: 'leaflet-custom-tooltip' }
      );

      marker.on('click', () => {
        setSelectedAsset(asset);
        setSelectedInfra(null);
        setSelectedWard(null);
        setSelectedDistrict(null);
        setSelectedCivicProject(null);
      });

      layersGroup.addLayer(marker);
    });

    // 6. RENDER SIMULATED CIVIC INFRASTRUCTURE PROJECTS (Request 6)
    if (simulateCivicProjects) {
      const activeProjects = CIVIC_INFRASTRUCTURE_PROJECTS.filter((p) =>
        selectedProjectIds.includes(p.id)
      );

      activeProjects.forEach((proj) => {
        const isSelected = selectedCivicProject?.id === proj.id;

        // 6a. Projected Impact Buffer Radius
        if (showCivicProjectBuffers) {
          const impactCircle = L.circle([proj.lat, proj.lng], {
            radius: proj.impactRadiusM,
            color: '#2dd4bf',
            fillColor: '#0d9488',
            fillOpacity: isSelected ? 0.15 : 0.06,
            weight: isSelected ? 2 : 1.2,
            dashArray: '6, 6',
          });
          impactCircle.bindTooltip(
            `<strong>${proj.name}</strong><br/>Impact Radius: <strong>${proj.impactRadiusM}m</strong> &middot; Sectors: ${proj.targetBenefitSectors.join(', ')}`,
            { className: 'leaflet-custom-tooltip' }
          );
          layersGroup.addLayer(impactCircle);
        }

        // 6b. Simulated Impact Vector Rays to Benefiting Assets
        filteredAssets.forEach((asset) => {
          const distanceM = calculateHaversineDistance(asset.lat, asset.lng, proj.lat, proj.lng);
          if (distanceM <= proj.impactRadiusM) {
            const impactRay = L.polyline(
              [
                [proj.lat, proj.lng],
                [asset.lat, asset.lng],
              ],
              {
                color: '#10b981',
                weight: 1.5,
                dashArray: '4, 4',
                opacity: 0.7,
              }
            );
            layersGroup.addLayer(impactRay);
          }
        });

        // 6c. Distinctive Diamond Marker for Proposed Civic Infrastructure Project
        const customProjIcon = L.divIcon({
          className: 'custom-civic-project-marker',
          html: `
            <div style="
              position: relative;
              width: 32px;
              height: 32px;
              transform: rotate(45deg);
              border-radius: 6px;
              background-color: #042f2e;
              border: 2px solid #2dd4bf;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 16px #14b8a6cc;
              cursor: pointer;
            ">
              <div style="
                transform: rotate(-45deg);
                font-size: 9px;
                font-weight: 900;
                color: #5eead4;
                font-family: monospace;
              ">
                +Δ
              </div>
              <div style="
                position: absolute;
                top: -6px;
                right: -6px;
                transform: rotate(-45deg);
                background-color: #059669;
                color: #ffffff;
                font-size: 7px;
                font-weight: 800;
                padding: 1px 3px;
                border-radius: 3px;
                border: 1px solid #022c22;
              ">
                NEW
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([proj.lat, proj.lng], { icon: customProjIcon });
        marker.bindTooltip(
          `<strong>[PROPOSED CIVIC INFRA PROJECT]</strong><br/>${proj.name}<br/>Budget: <strong>£${(proj.budgetGBP / 1000000).toFixed(1)}M</strong> &middot; Status: <span style="color:#2dd4bf;">${proj.status}</span><br/><span style="color:#a7f3d0; font-size:10px;">Click to inspect historical regression impact</span>`,
          { className: 'leaflet-custom-tooltip' }
        );

        marker.on('click', () => {
          setSelectedCivicProject(proj);
          setSelectedAsset(null);
          setSelectedInfra(null);
          setSelectedWard(null);
          setSelectedDistrict(null);
        });

        layersGroup.addLayer(marker);
      });
    }
  }, [
    filteredAssets,
    showHeatmap,
    heatmapMode,
    heatRadius,
    heatBlur,
    heatOpacity,
    showDistrictMesh,
    showInfra,
    showBuffers,
    showProximityLinks,
    showWards,
    enrichedWardMetrics,
    selectedDistrict,
    simulateCivicProjects,
    simulatedImpactLookup,
    selectedProjectIds,
    selectedCivicProject,
    showCivicProjectBuffers,
  ]);

  const handleRecenter = (lat: number, lng: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.2 });
    }
  };

  return (
    <div className="space-y-7">
      {/* Module Title & Spatial Overview Banner */}
      <div className="border border-indigo-900/60 bg-gradient-to-r from-slate-950 via-slate-900/80 to-indigo-950/40 rounded-2xl p-6 lg:p-7 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Phase 29 Geospatial AI &middot; Gate R29.1 &middot; Heatmap Overlays &amp; Density Analysis</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Spatial Resilience: Heatmap Density &amp; Utilization Intensity</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Real-time geospatial heatmap visualizing community asset density and the intensity of mutual credit voucher circulation across Camden’s municipal districts. Directly pinpoints economic vibrancy and identifies cold spots requiring Section 106 / CIL capital allocation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-teal-950/60 cursor-pointer transition-all border border-teal-500/40"
              title="Download formal 2-page statutory Council PDF Report with Map & 5-Year Trajectory"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Compiling PDF Report...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  <span>Download Council PDF Report</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowPdfOptionsModal(true)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Configure report officer name & metadata"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Options</span>
            </button>

            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-right font-mono hidden xl:block">
              <span className="text-[10px] text-slate-400 block">Weekly Voucher Velocity</span>
              <span className="text-xl font-bold text-emerald-400 tabular-nums">
                £{(totalWeeklyCirculation / 1000).toFixed(0)}k <span className="text-xs text-slate-400 font-sans">COMMONS/wk</span>
              </span>
            </div>
          </div>
        </div>

        {pdfNotification && (
          <div className="p-3.5 rounded-xl bg-teal-950/90 border border-teal-700/80 text-teal-200 text-xs flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{pdfNotification}</span>
            </div>
            <button
              type="button"
              onClick={() => setPdfNotification(null)}
              className="text-teal-400 hover:text-teal-200 text-xs font-mono underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 4 Summary Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Average Capacity Utilization</span>
            <span className="text-base font-bold font-mono text-emerald-400 mt-0.5 block">
              {avgUtilizationRate.toFixed(1)}% Active
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Across 13 Place-Based Vaults</span>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Municipal Districts Mapped</span>
            <span className="text-base font-bold font-mono text-cyan-400 mt-0.5 block">
              5 Key Urban Corridors
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Choropleth Boundary Mesh</span>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Active Mutual Participants</span>
            <span className="text-base font-bold font-mono text-indigo-400 mt-0.5 block">
              {totalActiveParticipants.toLocaleString()} Citizens &amp; SMEs
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Demurrage Deflected 98%</span>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <span className="text-slate-400 block text-[10px]">Highest Utilization Node</span>
            <span className="text-base font-bold font-mono text-rose-400 mt-0.5 block truncate">
              Somers Town (96.8%)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Housing &amp; Clean Energy</span>
          </div>
        </div>
      </div>

      {/* HEATMAP CONTROL BAR */}
      <div className="border border-slate-800 bg-slate-900/70 rounded-2xl p-4 lg:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Heatmap Overlay Engine</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  LEAFLET.HEAT
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle gradient visualization between asset capacity density, real-time voucher circulation velocity, and welfare demand.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                showHeatmap
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Heatmap: {showHeatmap ? 'ENABLED' : 'PAUSED'}</span>
            </button>

            <button
              onClick={() => setShowDistrictMesh(!showDistrictMesh)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                showDistrictMesh
                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>District Mesh: {showDistrictMesh ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Heatmap Mode Selector Tabs & Parameters */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-mono text-slate-400 shrink-0">Overlay Mode:</span>
            <button
              onClick={() => setHeatmapMode('UTILIZATION_INTENSITY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                heatmapMode === 'UTILIZATION_INTENSITY'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              1. Utilization Intensity (Voucher Velocity)
            </button>
            <button
              onClick={() => setHeatmapMode('ASSET_DENSITY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                heatmapMode === 'ASSET_DENSITY'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              2. Asset Cluster Capacity Density
            </button>
            <button
              onClick={() => setHeatmapMode('WELFARE_DEMAND')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                heatmapMode === 'WELFARE_DEMAND'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              3. Municipal Welfare &amp; Hardship Pressure
            </button>
          </div>

          {/* Quick Heatmap Fine-Tuning Controls */}
          {showHeatmap && (
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px]">Radius:</span>
                <input
                  type="range"
                  min="20"
                  max="65"
                  value={heatRadius}
                  onChange={(e) => setHeatRadius(Number(e.target.value))}
                  className="w-20 accent-emerald-500 cursor-pointer"
                />
                <span className="text-white text-[10px] w-6">{heatRadius}px</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px]">Blur:</span>
                <input
                  type="range"
                  min="12"
                  max="40"
                  value={heatBlur}
                  onChange={(e) => setHeatBlur(Number(e.target.value))}
                  className="w-20 accent-emerald-500 cursor-pointer"
                />
                <span className="text-white text-[10px] w-6">{heatBlur}px</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CIVIC INFRASTRUCTURE IMPACT SIMULATION PANEL (Request 6) */}
      <div className="border border-teal-800/80 bg-gradient-to-r from-slate-950 via-teal-950/40 to-slate-900 rounded-2xl p-5 space-y-4 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-teal-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                  <span>Civic Infrastructure Projects Impact Simulator</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    HISTORICAL REGRESSION ENGINE
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Simulate the empirical impact of new civic infrastructure on community asset resilience scores using 2018–2024 Camden CIL &amp; Section 106 post-outturn data.
              </p>
            </div>
          </div>

          {/* Master Simulation Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setSimulateCivicProjects(!simulateCivicProjects)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  simulateCivicProjects
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-900/50'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    simulateCivicProjects ? 'bg-white animate-pulse' : 'bg-slate-500'
                  }`}
                />
                <span>
                  {simulateCivicProjects
                    ? 'SIMULATION ACTIVE (+Δ LIFTS ON)'
                    : 'SIMULATION OFF (BASELINE SCORES)'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Metrics & Active Project Selector Pills */}
        {simulateCivicProjects && (
          <div className="space-y-3">
            {/* 4 Impact Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950/80 border border-teal-900/60 rounded-xl">
                <span className="text-slate-400 text-[10px] block">Average Resilience Lift</span>
                <span className="text-lg font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                  +{simulationMetrics?.avgLift} pts
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </span>
                <span className="text-[10px] text-slate-400 font-sans">
                  From {filteredStats.baselineAvgScore} to {filteredStats.avgScore}/100
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 border border-teal-900/60 rounded-xl">
                <span className="text-slate-400 text-[10px] block">Grade-A Investment Assets (&ge;90)</span>
                <span className="text-lg font-bold text-cyan-400 mt-0.5 block">
                  {simulationMetrics?.countSimulatedGradeA} / {INITIAL_ASSET_CLUSTERS.length} Vaults
                </span>
                <span className="text-[10px] text-emerald-400 font-sans">
                  +{simulationMetrics ? simulationMetrics.countSimulatedGradeA - simulationMetrics.countBaselineGradeA : 0} newly qualified
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 border border-teal-900/60 rounded-xl">
                <span className="text-slate-400 text-[10px] block">Infrastructure Capital Simulated</span>
                <span className="text-lg font-bold text-white mt-0.5 block">
                  £{((simulationMetrics?.totalCapitalCommitted || 0) / 1000000).toFixed(1)}M GBP
                </span>
                <span className="text-[10px] text-slate-400 font-sans">
                  Across {selectedProjectIds.length} civic schemes
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 border border-teal-900/60 rounded-xl">
                <span className="text-slate-400 text-[10px] block">Empirical Confidence</span>
                <span className="text-lg font-bold text-teal-300 mt-0.5 block">
                  94.2% R² Fit
                </span>
                <span className="text-[10px] text-slate-400 font-sans">
                  Camden 2018–2024 Model
                </span>
              </div>
            </div>

            {/* Individual Project Toggles & Radiuses */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-[11px] font-mono text-slate-400 shrink-0">Toggle Projects:</span>
                {CIVIC_INFRASTRUCTURE_PROJECTS.map((proj) => {
                  const isChecked = selectedProjectIds.includes(proj.id);
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => {
                        setSelectedProjectIds((prev) =>
                          isChecked
                            ? prev.filter((id) => id !== proj.id)
                            : [...prev, proj.id]
                        );
                        setSelectedCivicProject(proj);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-teal-950 text-teal-200 border border-teal-700 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-teal-400" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span className="truncate max-w-[160px] sm:max-w-[200px]">
                        {proj.name}
                      </span>
                      <span className="text-[10px] px-1 rounded bg-slate-900 text-teal-400 border border-teal-900">
                        £{(proj.budgetGBP / 1000000).toFixed(1)}M
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* View options */}
              <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCivicProjectBuffers}
                    onChange={(e) => setShowCivicProjectBuffers(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-teal-500 focus:ring-0"
                  />
                  <span>Project Buffers</span>
                </label>
                <span className="text-slate-600">&middot;</span>
                <select
                  value={impactFilterMode}
                  onChange={(e) => setImpactFilterMode(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-teal-300"
                >
                  <option value="ALL">All Clusters</option>
                  <option value="UPLIFTED_ONLY">Uplifted Clusters Only (+Δ &gt; 0)</option>
                </select>
                <span className="text-slate-600">&middot;</span>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('predictive-recovery-chart');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 rounded bg-teal-950/80 hover:bg-teal-900 border border-teal-800 text-[11px] text-teal-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <TrendingUp className="w-3 h-3 text-teal-400" />
                  <span>5-Yr Recovery Chart</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Map + Sidebar Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Leaflet Map and Map Controls (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* DEDICATED ASSET CLUSTERS FILTER & RESILIENCE CONTROL PANEL */}
          <div className="border border-slate-800 bg-slate-900/80 rounded-2xl p-5 space-y-4 shadow-xl">
            {/* Control Panel Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Asset Cluster Filter &amp; Resilience Control Panel</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {filteredAssets.length} / {INITIAL_ASSET_CLUSTERS.length} Visible
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Filter place-based community clusters by sector type and minimum actuarial resilience score with real-time Leaflet layer &amp; bounds synchronization.
                  </p>
                </div>
              </div>

              {/* Leaflet Map State Control Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleFitFilteredBounds}
                  disabled={filteredAssets.length === 0}
                  title="Fit Leaflet map viewport to encompass all currently matching clusters"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-300 border border-cyan-800/60 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Fit Map Bounds</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  title="Reset all sector selections and score threshold to defaults"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Filter Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-1">
              {/* Column 1: Asset Type / Sector Multi-Select (7 Cols) */}
              <div className="md:col-span-7 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold font-mono flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Asset Type / Sector ({selectedSectors.length}/{ALL_SECTORS.length})</span>
                  </span>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={handleSelectAllSectors}
                      className="text-emerald-400 hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-slate-600">&middot;</span>
                    <button
                      type="button"
                      onClick={handleClearAllSectors}
                      className="text-slate-400 hover:text-white hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Sector Multi-select Chips Grid (4 columns) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ALL_SECTORS.map((sector) => {
                    const isSelected = selectedSectors.includes(sector);
                    const meta = getSectorMeta(sector);
                    const stats = sectorCounts[sector];
                    return (
                      <button
                        key={sector}
                        type="button"
                        onClick={() => handleToggleSector(sector)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-slate-950 border-slate-700 shadow-sm'
                            : 'bg-slate-950/40 border-slate-800/60 opacity-50 hover:opacity-80'
                        }`}
                        style={{
                          borderColor: isSelected ? meta.color : undefined,
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-1.5">
                            {getSectorIcon(sector)}
                            <span className="text-xs font-bold text-white font-mono">
                              {sector}
                            </span>
                          </div>
                          {isSelected ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center justify-between w-full text-[10px] font-mono text-slate-400">
                          <span className="truncate">{meta.label.split(' ')[0]}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded font-bold ${
                              isSelected && stats.matchingScore > 0
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-500'
                            }`}
                          >
                            {stats.matchingScore}/{stats.total}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Sector Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono text-slate-400">
                  <span className="text-slate-500 text-[10px]">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSectors(['ENERGY', 'HOUSING', 'WATER'])}
                    className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer"
                  >
                    Physical (Energy, Housing, Water)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSectors(['FOOD', 'CARE', 'LABOUR', 'CIVIC'])}
                    className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer"
                  >
                    Social (Food, Care, Labour, Civic)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSectors(['BIODIVERSITY', 'WATER', 'FOOD'])}
                    className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer"
                  >
                    Ecological (Bio, Water, Food)
                  </button>
                </div>
              </div>

              {/* Column 2: Resilience Score Threshold Slider & Tier Presets (5 Cols) */}
              <div className="md:col-span-5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Min Resilience Score</span>
                  </span>
                  <span className="font-mono font-bold text-sm text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/80">
                    &ge; {minResilienceScore} / 100
                  </span>
                </div>

                {/* Slider */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="70"
                    max="97"
                    step="1"
                    value={minResilienceScore}
                    onChange={(e) => setMinResilienceScore(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>70 (All)</span>
                    <span>80 (Std)</span>
                    <span>85 (High)</span>
                    <span>90 (Exemplary)</span>
                    <span>97 (Max)</span>
                  </div>
                </div>

                {/* Resilience Score Tier Shortcuts */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    Score Tier Quick Select:
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono">
                    {[
                      { label: 'All 70+', val: 70 },
                      { label: 'High 85+', val: 85 },
                      { label: 'Exemplary 90+', val: 90 },
                      { label: 'Elite 95+', val: 95 },
                    ].map((t) => (
                      <button
                        key={t.val}
                        type="button"
                        onClick={() => setMinResilienceScore(t.val)}
                        className={`py-1 px-1 rounded text-center transition-colors cursor-pointer ${
                          minResilienceScore === t.val
                            ? 'bg-cyan-600 text-white font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-fit toggle */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
                    <input
                      type="checkbox"
                      checked={autoFitOnFilter}
                      onChange={(e) => setAutoFitOnFilter(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                    />
                    <span>Auto-fit map bounds on filter</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Leaflet Sync</span>
                </div>
              </div>
            </div>

            {/* Active Filter Metrics Bar */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              {filteredAssets.length > 0 ? (
                <>
                  <div className="flex flex-wrap items-center gap-3 text-slate-400">
                    <span>
                      Showing <strong className="text-white">{filteredStats.count}</strong> of {INITIAL_ASSET_CLUSTERS.length} clusters
                    </span>
                    <span className="text-slate-600">&middot;</span>
                    <span>
                      Verified Backing: <strong className="text-emerald-400">£{(filteredStats.totalVerifiedGBP / 1000).toFixed(0)}k</strong>
                    </span>
                    <span className="text-slate-600">&middot;</span>
                    <span>
                      Circulating Commons: <strong className="text-cyan-300">{filteredStats.totalCirculating.toLocaleString()}</strong>
                    </span>
                    <span className="text-slate-600">&middot;</span>
                    <span>
                      Avg Resilience: <strong className="text-emerald-400">{filteredStats.avgScore}/100</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showInfra}
                        onChange={(e) => setShowInfra(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                      />
                      <span>Critical Infra ({INITIAL_CRITICAL_INFRASTRUCTURE.length})</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showBuffers}
                        onChange={(e) => setShowBuffers(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                      />
                      <span>Buffers</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showProximityLinks}
                        onChange={(e) => setShowProximityLinks(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                      />
                      <span>Vectors</span>
                    </label>
                  </div>
                </>
              ) : (
                <div className="w-full p-3 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>No community asset clusters match the selected sector and resilience score criteria (&ge; {minResilienceScore}).</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Leaflet Map Frame */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 h-[540px]">
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Dynamic Heatmap Intensity Gradient Legend (Bottom Left) */}
            {showHeatmap && (
              <div className="absolute bottom-4 left-4 z-20 bg-slate-950/92 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-[11px] font-mono space-y-2 shadow-2xl max-w-xs pointer-events-auto">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">
                    {heatmapMode === 'UTILIZATION_INTENSITY'
                      ? 'Utilization Intensity'
                      : heatmapMode === 'ASSET_DENSITY'
                      ? 'Asset Density'
                      : 'Welfare Demand'}
                  </span>
                  <span className="text-emerald-400 font-bold">Live Spectrum</span>
                </div>

                {/* Heat gradient bar */}
                <div
                  className="h-2.5 rounded-full w-full"
                  style={{
                    background:
                      heatmapMode === 'UTILIZATION_INTENSITY'
                        ? 'linear-gradient(to right, #06b6d4, #10b981, #eab308, #f97316, #ef4444)'
                        : heatmapMode === 'ASSET_DENSITY'
                        ? 'linear-gradient(to right, #6366f1, #06b6d4, #10b981, #84cc16, #eab308)'
                        : 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899, #f43f5e, #e11d48)',
                  }}
                />

                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>Emerging Low</span>
                  <span>Moderate</span>
                  <span>Vibrant</span>
                  <span className="text-rose-400 font-bold">Peak Congestion</span>
                </div>
              </div>
            )}

            {/* Quick District Focus Shortcuts (Top Left Pill) */}
            <div className="absolute top-4 left-4 z-20 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-2 text-xs font-mono shadow-xl flex items-center gap-1.5 overflow-x-auto max-w-md">
              <span className="text-slate-400 text-[10px] pl-1 font-bold shrink-0">Focus:</span>
              {MUNICIPAL_DISTRICT_HEAT_DATA.map((d) => (
                <button
                  key={d.districtId}
                  type="button"
                  onClick={() => {
                    setSelectedDistrict(d);
                    handleRecenter(d.centroidLat, d.centroidLng);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] transition-colors whitespace-nowrap cursor-pointer ${
                    selectedDistrict?.districtId === d.districtId
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {d.boroughWard.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Scenario Simulation Switcher (Top Right Pill) */}
            <div className="absolute top-4 right-4 z-20 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-2 text-xs font-mono shadow-xl flex items-center gap-2">
              <span className="text-slate-400 text-[10px] pl-1 font-bold">Stress Sim:</span>
              <select
                value={simulationScenario}
                onChange={(e) => setSimulationScenario(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 text-xs text-white rounded px-2 py-1 focus:outline-none"
              >
                <option value="NOMINAL">Nominal Day (Baseline)</option>
                <option value="FLOOD_SURGE">River Fleet &amp; Canal Flood Surge</option>
                <option value="GRID_BLACKOUT">132kV Power Substation Outage</option>
                <option value="NHS_CARE_SURGE">UCH Inpatient Bed Surge</option>
              </select>
            </div>
          </div>

          {/* MUNICIPAL DISTRICT UTILIZATION HEAT TABLE */}
          <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Municipal District Utilization &amp; Heat Intensity Ledger</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Aggregate density of community assets and voucher circulation turnover across Camden municipal zones.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Sorted by Heat Index
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Municipal District</th>
                    <th className="py-2.5 px-3 text-right">Asset Density</th>
                    <th className="py-2.5 px-3 text-right">Utilization</th>
                    <th className="py-2.5 px-3 text-right">Weekly Turnover</th>
                    <th className="py-2.5 px-3 text-right">Turnover Velocity</th>
                    <th className="py-2.5 px-3 text-right">Heat Index</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {MUNICIPAL_DISTRICT_HEAT_DATA.map((dist) => {
                    const isSelected = selectedDistrict?.districtId === dist.districtId;
                    const heatColor = getDistrictHeatColor(dist.heatLevel);
                    return (
                      <tr
                        key={dist.districtId}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          isSelected ? 'bg-slate-800/80 font-semibold' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 text-slate-200">
                          <div className="font-sans font-semibold text-white">{dist.districtName}</div>
                          <div className="text-[10px] text-slate-400">
                            {dist.boroughWard} &middot; Dominant: <strong className="text-emerald-400">{dist.primaryDominantSector}</strong>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums">
                          {dist.assetDensityPerKm2} / km²
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold tabular-nums">
                          <span
                            className={
                              dist.utilizationRatePercent >= 90
                                ? 'text-rose-400'
                                : dist.utilizationRatePercent >= 80
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }
                          >
                            {dist.utilizationRatePercent}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-cyan-300 font-bold tabular-nums">
                          £{dist.weeklyCirculationCOMMONS.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums">
                          {dist.demurrageTurnoverDays} days
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold tabular-nums">
                          <span
                            className="px-2 py-0.5 rounded text-[10px]"
                            style={{
                              backgroundColor: `${heatColor}22`,
                              color: heatColor,
                              border: `1px solid ${heatColor}55`,
                            }}
                          >
                            {dist.heatIndex} / 100
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDistrict(dist);
                              setSelectedAsset(null);
                              setSelectedInfra(null);
                              setSelectedWard(null);
                              handleRecenter(dist.centroidLat, dist.centroidLng);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] cursor-pointer"
                          >
                            Focus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* FILTERED ASSET CLUSTERS PROXIMITY MATRIX TABLE */}
          <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Filtered Community Asset Clusters ({filteredAssets.length} Matching)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Clusters matching active sector selections and minimum resilience score threshold (&ge;{minResilienceScore}).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFitFilteredBounds}
                  disabled={filteredAssets.length === 0}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Fit Visible</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Asset Cluster</th>
                    <th className="py-2.5 px-3">Sector</th>
                    <th className="py-2.5 px-3">Ward</th>
                    {simulateCivicProjects ? (
                      <>
                        <th className="py-2.5 px-3 text-right">Baseline</th>
                        <th className="py-2.5 px-3 text-right">Simulated Lift</th>
                        <th className="py-2.5 px-3 text-right">Effective Score</th>
                        <th className="py-2.5 px-3">Catalyst Projects</th>
                      </>
                    ) : (
                      <>
                        <th className="py-2.5 px-3">Nearest Critical Infra</th>
                        <th className="py-2.5 px-3">Proximity</th>
                        <th className="py-2.5 px-3">Resilience Score</th>
                      </>
                    )}
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => {
                      const meta = getSectorMeta(asset.sector);
                      const isSelected = selectedAsset?.id === asset.id;
                      const impact = simulatedImpactLookup?.[asset.id];
                      const effectiveScore = impact ? impact.simulatedScore : asset.spatialResilienceScore;
                      const delta = impact ? impact.scoreDelta : 0;

                      return (
                        <tr
                          key={asset.id}
                          className={`hover:bg-slate-800/40 transition-colors ${
                            isSelected ? 'bg-slate-800/80 font-semibold' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 text-slate-200">
                            <div className="font-sans font-semibold text-white">{asset.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {asset.capacityDescription.substring(0, 36)}...
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-bold"
                              style={{
                                backgroundColor: `${meta.color}22`,
                                color: meta.color,
                                border: `1px solid ${meta.color}55`,
                              }}
                            >
                              {asset.sector}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                            {asset.wardName}
                          </td>

                          {simulateCivicProjects ? (
                            <>
                              <td className="py-2.5 px-3 text-right font-mono text-slate-400 tabular-nums">
                                {asset.spatialResilienceScore}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">
                                {delta > 0 ? (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                                    +{delta} pts
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-[10px]">0</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-right font-bold tabular-nums">
                                <span
                                  className={
                                    effectiveScore >= 95
                                      ? 'text-cyan-400'
                                      : effectiveScore >= 90
                                      ? 'text-emerald-400'
                                      : 'text-amber-400'
                                  }
                                >
                                  {effectiveScore}/100
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-[11px] text-teal-300 font-mono">
                                {impact && impact.contributingProjects.length > 0
                                  ? impact.contributingProjects.join(', ')
                                  : 'Systemic Ward Buffer'}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="py-2.5 px-3 text-cyan-300 text-[11px]">
                                {asset.nearestInfraName}
                              </td>
                              <td className="py-2.5 px-3 text-slate-300 font-bold tabular-nums">
                                {asset.nearestInfraDistanceM}m
                              </td>
                              <td className="py-2.5 px-3 font-bold tabular-nums">
                                <span
                                  className={
                                    asset.spatialResilienceScore >= 95
                                      ? 'text-cyan-400'
                                      : asset.spatialResilienceScore >= 90
                                      ? 'text-emerald-400'
                                      : 'text-amber-400'
                                  }
                                >
                                  {asset.spatialResilienceScore}/100
                                </span>
                              </td>
                            </>
                          )}

                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAsset(asset);
                                setSelectedInfra(null);
                                setSelectedWard(null);
                                setSelectedDistrict(null);
                                setSelectedCivicProject(null);
                                handleRecenter(asset.lat, asset.lng);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] cursor-pointer"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={simulateCivicProjects ? 8 : 7} className="py-8 text-center text-slate-400 font-sans">
                        <AlertTriangle className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                        <div>No asset clusters match the active sector and score filters.</div>
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="mt-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs rounded-lg font-mono cursor-pointer"
                        >
                          Reset Filters to Show All
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Heat Inspector & Planning Intelligence (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* District Heat Profile Inspector */}
          {selectedDistrict && (
            <div className="p-5 rounded-2xl border border-indigo-700/80 bg-slate-900/80 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <Activity className="w-3.5 h-3.5" />
                  <span>District Heat Profile</span>
                </span>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                  style={{
                    backgroundColor: `${getDistrictHeatColor(selectedDistrict.heatLevel)}22`,
                    color: getDistrictHeatColor(selectedDistrict.heatLevel),
                    border: `1px solid ${getDistrictHeatColor(selectedDistrict.heatLevel)}66`,
                  }}
                >
                  {selectedDistrict.heatLevel.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {selectedDistrict.districtName}
                </h3>
                <div className="text-xs text-slate-400 mt-1">
                  Borough Ward: <strong className="text-white">{selectedDistrict.boroughWard}</strong>
                </div>
              </div>

              {/* Heat Gauges */}
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Utilization Intensity</span>
                  <span className="text-lg font-bold text-rose-400">
                    {selectedDistrict.utilizationRatePercent}%
                  </span>
                  <span className="text-[9px] text-slate-500 block">Of Pledged Vaults</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Asset Density</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {selectedDistrict.assetDensityPerKm2}
                  </span>
                  <span className="text-[9px] text-slate-500 block">Clusters / km²</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Weekly Mutual Volume:</span>
                  <span className="text-cyan-300 font-bold">
                    £{selectedDistrict.weeklyCirculationCOMMONS.toLocaleString()} COMMONS
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Participants:</span>
                  <span className="text-white">{selectedDistrict.activeParticipants.toLocaleString()} local members</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Demurrage Velocity:</span>
                  <span className="text-emerald-400 font-bold">
                    Every {selectedDistrict.demurrageTurnoverDays} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Anchor Sector:</span>
                  <span className="text-amber-400 font-bold">{selectedDistrict.primaryDominantSector}</span>
                </div>
              </div>

              {/* Hotspots */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Identified Utilization Hotspots
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDistrict.hotspotNames.map((spot, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-sans"
                    >
                      &bull; {spot}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRecenter(selectedDistrict.centroidLat, selectedDistrict.centroidLng)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Center Heatmap on District Core</span>
              </button>
            </div>
          )}

          {/* Selected Entity Inspector Card (Asset / Infra / Ward) */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Micro-Feature Inspector
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                ACTIVE
              </span>
            </div>

            {selectedCivicProject ? (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-teal-950 text-teal-300 border border-teal-800">
                      PROPOSED CIVIC INFRASTRUCTURE
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-300">
                      {selectedCivicProject.planningReference}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                    {selectedCivicProject.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Target Ward: <strong className="text-white">{selectedCivicProject.targetWard}</strong> &middot; Target Year: <strong>{selectedCivicProject.completionYear}</strong>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-teal-900/60 space-y-1.5">
                  <div className="text-teal-400 text-[10px] uppercase font-mono font-bold">Projected Civic Benefit</div>
                  <div className="text-white font-medium">{selectedCivicProject.projectedKeyBenefit}</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed pt-1">{selectedCivicProject.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Capital Budget</span>
                    <span className="text-sm font-bold text-emerald-400">
                      £{(selectedCivicProject.budgetGBP / 1000000).toFixed(1)}M GBP
                    </span>
                    <span className="text-[9px] text-slate-500 block">S106 / CIL Ringfenced</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Impact Buffer</span>
                    <span className="text-sm font-bold text-cyan-400">
                      {selectedCivicProject.impactRadiusM} meters
                    </span>
                    <span className="text-[9px] text-slate-500 block">Radial Reach</span>
                  </div>
                </div>

                {/* Historical Benchmark Citation */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    <span>Historical Empirical Benchmark</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    {selectedCivicProject.historicalBenchmarkBasis}
                  </p>
                </div>

                {/* Target Benefit Sectors */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">
                    Directly Uplifted Sectors
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCivicProject.targetBenefitSectors.map((sec) => (
                      <span
                        key={sec}
                        className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-teal-950 text-teal-300 border border-teal-800"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRecenter(selectedCivicProject.lat, selectedCivicProject.lng)}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  <span>Center on Project Epicenter</span>
                </button>
              </div>
            ) : selectedAsset ? (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold font-mono"
                      style={{
                        backgroundColor: `${getSectorMeta(selectedAsset.sector).color}22`,
                        color: getSectorMeta(selectedAsset.sector).color,
                      }}
                    >
                      {selectedAsset.sector}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {selectedAsset.wardName}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                    {selectedAsset.name}
                  </h3>
                </div>

                {/* Simulation Impact Uplift Highlight */}
                {simulateCivicProjects && simulatedImpactLookup?.[selectedAsset.id] && (
                  <div className="p-3 bg-teal-950/40 border border-teal-800/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-teal-300 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                        <span>Simulated Infrastructure Lift</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                        +{simulatedImpactLookup[selectedAsset.id].scoreDelta} pts
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">Baseline Score:</span>
                      <span className="text-slate-300">{selectedAsset.spatialResilienceScore}/100</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">Post-Infrastructure Score:</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        {simulatedImpactLookup[selectedAsset.id].simulatedScore}/100
                      </span>
                    </div>

                    <div className="pt-1 text-[10px] text-slate-300 font-sans border-t border-teal-900/40 leading-relaxed">
                      <strong className="text-teal-300 font-mono">Historical Basis: </strong>
                      {simulatedImpactLookup[selectedAsset.id].historicalRationale}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-slate-400 text-[11px]">Resilience Capacity Role</div>
                  <div className="text-white font-medium">{selectedAsset.resilienceRole}</div>
                  <div className="text-[11px] text-slate-400">{selectedAsset.capacityDescription}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Resilience Score</span>
                    <span className="text-base font-bold text-cyan-400">
                      {simulateCivicProjects && simulatedImpactLookup?.[selectedAsset.id]
                        ? `${simulatedImpactLookup[selectedAsset.id].simulatedScore}/100`
                        : `${selectedAsset.spatialResilienceScore}/100`}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Utilization Rate</span>
                    <span className="text-base font-bold text-rose-400">
                      {selectedAsset.utilizationRatePercent}%
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nearest Infra:</span>
                    <span className="text-cyan-300 font-semibold text-right">
                      {selectedAsset.nearestInfraName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Distance Vector:</span>
                    <span className="text-white font-bold">{selectedAsset.nearestInfraDistanceM} meters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Velocity Ratio:</span>
                    <span className="text-emerald-400 font-bold">{selectedAsset.weeklyVoucherVelocity}x / week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Verified Collateral:</span>
                    <span className="text-white">£{selectedAsset.verifiedValueGBP.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRecenter(selectedAsset.lat, selectedAsset.lng)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Center on Coordinates [{selectedAsset.lat.toFixed(4)}, {selectedAsset.lng.toFixed(4)}]</span>
                </button>
              </div>
            ) : selectedInfra ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-950 text-rose-300 border border-rose-800">
                    CRITICAL INFRASTRUCTURE
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">
                    {selectedInfra.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {selectedInfra.wardName} &middot; {selectedInfra.type}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-slate-300">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Statutory Designation</div>
                  <div>{selectedInfra.statutoryRole}</div>
                  <div className="pt-1 text-[11px] text-slate-400">
                    Throughput: <strong className="text-white">{selectedInfra.capacityOrThroughput}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Redundancy Tier</span>
                    <span className="text-xs font-bold text-cyan-400">{selectedInfra.redundancyTier}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Backup Power</span>
                    <span className="text-xs font-bold text-emerald-400">
                      {selectedInfra.emergencyPowerBackup ? 'ACTIVE YES' : 'EXTERNAL'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRecenter(selectedInfra.lat, selectedInfra.lng)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Center on Node</span>
                </button>
              </div>
            ) : selectedWard ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                    COUNCIL WARD SPATIAL METRIC
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">
                    {selectedWard.wardName}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Population: {selectedWard.population.toLocaleString()} residents
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tail Equity Ratio (TER):</span>
                    <span
                      className={`font-bold ${
                        selectedWard.terScore <= 1.0 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {selectedWard.terScore.toFixed(2)} {selectedWard.terScore <= 1.0 ? '(Pass)' : '(Monitor)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Preston Multiplier:</span>
                    <span className="text-indigo-300 font-bold">{selectedWard.localMultiplier}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hardship Disbursed:</span>
                    <span className="text-white">£{selectedWard.hardshipDisbursedGBP.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Anchor Spend Rate:</span>
                    <span className="text-cyan-400">{selectedWard.anchorSpendPercent}%</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRecenter(selectedWard.centroidLat, selectedWard.centroidLng)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Center on Ward Centroid</span>
                </button>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500 font-mono text-xs">
                Select an asset cluster or infrastructure node to view detailed metrics.
              </div>
            )}
          </div>

          {/* Section 106 & CIL Planning Allocation Simulator */}
          <div className="p-5 rounded-2xl border border-indigo-800/80 bg-slate-900/70 space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-white text-sm">
                Section 106 / CIL Planning Allocation Simulator
              </h3>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Deploy developer Section 106 and Community Infrastructure Levy (CIL) funds to lower-intensity municipal districts to boost microgrid capacity and food security, cooling congestion in high-heat zones.
            </p>

            <div className="space-y-3 font-mono">
              <div>
                <label className="text-slate-400 text-[10px] block mb-1">
                  Target Municipal District
                </label>
                <select
                  value={targetInvestmentWard}
                  onChange={(e) => setTargetInvestmentWard(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs"
                >
                  {MUNICIPAL_DISTRICT_HEAT_DATA.map((d) => (
                    <option key={d.districtId} value={d.boroughWard}>
                      {d.districtName.substring(0, 36)}... (Heat: {d.heatIndex})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Simulated CIL Allocation:</span>
                  <span className="text-emerald-400 font-bold">
                    £{cilInvestmentGBP.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1500000"
                  step="50000"
                  value={cilInvestmentGBP}
                  onChange={(e) => setCilInvestmentGBP(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Projected Heat Balancing:</span>
                  <span className="text-emerald-400 font-bold">
                    +{(cilInvestmentGBP / 40000).toFixed(1)} Intensity pts in target zone
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">New Mutual Commons:</span>
                  <span className="text-cyan-400 font-bold">
                    +{(cilInvestmentGBP * 0.42).toFixed(0)} COMMONS Vouchers
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Empirical Model & Regulatory Grounding */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3.5 text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Scale className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">
                Historical Empirical Evidence Grounding
              </h3>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Civic infrastructure resilience uplifts are statistically calibrated against audited longitudinal data from Camden Council and the Greater London Authority (2018–2025).
            </p>

            <div className="space-y-2.5">
              {HISTORICAL_INFRASTRUCTURE_BENCHMARKS.map((bm, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-teal-300 font-mono truncate">{bm.dataset}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {bm.sampleSize}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-sans leading-tight">
                    {bm.empiricalObservation}
                  </p>
                  <div className="text-[10px] text-emerald-400 font-mono font-semibold pt-0.5">
                    Empirical Lift: {bm.regressionCoefficient}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-emerald-950/30 rounded-xl border border-emerald-800/40 text-[10px] text-emerald-300 font-mono flex items-center justify-between">
              <span>Auditable by PRA SS1/23 &amp; FCA ESG 4.2</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 5-YEAR PREDICTIVE RESILIENCE RECOVERY TRAJECTORY (RECHARTS) */}
      <div id="predictive-recovery-chart" className="pt-2">
        <PredictiveResilienceChart
          assets={filteredAssets.length > 0 ? filteredAssets : INITIAL_ASSET_CLUSTERS}
          allProjects={CIVIC_INFRASTRUCTURE_PROJECTS}
          selectedProjectIds={selectedProjectIds}
          simulateCivicProjects={simulateCivicProjects}
          cilAllocationGBP={cilInvestmentGBP}
          onDownloadPDF={handleDownloadPDF}
          isGeneratingPDF={isGeneratingPDF}
        />
      </div>

      {/* Statutory PDF Report Configuration Modal */}
      {showPdfOptionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 border border-teal-800/80 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Council Documentation PDF Report</h3>
                  <p className="text-xs text-slate-400">Statutory Section 106 &amp; Infrastructure Resilience Briefing</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfOptionsModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 rounded hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1 font-mono">Signing Officer &amp; Title</label>
                <input
                  type="text"
                  value={pdfOfficerName}
                  onChange={(e) => setPdfOfficerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 text-xs font-mono focus:border-teal-500 focus:outline-none"
                  placeholder="e.g. Amara Okafor (Senior Planning Economist)"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 font-mono">Directorate / Department</label>
                <input
                  type="text"
                  value={pdfDepartment}
                  onChange={(e) => setPdfDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 text-xs font-mono focus:border-teal-500 focus:outline-none"
                  placeholder="e.g. Camden Directorate of Economy, Regeneration & Climate Resilience"
                />
              </div>

              {/* Report Contents Summary Checklist */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono font-bold text-teal-400 uppercase block">Report Contents Checklist:</span>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Page 1: Full Geospatial Map Snapshot ({filteredAssets.length} asset clusters, {showHeatmap ? heatmapMode : 'standard'} layer)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Page 1: Active Filter Audit ({selectedSectors.length} sectors, min score &ge; {minResilienceScore}, £{(filteredAssets.reduce((s, a) => s + a.verifiedValueGBP, 0) / 1000000).toFixed(1)}M collateral)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Page 2: 5-Year Resilience Recovery Trajectory Chart &amp; Annual Matrix (2026–2031)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Page 2: Statutory Attestation &amp; Fiduciary Sign-Off (PRA SS1/23 &amp; S106 Framework)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowPdfOptionsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-teal-950/60 cursor-pointer transition-all border border-teal-500/40"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Compiling PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-white" />
                    <span>Generate &amp; Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
