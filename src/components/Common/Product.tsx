import React, { startTransition, useEffect, useRef, useState } from "react";
import { Box, Grid, CircularProgress, Alert, Grid2 } from "@mui/material";
import { IProduct } from "../../Hook/product/Iproduct";
import Header from "./Header/Header";
import {
  useFilterProduct,
  useGetProducts,
} from "../../Hook/product/useProduct";
import InfiniteScroll from "react-infinite-scroll-component";
import SidebarForFilter from "../../utils/SidebarForFilter";
import CategoryDropDown from "../../utils/CategroryDropDown";
import { useAuth } from "../../context/AuthContext";

import { useGetCarts } from "../../Hook/cart/useCart";
import { addCartInWeb } from "../../utils/CartHandler";
import { CartMapper } from "../../Hook/cart/ICart";
import ProductCard from "./ProductCard";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const { user } = useAuth();
  const { data, error, fetchNextPage, hasNextPage, status } = useGetProducts();
  const { data: carts, isError: Carterr } = useGetCarts(!!user);
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
    data: filteredProducts,
    refetch,
    isError,
    isLoading,
  } = useFilterProduct(selectedCategory, minPrice, maxPrice, ratingValue);

  // useEffect to refetch products whenever the filters change
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
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
        background:
          "linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)",
      }}
    >
      <Header />
      <Box sx={{ display: "flex", gap: 5, marginTop: 2 }}>
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
      </Box>

      {filterProduct.length > 0 ? (
        <>
          <Grid container spacing={2} justifyContent="center">
            {filterProduct.map((product) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={product.slug}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <ProductCard product={product} cartTracker={cartTracker} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <div
          style={{ marginTop: "1.5rem", width: "100vw", marginInline: 3 }}
          ref={scrollParentRef}
        >
          <InfiniteScroll
            dataLength={allProducts.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            scrollThreshold={0.8}
            style={{ overflow: "inherit" }}
            scrollableTarget={scrollParentRef.current}
            loader={<CircularProgress />}
          >
            <Grid2 container spacing={2} mx={3}>
              {allProducts.map((product) => (
                <Grid2
                  size={{ sm: 6, md: 4, xs: 12, lg: 3 }}
                  key={product.slug}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <ProductCard product={product} cartTracker={cartTracker} />
                </Grid2>
              ))}
            </Grid2>
          </InfiniteScroll>
        </div>
      )}
      <Footer year={2024} />
    </div>
  );
};

export default Product;
