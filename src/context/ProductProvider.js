import React, { createContext, useState, useCallback, useMemo } from "react";

export const ProductContext = createContext();
import { AuthContext } from "./AuthProvider";


const BASE_URL = "https://shanakishan-backend.onrender.com/api/products";
const BOOKING_URL = "https://shanakishan-backend.onrender.com/api/bookings";

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = React.useContext(AuthContext);

  // --------------------------
  // Fetch ALL products
  // --------------------------
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(BASE_URL);
      const data = await res.json();

      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------------
  // Fetch product by ID
  // --------------------------
  const fetchProductById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${BASE_URL}/${id}`);
      const data = await res.json();

      setProductDetail(data);
    } catch (err) {
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------------
  // BOOK PRODUCT
  // --------------------------
  const bookProduct = useCallback(
  async (bookingData) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        console.log("Adding Authorization header with token:", token);
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(BOOKING_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Booking failed" };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Booking error:", err);
      return { success: false, message: "Something went wrong" };
    }
  },
  [token]
);


  // --------------------------
  // Memoized Context Value
  // --------------------------
  const value = useMemo(
    () => ({
      products,
      productDetail,
      loading,
      error,
      fetchProducts,
      fetchProductById,
      bookProduct,       
    }),
    [
      products,
      productDetail,
      loading,
      error,
      fetchProducts,
      fetchProductById,
      bookProduct,
    ]
  );

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
