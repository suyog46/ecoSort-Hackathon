"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// import { ChevronLeft, ChevronRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import Header from "@/components/Header";

const slides = [
  {
    image: "/photos/banner2.jpg",
    title: "We Believe in",
    subtitle: "Individual action",
    description: "Together we can make this world a better place to live in with the help of EcoSort",
    text: "Get Started",
  },
  {
    image: "/photos/banner3.jpg",
    title: "We Believe in",
    subtitle: "Individual action",
    description: "Together we can make this world a better place to live in with the help of EcoSort",
    text: "Get Started",
  },
  {
    image: "/photos/banner4.jpg",
    title: "We Believe in",
    subtitle: "Individual action",
    description: "Together we can make this world a better place to live in with the help of EcoSort",
    text: "Get Started",
  },
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  const goToNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }
  };

  // const goToPrevious = () => {
  //   if (!isAnimating) {
  //     setIsAnimating(true);
  //     setCurrentIndex(
  //       (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
  //     );
  //   }
  // };

  useEffect(() => {
    const timer = setInterval(goToNext, 5000);
    // const timer = setInterval(() => {
    //   goToNext();
    // }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    AOS.refresh(); // Reinitialize animations
  }, [currentIndex]);
  

  const handleTransitionEnd = () => {
    setIsAnimating(false);
    // AOS.refresh();
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Slides container */}
      <div
        className="relative flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative w-full h-screen flex-shrink-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="w-full space-y-6  flex flex-col items-center ">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight text-center">
                    <span
                      data-aos="fade-right"
                      data-aos-delay="100"
                      data-aos-duration="800"
                      className="block  "
                    >
                      {slide.title}
                    </span>
                    <span
                      data-aos="fade-right"
                      data-aos-delay="300"
                      data-aos-duration="800"
                      className="block mt-2 text-[#25cd77]"
                    >
                      {slide.subtitle}
                    </span>
                  </h1>
                  <p
                    className="text-xl lg:text-2xl text-white/90 max-w-2xl text-center"
                    data-aos="fade-up"
                    data-aos-delay="500"
                    data-aos-duration="1000"
                  >
                    {slide.description}
                  </p>
                  <div
                    data-aos="zoom-in"
                    data-aos-delay="700"
                    data-aos-duration="500"
                  >
                   <Link href="/sort"> <Button
                      variant="outline"
                      className= "text-xl  p-5  bg-white/10 text-white border-[#25cd77] hover:bg-[#25cd77] hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                      {slide.text}
                    </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Navigation buttons */}
      {/* <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 p-2 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
        aria-label="Previous slide"
        data-aos="fade-right"
        data-aos-offset="0"
        data-aos-delay="1000"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 p-2 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
        aria-label="Next slide"
        data-aos="fade-left"
        data-aos-offset="0"
        data-aos-delay="1000"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button> */}

      {/* Dots navigation */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
        data-aos="fade-up"
        data-aos-offset="0"
        data-aos-delay="1200"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out ${
              currentIndex === index
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
