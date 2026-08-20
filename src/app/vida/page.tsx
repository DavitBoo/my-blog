"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loader from "../components/Loader";
import VidaFallback from "./VidaFallback";

const VidaScene = dynamic(() => import("./VidaScene"), {
  ssr: false,
  loading: () => <Loader message="Levantando el archipiélago..." />,
});

const soportaWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
};

const VidaPage = () => {
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    setWebgl(soportaWebGL());
  }, []);

  if (webgl === null) return <Loader message="Levantando el archipiélago..." />;

  return webgl ? <VidaScene /> : <VidaFallback />;
};

export default VidaPage;
