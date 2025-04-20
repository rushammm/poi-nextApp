"use client";
import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import CategorySelector from "../components/CategorySelector";
import { useRouter } from "next/navigation";
import { MapPin, BarChart3, ArrowRight } from "lucide-react";
import { DeckGL } from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl/maplibre";

// Define the business categories
const businessCategories = [
  "Restaurant",
  "Cafe",
  "Retail",
  "Medical",
  "Education",
  "Technology",
  "Entertainment",
  "Financial Services",
  "Grocery",
  "Fitness",
  "Beauty",
  "Automotive",
  "Real Estate",
  "Hotel",
  "Professional Services",
];

interface PredictionResponse {
  prediction: number;
  features: Record<string, number>;
  message: string;
}

export default function LocationPrediction() {
  const [category, setCategory] = useState("");
  const [latitude, setLatitude] = useState<number | string>("");
  const [longitude, setLongitude] = useState<number | string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!category) {
      setError("Please select a business category");
      return;
    }

    if (!latitude || !longitude) {
      setError("Please enter both latitude and longitude");
      return;
    }

    // Clear previous error and set loading state
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/locationpred", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: Number(latitude),
          longitude: Number(longitude),
          category,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get prediction");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (err) => {
          setError(`Geolocation error: ${err.message}`);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
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

  // Prepare the predicted point for DeckGL
  const predictedPoint =
    result &&
    latitude &&
    longitude &&
    !isNaN(Number(latitude)) &&
    !isNaN(Number(longitude))
      ? [
          {
            latitude: Number(latitude),
            longitude: Number(longitude),
            category,
            prediction: result.prediction,
          },
        ]
      : [];

  // DeckGL layer for the predicted point
  const predictionLayer =
    predictedPoint.length > 0
      ? new ScatterplotLayer({
          id: "prediction-point",
          data: predictedPoint,
          pickable: true,
          opacity: 1,
          stroked: true,
          filled: true,
          radiusScale: 1,
          radiusMinPixels: 18,
          radiusMaxPixels: 32,
          getPosition: (d: {
            latitude: number;
            longitude: number;
            category: string;
            prediction: number;
          }) => [d.longitude, d.latitude],
          getFillColor: (d: {
            latitude: number;
            longitude: number;
            category: string;
            prediction: number;
          }) =>
            d.prediction >= 4.2
              ? [34, 197, 94, 220] // green for high
              : d.prediction >= 3.5
              ? [251, 191, 36, 220] // yellow for medium
              : [239, 68, 68, 220], // red for low
          getLineColor: [38, 65, 60, 255],
          getRadius: 32,
        })
      : null;

  // Animated blob gradients
  const AnimatedBlobs = () => (
    <>
      <motion.div
        className="absolute top-[120px] left-[-80px] w-[340px] h-[340px] rounded-full z-0"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, #34d39988 0%, #2563eb11 100%)",
          filter: "blur(60px)",
        }}
        initial={{ scale: 0.9, opacity: 0.7 }}
        animate={{ scale: [0.9, 1.1, 0.95, 1], opacity: [0.7, 1, 0.8, 1] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.div
        className="absolute bottom-[100px] right-[-60px] w-[260px] h-[260px] rounded-full z-0"
        style={{
          background:
            "radial-gradient(circle at 40% 60%, #fbbf2488 0%, #f472b611 100%)",
          filter: "blur(60px)",
        }}
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: [1, 1.08, 0.96, 1], opacity: [0.6, 1, 0.7, 1] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror" }}
      />
    </>
  );

  return (
    <motion.section
      className="relative w-full min-h-screen flex items-center bg-background dark:bg-background z-10 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated blob gradients */}
      <AnimatedBlobs />

      <motion.div
        className="container mx-auto px-4 md:px-8 py-12 relative z-10 flex flex-col"
        variants={itemVariants}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground dark:text-foreground mb-2 text-center"
          style={{ fontFamily: "var(--font-geist-sans)" }}
          variants={itemVariants}
        >
          Business Location Predictor
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-center mb-8"
          style={{ fontFamily: "var(--font-geist-sans)" }}
          variants={itemVariants}
        >
          Enter location coordinates and business category to predict business
          success probability.
        </motion.p>

        {/* Bento Box Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 w-full max-w-6xl mx-auto">
          {/* Left: Form + Results */}
          <motion.div
            className="flex flex-col gap-6 bg-background dark:bg-background border border-border dark:border-border rounded-2xl shadow-xl p-6 md:p-8 h-fit"
            variants={scaleIn}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="category"
                  className="text-foreground dark:text-foreground font-medium"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  Business Category
                </label>
                <CategorySelector
                  categories={businessCategories}
                  value={category}
                  onChange={setCategory}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="latitude"
                    className="text-foreground dark:text-foreground font-medium"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    Latitude
                  </label>
                  <input
                    id="latitude"
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="px-4 py-3 rounded-lg bg-background dark:bg-background border border-border dark:border-border text-foreground dark:text-foreground font-medium shadow-sm hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                    placeholder="e.g. 31.5204"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="longitude"
                    className="text-foreground dark:text-foreground font-medium"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    Longitude
                  </label>
                  <input
                    id="longitude"
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="px-4 py-3 rounded-lg bg-background dark:bg-background border border-border dark:border-border text-foreground dark:text-foreground font-medium shadow-sm hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                    placeholder="e.g. 74.3587"
                  />
                </div>
              </div>

              <motion.button
                type="button"
                onClick={getCurrentLocation}
                className="px-4 py-2 bg-secondary/10 text-foreground dark:text-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-secondary/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/60"
                style={{ fontFamily: "var(--font-geist-sans)" }}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MapPin size={18} />
                <span>Use My Current Location</span>
              </motion.button>

              {error && (
                <motion.div
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg font-medium text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                className="px-10 py-4 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/60 active:scale-95 mt-2"
                style={{ fontFamily: "var(--font-geist-sans)" }}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full mr-2" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <BarChart3 size={20} />
                    <span className="text-lg font-semibold">
                      Predict Success Rate
                    </span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Results section with AnimatePresence */}
            <AnimatePresence>
              {result && (
                <motion.div
                  key="prediction-results"
                  className="pt-8 border-t border-border dark:border-border"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ type: "spring", stiffness: 60, damping: 18 }}
                >
                  <h3
                    className="text-2xl font-bold mb-4 text-foreground dark:text-foreground"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    Prediction Results
                  </h3>

                  <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground font-medium">
                        Success Prediction Score:
                      </span>
                      <span className="text-2xl font-bold text-foreground dark:text-foreground">
                        {result.prediction} / 5.0
                      </span>
                    </div>

                    {/* Visualization of the score */}
                    <div className="w-full h-4 bg-background dark:bg-background rounded-full mt-2 mb-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent via-muted to-primary rounded-full"
                        style={{ width: `${(result.prediction / 5) * 100}%` }}
                      />
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {result.prediction < 3.5
                        ? "This location may present challenges for your business category."
                        : result.prediction < 4.2
                        ? "This location shows moderate potential for your business category."
                        : "This location shows excellent potential for your business category."}
                    </p>
                  </div>

                  <h4
                    className="text-lg font-bold mb-3 text-foreground dark:text-foreground"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    Key Location Factors:
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(result.features)
                      .slice(0, 6)
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-background dark:bg-background border border-border dark:border-border rounded-lg p-4"
                        >
                          <span className="text-sm text-muted-foreground block mb-1">
                            {key
                              .replace(/_/g, " ")
                              .replace(/^\w/, (c) => c.toUpperCase())}
                            :
                          </span>
                          <span className="text-lg font-semibold text-foreground dark:text-foreground">
                            {typeof value === "number" && value % 1 !== 0
                              ? value.toFixed(2)
                              : value}
                          </span>
                        </div>
                      ))}
                  </div>

                  <motion.button
                    onClick={() => router.push("/insights")}
                    className="mt-6 px-6 py-3 bg-secondary/10 text-foreground dark:text-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-secondary/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/60 w-full"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>View Detailed Insights</span>
                    <ArrowRight size={18} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: Map with AnimatePresence */}
          <motion.div
            className="flex flex-col justify-center items-center bg-background dark:bg-background border border-border dark:border-border rounded-2xl shadow-xl p-0 h-80 md:h-full min-h-[320px] relative"
            variants={scaleIn}
          >
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="prediction-map"
                  className="w-full h-full min-h-[320px]"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <DeckGL
                    initialViewState={{
                      longitude: Number(longitude) || 74.3587,
                      latitude: Number(latitude) || 31.5204,
                      zoom: 13,
                      pitch: 0,
                      bearing: 0,
                    }}
                    controller={{
                      dragPan: true,
                      dragRotate: false,
                      scrollZoom: false,
                      doubleClickZoom: false,
                      touchZoom: false,
                      keyboard: false,
                    }}
                    layers={predictionLayer ? [predictionLayer] : []}
                    style={{ width: "100%", height: "100%" }}
                    getTooltip={({ object }) =>
                      object
                        ? {
                            html: `<div style="font-family:var(--font-geist-sans);padding:0.5rem 0.75rem;background:var(--background);color:var(--foreground);border-radius:0.5rem;box-shadow:0 2px 12px 0 rgba(0,0,0,0.08);min-width:180px;">
                              <div style='font-size:1.1rem;font-weight:700;margin-bottom:0.25rem;'>Predicted Location</div>
                              <div style='font-size:0.95rem;'><b>Category:</b> ${category}</div>
                              <div style='font-size:0.95rem;'><b>Prediction:</b> ${result.prediction} / 5.0</div>
                            </div>`,
                          }
                        : null
                    }
                  >
                    <Map mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" />
                  </DeckGL>
                  <span
                    className="absolute top-3 left-3 px-3 py-1 rounded bg-background/90 text-xs font-semibold text-muted-foreground shadow"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    Predicted Location
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="prediction-placeholder"
                  className="flex flex-col items-center justify-center h-full w-full text-muted-foreground text-center px-4"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <span className="text-lg font-semibold mb-2">
                    Prediction Map
                  </span>
                  <span className="text-sm">
                    Prediction result will appear here after you submit the
                    form.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* Background effects */}
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
    </motion.section>
  );
}
