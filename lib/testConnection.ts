import connectMongo from "../config/database";

export async function testConnection() {
  try {
    await connectMongo();
    console.log("MongoDB connection successful!");
    process.exit(0);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

testConnection();
