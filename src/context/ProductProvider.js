import React, { createContext, useState, useCallback, useMemo } from "react";

export const ProductContext = createContext();
import { AuthContext } from "./AuthProvider";


const BASE_URL = "https://sanaapi.thesanatanisolutions.com/api/products";
const BOOKING_URL = "https://sanaapi.thesanatanisolutions.com/api/bookings";
const SUPPORT_URL = "https://sanaapi.thesanatanisolutions.com/api/support";
const CATEGORY_URL = "https://sanaapi.thesanatanisolutions.com/api/categories";

// const BASE_URL = "http://15.206.128.54:4000/api/products";
// const BOOKING_URL = "http://15.206.128.54:4000/api/bookings";
// const SUPPORT_URL = "http://15.206.128.54:4000/api/support";
// const CATEGORY_URL = "http://15.206.128.54:4000/api/categories";




export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
// CREATE SUPPORT TICKET (PUBLIC - NO TOKEN)
// --------------------------
// --------------------------
// CREATE SUPPORT TICKET (OPTIONAL AUTH)
// --------------------------
const createSupportTicket = useCallback(async (supportData) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };


    // ✅ Only add token if user is logged in
    if (token && token !== "null" && token !== "undefined") {
      headers.Authorization = `Bearer ${token}`;
    }


    const res = await fetch(SUPPORT_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(supportData),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Support request failed",
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Support error:", err);
    return { success: false, message: "Something went wrong" };
  }
}, [token]);

const fetchProductsByCategory = useCallback(async (categoryId) => {
  try {
    setLoading(true);
    setError("");

    const res = await fetch(
      `https://sanaapi.thesanatanisolutions.com/api/categories/${categoryId}/products`
    );

    const data = await res.json();
    setProducts(data);
  } catch (err) {
    setError("Failed to load category products");
  } finally {
    setLoading(false);
  }
}, []);


const fetchCategories = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const res = await fetch(CATEGORY_URL);
    const data = await res.json();

    setCategories(data);
  } catch (err) {
    setError("Failed to load categories");
  } finally {
    setLoading(false);
  }
}, []);





  // --------------------------
  // Memoized Context Value
  // --------------------------
  const value = useMemo(
  () => ({
    products,
    categories,  // 
    productDetail,
    loading,
    error,
    fetchProducts,
    fetchCategories, // 
    fetchProductsByCategory, 
    fetchProductById,
    bookProduct,
    createSupportTicket,
  }),
  [
    products,
    categories,
    productDetail,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    fetchProductsByCategory,
    fetchProductById,
    bookProduct,
    createSupportTicket,
  ]
);


  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
