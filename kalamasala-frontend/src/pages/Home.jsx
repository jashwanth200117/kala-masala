import React from "react";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import TrustStats from "../components/TrustStats";
import HowToUse from "../components/HowToUse";
import Newsletter from "../components/Newsletter";

export default function Home() {
  return (
    <div className="space-y-16">
      <Hero />
      <div className="max-w-6xl mx-auto px-4">
        <FeaturedProducts />
        <TrustStats />
        <HowToUse />
      </div>
      <Newsletter />
    </div>
  );
}
