"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const AOSProvider = () => {
  useEffect(() => {
    AOS.init({
      once: false,
      duration: 2000,
    });
  }, []);

  return null;
};
