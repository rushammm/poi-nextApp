// filepath: c:\Users\raahi\Desktop\NEXTjs\locatepro\app\insights\page.tsx
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import {
  BarChart,
  Map as MapIcon,
  PieChart,
  Users,
  Layers3,
} from "lucide-react";
import { DeckGL } from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl/maplibre";
import type { PickingInfo } from "@deck.gl/core";
import InsightsLoading from "../components/InsightsLoading";
import CategorySelector from "../components/CategorySelector";
import {
  HeatmapLayer,
  GridLayer,
  HexagonLayer,
} from "@deck.gl/aggregation-layers";
import { ColumnLayer, TextLayer } from "@deck.gl/layers";

// Add more Lucide icons as needed

// POI interface (from design)
interface POI {
  latitude: number;
  longitude: number;
  title: string;
  category_name: string;
  reviews_count: string;
  address: string;
  postal_code: string;
  source: string;
  total_score: string;
  reviews_distribution_five_star: string;
  reviews_distribution_four_star: string;
  reviews_distribution_three_star: string;
  reviews_distribution_two_star: string;
  reviews_distribution_one_star: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function InsightsPage() {
  const [data, setData] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  // Filtering state
  const [category, setCategory] = useState<string>("");
  const [minReviews, setMinReviews] = useState<number>(0);
  const [mapLayer, setMapLayer] = useState<
    "scatter" | "heatmap" | "hex" | "grid" | "column" | "text"
  >("scatter");
  const INITIAL_VIEW_STATE = {
    longitude: 74.3587,
    latitude: 31.5204,
    zoom: 9,
    pitch: 21,
    bearing: 0,
  };

  // Filtered data
  const filtered = data.filter(
    (d) =>
      (!category || d.category_name === category) &&
      parseInt(d.reviews_count || "0", 10) >= minReviews
  );

  // DeckGL ScatterplotLayer
  const scatterLayer = new ScatterplotLayer({
    id: "pois-scatter",
    data: filtered,
    pickable: true,
    opacity: 0.85,
    stroked: true,
    filled: true,
    radiusScale: 0.5,
    radiusMinPixels: 8,
    radiusMaxPixels: 40,
    getPosition: (d: POI) => [d.longitude, d.latitude],
    getFillColor: (d: POI) => {
      const count = parseInt(d.reviews_count || "0", 10);
      if (count > 100) return [62, 80, 91, 220]; // --secondary
      if (count > 20) return [38, 65, 60, 220]; // --primary
      return [138, 176, 171, 200]; // --accent
    },
    getLineColor: [38, 65, 60, 255],
    getRadius: (d: POI) => {
      const count = parseInt(d.reviews_count || "0", 10);
      return Math.max(10, Math.min(40, 10 + Math.sqrt(count) * 2));
    },
    updateTriggers: {
      getFillColor: [filtered.map((d) => d.reviews_count)],
      getRadius: [filtered.map((d) => d.reviews_count)],
    },
  });

  // DeckGL HeatmapLayer (aggregate)
  const heatmapLayer = new HeatmapLayer({
    id: "pois-heatmap",
    data: filtered,
    getPosition: (d: POI) => [d.longitude, d.latitude],
    getWeight: (d: POI) => parseInt(d.reviews_count || "0", 10) || 1,
    radiusPixels: 40,
    intensity: 1,
    threshold: 0.05,
    aggregation: "SUM",
    pickable: false,
  });

  // DeckGL HexagonLayer (density)
  const hexLayer = new HexagonLayer({
    id: "pois-hex",
    data: filtered,
    getPosition: (d: POI) => [d.longitude, d.latitude],
    getElevationWeight: (d: POI) => parseInt(d.reviews_count || "0", 10) || 1,
    elevationScale: 30,
    extruded: true,
    radius: 800,
    opacity: 0.7,
    coverage: 0.85,
    pickable: true,
    elevationRange: [0, 1000],
    material: true,
    colorRange: [
      [138, 176, 171], // --accent
      [38, 65, 60], // --primary
      [62, 80, 91], // --secondary
      [229, 231, 235], // --border
      [153, 153, 153], // --muted-foreground
      [24, 24, 27], // --foreground
    ],
  });

  // DeckGL GridLayer (density)
  const gridLayer = new GridLayer({
    id: "pois-grid",
    data: filtered,
    getPosition: (d: POI) => [d.longitude, d.latitude],
    getWeight: (d: POI) => parseInt(d.reviews_count || "0", 10) || 1,
    cellSize: 800,
    elevationScale: 30,
    extruded: true,
    pickable: true,
    opacity: 0.7,
    colorRange: [
      [138, 176, 171], // --accent
      [38, 65, 60], // --primary
      [62, 80, 91], // --secondary
      [229, 231, 235], // --border
      [153, 153, 153], // --muted-foreground
      [24, 24, 27], // --foreground
    ],
  });

  // DeckGL ColumnLayer (3D columns by review count)
  const columnLayer = new ColumnLayer({
    id: "pois-column",
    data: filtered,
    diskResolution: 12,
    radius: 400,
    elevationScale: 20,
    extruded: true,
    pickable: true,
    getPosition: (d: POI) => [d.longitude, d.latitude],
    getFillColor: (d: POI) => {
      const count = parseInt(d.reviews_count || "0", 10);
      if (count > 100) return [62, 80, 91, 220];
      if (count > 20) return [38, 65, 60, 220];
      return [138, 176, 171, 200];
    },
    getElevation: (d: POI) => parseInt(d.reviews_count || "0", 10) || 1,
    getLineColor: [38, 65, 60, 255],
    lineWidthMinPixels: 1,
  });

  // DeckGL TextLayer (show POI titles)
  const textLayer = new TextLayer({
    id: "pois-text",
    data: filtered.slice(0, 200), // limit for performance
    pickable: false,
    getPosition: (d: POI) => [d.longitude, d.latitude],
    getText: (d: POI) => d.title,
    getSize: 16,
    getColor: [38, 65, 60, 255],
    getAngle: 0,
    getTextAnchor: "middle",
    getAlignmentBaseline: "bottom",
    fontFamily: "var(--font-geist-sans), sans-serif",
    background: false,
  });

  // Tooltip (copied from POIMap)
  const getTooltip = (info: PickingInfo) => {
    const object = info.object as POI | undefined;
    if (!object) return null;
    const reviews =
      object.reviews_count && object.reviews_count !== "0"
        ? object.reviews_count
        : "No reviews";
    return {
      html: `<div style="font-family:var(--font-geist-sans);padding:0.5rem 0.75rem;background:var(--background);color:var(--foreground);border-radius:0.5rem;box-shadow:0 2px 12px 0 rgba(0,0,0,0.08);min-width:180px;">
        <div style='font-size:1.1rem;font-weight:700;margin-bottom:0.25rem;'>${object.title}</div>
        <div style='font-size:0.95rem;color:var(--muted-foreground);margin-bottom:0.15rem;'>${object.category_name}</div>
        <div style='font-size:0.95rem;'><b>Reviews:</b> ${reviews}</div>
      </div>`,
    };
  };

  useEffect(() => {
    async function fetchData() {
      let allData: POI[] = [];
      let from = 0;
      const pageSize = 1000;
      let done = false;
      while (!done) {
        const { data: page, error } = await supabase
          .from("pois")
          .select()
          .range(from, from + pageSize - 1);
        if (error) break;
        if (page && page.length > 0) {
          allData = allData.concat(page as POI[]);
          if (page.length < pageSize) done = true;
          else from += pageSize;
        } else {
          done = true;
        }
      }
      setData(allData);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Unique categories for filter dropdown
  const categories = Array.from(
    new Set(data.map((d) => d.category_name))
  ).filter(Boolean);

  // Stats
  const totalPOIs = data.length;
  const totalCategories = categories.length;
  const totalReviews = data.reduce(
    (sum, d) => sum + parseInt(d.reviews_count || "0", 10),
    0
  );
  const avgReviews = totalPOIs > 0 ? Math.round(totalReviews / totalPOIs) : 0;
  const mostReviewedPOI =
    data.length > 0
      ? data.reduce((a, b) =>
          parseInt(a.reviews_count || "0", 10) >
          parseInt(b.reviews_count || "0", 10)
            ? a
            : b
        )
      : null;
  const categoryCounts: Record<string, number> = {};
  data.forEach((d) => {
    if (d.category_name) {
      categoryCounts[d.category_name] =
        (categoryCounts[d.category_name] || 0) + 1;
    }
  });
  const mostCommonCategory =
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  // Additional stats
  const leastReviewedPOI =
    data.length > 0
      ? data.reduce((a, b) =>
          parseInt(a.reviews_count || "0", 10) <
          parseInt(b.reviews_count || "0", 10)
            ? a
            : b
        )
      : null;
  const uniquePostalCodes = new Set(
    data.map((d) => d.postal_code).filter(Boolean)
  ).size;
  const sources = Array.from(
    new Set(data.map((d) => d.source).filter(Boolean))
  );
  const totalSources = sources.length;

  if (loading) {
    return <InsightsLoading />;
  }

  // Map layer selector options
  const layerOptions = [
    { key: "scatter", label: "Scatter" },
    { key: "heatmap", label: "Heatmap" },
    { key: "hex", label: "Hexbin" },
    { key: "grid", label: "Grid" },
    { key: "column", label: "3D Columns" },
    { key: "text", label: "Labels" },
  ];

  // Layer explanations
  const layerExplanations: Record<string, string> = {
    scatter:
      "Shows each business as a circle. Size and color reflect the number of reviews. Useful for seeing individual POIs.",
    heatmap:
      "Displays review density as a smooth heatmap. Brighter areas have more reviews. Great for spotting hotspots.",
    hex: "Aggregates POIs into hexagonal bins. Height and color show review counts per bin. Good for density analysis.",
    grid: "Aggregates POIs into square grid cells. Height and color show review counts per cell. Useful for spatial patterns.",
    column:
      "Places a 3D column at each POI. Height and color represent review count. Useful for visualizing volume per location.",
    text: "Shows the name of each POI as a label. Useful for identifying specific businesses (limited to 200 for clarity).",
  };

  // Layer selection logic
  const selectedLayer =
    mapLayer === "scatter"
      ? scatterLayer
      : mapLayer === "heatmap"
      ? heatmapLayer
      : mapLayer === "hex"
      ? hexLayer
      : mapLayer === "grid"
      ? gridLayer
      : mapLayer === "column"
      ? columnLayer
      : mapLayer === "text"
      ? textLayer
      : scatterLayer;

  return (
    <motion.section
      className="px-6 relative w-full min-h-screen flex flex-col items-center bg-background dark:bg-background z-10 overflow-x-hidden"
      initial="hidden"
      animate="visible"
    >
      {/* --- Animated background effects for depth --- */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/70 dark:to-background/80 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />
      <motion.div
        className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl z-0"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-accent/5 dark:bg-accent/10 blur-3xl z-0"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.6 }}
      />
      <motion.div
        className="absolute top-2/3 right-10 w-72 h-72 rounded-full bg-secondary/5 dark:bg-secondary/10 blur-3xl z-0"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
      />
      <motion.div
        className="absolute inset-0 bg-background/50 dark:bg-background/70 backdrop-blur-sm z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
      />
      {/* Decorative elements for extra visual interest */}
      <motion.div className="pointer-events-none select-none">
        {/* Top left floating dot */}
        <motion.div
          className="absolute top-10 left-10 w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/30 blur-2xl z-10"
          animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0.7, 1] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 2,
          }}
        />
        {/* Bottom right accent ring */}
        <motion.div
          className="absolute bottom-10 right-10 w-24 h-24 rounded-full border-4 border-accent/40 dark:border-accent/60 blur-md z-10"
          style={{ borderStyle: "dashed" }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        {/* Center faint glow */}
        <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl z-0" />
      </motion.div>
      {/* Header */}
      <motion.header
        className="w-full max-w-5xl mx-auto py-12 flex flex-col items-start gap-4 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <h1
          className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-foreground dark:text-foreground"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          <MapIcon className="inline-block mr-3 text-primary" size={44} />
          Insights & Analytics
        </h1>
        <p
          className="text-xl text-muted-foreground max-w-3xl"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Explore business location data with interactive charts and advanced
          filtering.
        </p>
      </motion.header>
      {/* Stats */}
      <motion.div
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
          },
        }}
      >
        {/* Stat Card 1 */}
        <motion.div
          className="bg-primary/10 dark:bg-primary/20 rounded-2xl p-6 flex items-center gap-4 shadow-xl backdrop-blur-md border border-primary/20 hover:scale-[1.025] hover:shadow-2xl transition-all duration-200 cursor-pointer"
          whileHover={{ scale: 1.03, boxShadow: "0 4px 24px 0 var(--primary)" }}
          whileTap={{ scale: 0.98 }}
        >
          <Users className="text-primary" size={32} />
          <div>
            <div
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              {totalPOIs}
            </div>
            <div className="text-muted-foreground text-sm">Total POIs</div>
          </div>
        </motion.div>
        {/* Stat Card 2 */}
        <motion.div
          className="bg-accent/10 dark:bg-accent/20 rounded-2xl p-6 flex items-center gap-4 shadow-xl backdrop-blur-md border border-accent/20 hover:scale-[1.025] hover:shadow-2xl transition-all duration-200 cursor-pointer"
          whileHover={{ scale: 1.03, boxShadow: "0 4px 24px 0 var(--accent)" }}
          whileTap={{ scale: 0.98 }}
        >
          <BarChart className="text-accent" size={32} />
          <div>
            <div
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              {totalCategories}
            </div>
            <div className="text-muted-foreground text-sm">Categories</div>
          </div>
        </motion.div>
        {/* Stat Card 3 */}
        <motion.div
          className="bg-secondary/10 dark:bg-secondary/20 rounded-2xl p-6 flex items-center gap-4 shadow-xl backdrop-blur-md border border-secondary/20 hover:scale-[1.025] hover:shadow-2xl transition-all duration-200 cursor-pointer"
          whileHover={{
            scale: 1.03,
            boxShadow: "0 4px 24px 0 var(--secondary)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <PieChart className="text-secondary" size={32} />
          <div>
            <div
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              {totalReviews.toLocaleString()}
            </div>
            <div className="text-muted-foreground text-sm">Total Reviews</div>
          </div>
        </motion.div>
      </motion.div>
      {/* Filters */}
      <motion.div
        className="w-full max-w-5xl flex flex-wrap gap-4 items-center mb-10 relative z-10 bg-background/80 dark:bg-background/70 backdrop-blur-md rounded-2xl border border-border/30 shadow-lg px-6 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <CategorySelector
          categories={categories}
          value={category}
          onChange={setCategory}
        />
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Min Reviews:</span>
          <input
            type="number"
            min={0}
            className="bg-background dark:bg-background border border-border dark:border-border rounded-lg px-3 py-2 w-24 text-foreground dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 font-medium shadow-sm"
            value={minReviews.toString()}
            onChange={(e) => setMinReviews(Number(e.target.value))}
            aria-label="Minimum reviews"
          />
          <span className="text-xs text-muted-foreground ml-2 tracking-wide uppercase font-semibold">
            Filtered POIs: {filtered.length}
          </span>
        </div>
      </motion.div>
      <motion.div
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        {/* Map implementation with layer toggle */}
        <motion.div
          className="bg-background/80 dark:bg-background/70 col-span-2 rounded-2xl shadow-2xl p-0 min-h-[500px] flex flex-col items-stretch justify-center border border-border/40 backdrop-blur-xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {/* Floating accent ring for visual interest */}
          <motion.div
            className="absolute -top-8 -right-8 w-24 h-24 rounded-full border-4 border-primary/30 dark:border-primary/50 blur-lg z-10 pointer-events-none"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          />
          <div className="flex items-center gap-3 p-4 border-b border-border dark:border-border">
            <Layers3 className="text-foreground" size={20} />
            <span
              className="text-foreground font-semibold"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Map Layer:
            </span>
            <div className="flex gap-2 ml-2">
              {layerOptions.map((opt) => (
                <button
                  key={opt.key}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    mapLayer === opt.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-primary/10"
                  }`}
                  onClick={() => setMapLayer(opt.key as typeof mapLayer)}
                  aria-pressed={mapLayer === opt.key}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-[400px] relative overflow-hidden rounded-b-2xl">
            <DeckGL
              initialViewState={INITIAL_VIEW_STATE}
              controller={{
                dragPan: true,
                dragRotate: false,
                scrollZoom: false,
                doubleClickZoom: false,
                touchZoom: false,
                keyboard: false,
              }}
              layers={[selectedLayer]}
              getTooltip={mapLayer === "scatter" ? getTooltip : undefined}
              style={{
                position: "absolute",
                inset: "0",
                width: "100%",
                height: "100%",
                borderRadius: "0 0 1rem 1rem",
              }}
            >
              <Map
                mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "0 0 1rem 1rem",
                }}
              />
            </DeckGL>
          </div>
        </motion.div>
        {/* Side container for layer explanations */}
        <motion.div
          className="bg-muted/30 dark:bg-muted/40 rounded-2xl row-span-3 shadow-xl border border-border/30 px-6 py-8 flex flex-col gap-4 h-fit"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <h3
            className="text-xl font-semibold text-foreground mb-2"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Layer Mode Explanation
          </h3>
          <div
            className="text-muted-foreground text-base"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            {layerExplanations[mapLayer]}
          </div>
        </motion.div>
      </motion.div>
      {/* Additional POI statistics */}
      <motion.div
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        {/* Average reviews per POI */}
        <div className="bg-background/80 dark:bg-background/70 rounded-2xl p-6 flex items-center gap-4 shadow-lg border border-border/30">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20">
            <BarChart className="text-primary" size={28} />
          </span>
          <div>
            <div
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              {avgReviews}
            </div>
            <div className="text-muted-foreground text-sm">
              Avg. Reviews per POI
            </div>
          </div>
        </div>
        {/* POI with most reviews */}
        <div className="bg-background/80 dark:bg-background/70 rounded-2xl p-6 flex items-center gap-4 shadow-lg border border-border/30">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 dark:bg-secondary/20">
            <Users className="text-secondary" size={28} />
          </span>
          <div>
            <div
              className="text-lg font-semibold text-foreground truncate max-w-[12rem]"
              style={{ fontFamily: "var(--font-geist-sans)" }}
              title={mostReviewedPOI?.title || ""}
            >
              {mostReviewedPOI?.title || "-"}
            </div>
            <div className="text-muted-foreground text-sm">
              Most Reviewed POI
              {mostReviewedPOI?.reviews_count
                ? ` (${mostReviewedPOI.reviews_count} reviews)`
                : ""}
            </div>
          </div>
        </div>
        {/* Most common category */}
        <div className="bg-background/80 dark:bg-background/70 rounded-2xl p-6 flex items-center gap-4 shadow-lg border border-border/30">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 dark:bg-accent/20">
            <PieChart className="text-accent" size={28} />
          </span>
          <div>
            <div
              className="text-lg font-semibold text-foreground truncate max-w-[12rem]"
              style={{ fontFamily: "var(--font-geist-sans)" }}
              title={mostCommonCategory}
            >
              {mostCommonCategory}
            </div>
            <div className="text-muted-foreground text-sm">
              Most Common Category
            </div>
          </div>
        </div>
        {/* Least reviewed POI */}
        <div className="bg-background/80 dark:bg-background/70 rounded-2xl p-6 flex items-center gap-4 shadow-lg border border-border/30">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted-foreground/10 dark:bg-muted-foreground/20">
            <Users className="text-muted-foreground" size={28} />
          </span>
          <div>
            <div
              className="text-lg font-semibold text-foreground truncate max-w-[12rem]"
              style={{ fontFamily: "var(--font-geist-sans)" }}
              title={leastReviewedPOI?.title || ""}
            >
              {leastReviewedPOI?.title || "-"}
            </div>
            <div className="text-muted-foreground text-sm">
              Least Reviewed POI
              {leastReviewedPOI?.reviews_count
                ? ` (${leastReviewedPOI.reviews_count} reviews)`
                : ""}
            </div>
          </div>
        </div>
        {/* Unique postal codes */}
        <div className="bg-background/80 dark:bg-background/70 rounded-2xl p-6 flex items-center gap-4 shadow-lg border border-border/30">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-border/10 dark:bg-border/20">
            <BarChart className="text-border" size={28} />
          </span>
          <div>
            <div
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              {uniquePostalCodes}
            </div>
            <div className="text-muted-foreground text-sm">
              Unique Postal Codes
            </div>
          </div>
        </div>
        {/* Number of unique sources */}
        <div className="bg-background/80 dark:bg-background/70 rounded-2xl p-6 flex items-center gap-4 shadow-lg border border-border/30">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-foreground/10 dark:bg-foreground/20">
            <PieChart className="text-foreground" size={28} />
          </span>
          <div>
            <div
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              {totalSources}
            </div>
            <div className="text-muted-foreground text-sm">
              Unique Data Sources
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
