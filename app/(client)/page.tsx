import Container from "@/components/Container";
import HomeBannerCarousel from "@/components/HomeBanner";
import HomeBannerCarouselAdvanced from "@/components/HomeBannerCarouselAdvanced";
import HomeCategories from "@/components/HomeCategories";
import ProductGrid from "@/components/ProductGrid";
import { getCategories } from "@/sanity/queries";

import React from "react";

const Home = async () => {
  const categories = await getCategories(8);

  return (
    <Container className="bg-shop-light-pink">
      <HomeBannerCarouselAdvanced />
      <ProductGrid />
      <HomeCategories categories={categories} />
    </Container>
  );
};

export default Home;
