// import useProductStore from "@/app/stores/useProductStore";

export async function fetchAllProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?all=true`,
      {
        method: "GET",
        cache: "no-store", // Ensures fresh data on each request
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
