import "./css/poster.scss";
import React, { useState, useEffect } from "react";

export default function PosterLoader(nftImage) {
  return (
    <>
      <model-viewer
        id="lazy-load"
        camera-controls
        touch-action="pan-y"
        reveal="manual"
        poster={nftImage}
        src={nftImage}
        alt="A 3D model of a damaged helmet"
      >
        <div id="lazy-load-poster" slot="poster"></div>
      </model-viewer>
    </>
  );
}
