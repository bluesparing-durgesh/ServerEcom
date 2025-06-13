import  { startTransition, useEffect, useRef, useState } from "react";
import { Box,  CircularProgress, Alert, Grid2 } from "@mui/material";
import { IProduct } from "../../Hook/product/Iproduct";
import Header, { AppBarSkeleton } from "./Header/Header";
import {
  useFilterProduct,
  useGetProducts,
} from "../../Hook/product/useProduct";
import InfiniteScroll from "react-infinite-scroll-component";
import SidebarForFilter from "../../utils/SidebarForFilter";
import CategoryDropDown from "../../utils/CategroryDropDown";
import { useAuth } from "../../context/AuthContext";

import { useGetCarts } from "../../Hook/cart/useCart";
import { CartMapper } from "../../Hook/cart/ICart";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const { user } = useAuth();
  const { data, error, fetchNextPage, hasNextPage, status } = useGetProducts();
  const { data: carts, } = useGetCarts(!!user);
  const [filterProduct, setFilterProduct] = useState<IProduct[]>([]);
  const scrollParentRef = useRef(null);
  const allProducts = data?.pages.flatMap((page) => page.products) || [];
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [rating, setRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("lowToHigh");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const minPrice = priceRange[0];
  const maxPrice = priceRange[1];
  const ratingValue = rating ?? 0;
  const [cartTracker, setCartTracker] = useState<CartMapper>();
  const navigate = useNavigate();
  useEffect(() => {
    if (carts) {
      const mapper: CartMapper = {};
      carts.cartEntries.forEach((ele) => {
        mapper[ele.product._id as string] = ele._id;
      });

      setCartTracker(mapper);
    }
  }, [carts?.cartEntries?.length]);

  useEffect(() => {
    if (user) {
      if (user.role.toLowerCase() === "admin") {
        startTransition(() => {
          navigate("/admin/dashboard");
        });
      }
    }
  }, []);
  const {
    refetch,
  } = useFilterProduct(selectedCategory, minPrice, maxPrice, ratingValue);


  useEffect(() => {
    if (
      ratingValue > 0 ||
      minPrice > 0 ||
      maxPrice < 2000 ||
      selectedCategory
    ) {
      refetch().then((response) => {
        const updatedProducts = response.data?.products || [];
        setFilterProduct(updatedProducts);
      });
    } else {
      setFilterProduct([]);
    }
  }, [sortBy, priceRange, rating, refetch, selectedCategory]);

  if (status === "pending") {
    return (
      <>
      <AppBarSkeleton/>
      <Box sx={{ p: 3 }}>
      <Grid2 container spacing={2} justifyContent="center">
        {Array.from({ length: 8 }, (_, i) => (
          <Grid2
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            key={i}
            sx={{ display: "flex", justifyContent: "center" }}>
            <ProductCardSkeleton />
           
          </Grid2>
        ))}
      </Grid2>
    </Box>
      </>
    );
  }

  if (status === "error" && error instanceof Error) {
    return (
      <Alert severity="error">Failed to load product: {error.message}</Alert>
    );
  }

  return (
    <div
    style={{ 
      background: "linear-gradient(112.1deg, #202639 11.4%, #3f4c77 70.2%)",
      paddingBottom: "50px",
      color: "white",
      minHeight: "100vh",
      fontFamily: "Helvetica, Arial, sans-serif",
    }}>
    {/* Header Section */}
    <Header />
    <Grid2 container spacing={2} justifyContent="center">
    <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}   sx={{ 
        display: "flex", 
        gap: 5, 
        marginTop: 4, 
        paddingX: 3,
        alignItems: "center",
        borderRadius: "20px",
        boxShadow: "0 4px 14px rgb(0 0 0 / 0.4)", 
        border: "1px solid #fff5",
       
      }}>
    {/* Filter Section */}

      <SidebarForFilter
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        rating={rating}
        setRating={setRating}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <CategoryDropDown
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
    </Grid2>
  </Grid2>
    {/* Product List Section */}
    <Box sx={{ paddingX: 3, marginTop: 4 }}>
      {filterProduct.length > 0 ? (
        <Grid2 container spacing={2} justifyContent="center">
          {filterProduct.map((product) => (
            <Grid2
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              key={product.slug}
              sx={{ 
                display: "flex", 
                justifyContent: "center",
                transform: "translateY(0)", 
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "translateY(-10px)" },
              }}>
              <ProductCard product={product} cartTracker={cartTracker} />
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <div
          style={{ 
            marginTop: "1.5rem", 
            width: "100%", 
            paddingLeft: "20px", 
            paddingRight: "20px",
          }}
          ref={scrollParentRef}>
          <InfiniteScroll
            dataLength={allProducts.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            scrollThreshold={0.8}
            style={{ overflow: "inherit" }}
            scrollableTarget={scrollParentRef.current}
            loader={<CircularProgress />}
          >
            <Grid2 container spacing={2} justifyContent="center">
              {allProducts?.map((product) => (
                <Grid2
                  size={{ sm: 6, md: 4, xs: 12, lg: 3 }}
                  key={product?.slug}
                  sx={{ 
                      display: "flex", 
                      justifyContent: "center",
                      transform: "translateY(0)", 
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": { transform: "translateY(-10px)" },
                  }}>
                  <ProductCard product={product} cartTracker={cartTracker} />
                </Grid2>
              ))}
            </Grid2>
          </InfiniteScroll>
        </div>
      )}
  
    </Box>
  
    {/* Footer Section */}
    <Footer year={new Date().getFullYear()} />
  
  </div>
  
  );
};

export default Product;
