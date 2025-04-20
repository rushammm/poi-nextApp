import { NextResponse } from "next/server";

// Define the expected request body structure
interface PredictionRequest {
  latitude: number;
  longitude: number;
  category: string;
}

// Define the structure of the dummy prediction response
interface PredictionResponse {
  prediction: number;
  features: Record<string, number>;
  message: string;
}

export async function POST(request: Request) {
  try {
    const body: PredictionRequest = await request.json();
    const { latitude, longitude, category } = body;

    // Basic validation
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !category
    ) {
      return NextResponse.json(
        { message: "Missing required fields: latitude, longitude, category" },
        { status: 400 }
      );
    }

    // --- Dummy Prediction Logic ---
    // Generate a somewhat random prediction score based on coords/category hash
    const hash = latitude * 100 + longitude + category.length;
    const dummyPrediction = 3.0 + (hash % 200) / 100; // Score between 3.0 and 5.0

    const dummyFeatures = {
      "pop-den": 1000 + Math.random() * 1000,
      "ntl-den": 50 + Math.random() * 50,
      NDVI: 0.1 + Math.random() * 0.3,
      MNDWI: -0.2 + Math.random() * 0.3,
      NDBI: 0.1 + Math.random() * 0.2,
      distance_center: 1 + Math.random() * 5,
      popden_to_ntl_ratio: 20 + Math.random() * 10,
      popden_ntl_interaction: 80000 + Math.random() * 40000,
      ndbi_over_ndvi: 0.5 + Math.random() * 0.5,
      ndvi_minus_mndwi: 0.3 + Math.random() * 0.2,
      business_count_1km: 5 + Math.floor(Math.random() * 20),
      business_count_5km: 50 + Math.floor(Math.random() * 100),
      same_category_count_1km: 1 + Math.floor(Math.random() * 5),
      same_category_count_5km: 5 + Math.floor(Math.random() * 15),
    };
    // --- End Dummy Logic ---

    const response: PredictionResponse = {
      prediction: parseFloat(dummyPrediction.toFixed(2)),
      features: dummyFeatures,
      message: "Prediction successful (dummy data)",
    };

    // Add a small delay to simulate network latency
    await new Promise((resolve) =>
      setTimeout(resolve, 50 + Math.random() * 150)
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Prediction API Error:", error);
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    // Check for JSON parsing errors specifically
    if (
      errorMessage.includes("Unexpected token") ||
      errorMessage.includes("JSON at position")
    ) {
      errorMessage = "Invalid JSON in request body";
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Optional: Handle GET requests or other methods if needed
export async function GET() {
  return NextResponse.json(
    { message: "Method Not Allowed. Use POST." },
    { status: 405 }
  );
}
