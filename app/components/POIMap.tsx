"use client";
import { useEffect, useState } from "react";
import { DeckGL } from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { createClient } from "@supabase/supabase-js";
import { Map } from "react-map-gl/maplibre";
import type { PickingInfo } from "@deck.gl/core";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

// You must set these in your .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const INITIAL_VIEW_STATE = {
  longitude: 74.3587, // Lahore longitude
  latitude: 31.5204, // Lahore latitude
  zoom: 9,
  pitch: 21,
  bearing: 0,
};

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

export default function POIMap() {
  const [data, setData] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("pois")
        .select(
          `latitude,longitude,title,category_name,reviews_count,address,postal_code,source,total_score,reviews_distribution_five_star,reviews_distribution_four_star,reviews_distribution_three_star,reviews_distribution_two_star,reviews_distribution_one_star`
        );
      let pois: POI[] = [];
      if (!error && data) {
        pois = (data as POI[]).map(
          (d) =>
            ({
              latitude: Number(d.latitude),
              longitude: Number(d.longitude),
              title: d.title || "",
              category_name: d.category_name || "",
              reviews_count:
                d.reviews_count == null ? "0" : String(d.reviews_count),
              address: d.address || "",
              postal_code: d.postal_code || "",
              source: d.source || "",
              total_score: d.total_score || "",
              reviews_distribution_five_star:
                d.reviews_distribution_five_star || "0",
              reviews_distribution_four_star:
                d.reviews_distribution_four_star || "0",
              reviews_distribution_three_star:
                d.reviews_distribution_three_star || "0",
              reviews_distribution_two_star:
                d.reviews_distribution_two_star || "0",
              reviews_distribution_one_star:
                d.reviews_distribution_one_star || "0",
            } as POI)
        );
      }

      setData(pois);
      setLoading(false);
    }
    fetchData();
  }, []);

  const layer = new ScatterplotLayer({
    id: "pois",
    data,
    pickable: true,
    opacity: 0.85,
    stroked: true,
    filled: true,
    radiusScale: 0.5,
    radiusMinPixels: 8,
    radiusMaxPixels: 40,
    getPosition: (d: POI) => [d.longitude, d.latitude],
    getFillColor: (d: POI) => {
      // Use review count for color: low=accent, mid=primary, high=secondary
      const count = parseInt(d.reviews_count || "0", 10);
      if (count > 100) return [62, 80, 91, 220]; // --secondary
      if (count > 20) return [38, 65, 60, 220]; // --primary
      return [138, 176, 171, 200]; // --accent
    },
    getLineColor: [38, 65, 60, 255], // --primary
    getRadius: (d: POI) => {
      const count = parseInt(d.reviews_count || "0", 10);
      return Math.max(10, Math.min(40, 10 + Math.sqrt(count) * 2));
    },
    // Add default for missing reviews_count
    updateTriggers: {
      getFillColor: [data.map((d) => d.reviews_count)],
      getRadius: [data.map((d) => d.reviews_count)],
    },
  });

  const getTooltip = (info: PickingInfo) => {
    const object = info.object as POI | undefined;
    if (!object) return null;
    // Show 'No reviews' if reviews_count is missing or zero
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

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.18, delayChildren: 0.2 },
    },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 18 },
    },
  };
  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.1 } },
  };
  const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.1 } },
  };

  return (
    <motion.section
      className="relative w-full min-h-screen flex items-center bg-background dark:bg-background z-10 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-middle md:items-stretch gap-16 h-full"
        variants={itemVariants}
      >
        {/* Text content left */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col justify-center items-start h-full py-16 md:py-0"
          variants={itemVariants}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-foreground dark:text-foreground mb-8 drop-shadow-2xl"
            style={{ fontFamily: "var(--font-geist-sans)" }}
            variants={itemVariants}
          >
            Business Locations Map
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12"
            style={{ fontFamily: "var(--font-geist-sans)" }}
            variants={itemVariants}
          >
            Explore all business points of interest. Zoom and pan to see more
            details.
          </motion.p>
          <motion.button
            className="px-10 py-4 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/60 active:scale-95"
            style={{ fontFamily: "var(--font-geist-sans)" }}
            tabIndex={0}
            onClick={() => {
              router.push("/insights");
            }} // Navigate to insights page on click
            type="button"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="inline-block align-middle"
            >
              <path d="M12 20v-6M12 4v2m0 0a8 8 0 1 1 0 16a8 8 0 0 1 0-16z" />
            </svg>
            <span className="text-lg font-semibold">Open Detailed Insight</span>
          </motion.button>
        </motion.div>
        {/* Map right */}
        <motion.div
          className="w-full md:w-1/2 flex items-center justify-center h-[400px] md:h-[70vh] rounded-2xl overflow-hidden shadow-2xl bg-background dark:bg-background dark:border-border relative"
          variants={scaleIn}
        >
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
            layers={[layer]}
            getTooltip={getTooltip}
            style={{ width: "100%", height: "100%" }}
          >
            <Map mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" />
          </DeckGL>
          {loading && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-background/80 dark:bg-background/80 z-20"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <span
                className="text-muted-foreground text-lg"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                Loading map...
              </span>
            </motion.div>
          )}
          {/* Scale bar */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-4 flex flex-col items-center z-20 select-none"
            variants={fadeIn}
          >
            <div className="w-40 h-2 bg-gradient-to-r from-primary via-accent to-secondary rounded-full shadow-md relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-foreground/60 rounded" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-foreground/60 rounded" />
            </div>
            <span
              className="mt-1 text-xs text-muted-foreground font-semibold tracking-wide"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              ~5 km
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Background effects for design system */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/70 dark:to-background/80 pointer-events-none z-0"
        variants={fadeIn}
      />
      <motion.div
        className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl z-0"
        variants={scaleIn}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-accent/5 dark:bg-accent/10 blur-3xl z-0"
        variants={scaleIn}
      />
      <motion.div
        className="absolute inset-0 bg-background/50 dark:bg-background/70 backdrop-blur-sm z-0"
        variants={fadeIn}
      />
      {/* Decorative elements for extra visual interest */}
      <motion.div
        className="pointer-events-none select-none"
        variants={containerVariants}
      >
        {/* Top left floating dot */}
        <motion.div
          className="absolute top-10 left-10 w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/30 blur-2xl z-10"
          variants={scaleIn}
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
          variants={scaleIn}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        {/* Center faint glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl z-0"
          variants={fadeIn}
        />
      </motion.div>
    </motion.section>
  );
}
