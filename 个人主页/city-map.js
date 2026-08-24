(() => {
  const container = document.getElementById("urban-map");
  if (!container) return;

  if (!window.maplibregl) {
    container.classList.add("map-unavailable");
    console.error("MapLibre GL JS did not load.");
    return;
  }

  const lineLayout = {
    "line-cap": "round",
    "line-join": "round",
  };

  const roadLayer = (id, classes, color, opacity, widths, minzoom = 5) => ({
    id,
    type: "line",
    source: "openmaptiles",
    "source-layer": "transportation",
    minzoom,
    filter: ["match", ["get", "class"], classes, true, false],
    layout: lineLayout,
    paint: {
      "line-color": color,
      "line-opacity": opacity,
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        7, widths[0],
        10, widths[1],
        13, widths[2],
        16, widths[3],
      ],
    },
  });

  // OpenMapTiles 矢量数据的最小绘制清单：透明陆地、淡蓝水系、分级路网、弱铁路与边界。
  // 不声明任何 symbol、building、landuse、landcover 或 POI 图层，因此地图中不会出现文字与色块。
  const urbanTextureStyle = {
    version: 8,
    sources: {
      openmaptiles: {
        type: "vector",
        url: "https://tiles.openfreemap.org/planet",
        attribution: "OpenFreeMap © OpenMapTiles · Data © OpenStreetMap contributors",
      },
    },
    layers: [
      {
        id: "transparent-background",
        type: "background",
        paint: { "background-color": "rgba(245, 242, 236, 0)" },
      },
      {
        id: "water-fill",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "water",
        filter: ["!=", ["get", "brunnel"], "tunnel"],
        paint: {
          "fill-color": "#9db8c9",
          "fill-opacity": 0.34,
        },
      },
      {
        id: "waterway-lines",
        type: "line",
        source: "openmaptiles",
        "source-layer": "waterway",
        filter: ["!=", ["get", "brunnel"], "tunnel"],
        layout: lineLayout,
        paint: {
          "line-color": "#789caf",
          "line-opacity": 0.52,
          "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.25, 11, 0.55, 15, 1.15],
        },
      },
      {
        id: "administrative-structure",
        type: "line",
        source: "openmaptiles",
        "source-layer": "boundary",
        filter: ["<=", ["to-number", ["get", "admin_level"]], 4],
        layout: lineLayout,
        paint: {
          "line-color": "#8b8983",
          "line-opacity": 0.2,
          "line-width": 0.3,
        },
      },
      roadLayer("paths-and-tracks", ["path", "track"], "#b8b4ad", 0.34, [0.08, 0.16, 0.28, 0.46], 9),
      roadLayer("service-roads", ["service"], "#aaa69f", 0.4, [0.1, 0.2, 0.34, 0.55], 8),
      roadLayer("minor-roads", ["minor"], "#97938c", 0.48, [0.14, 0.3, 0.48, 0.72], 7),
      roadLayer("tertiary-roads", ["tertiary"], "#85817b", 0.54, [0.2, 0.42, 0.62, 0.9], 6),
      roadLayer("secondary-roads", ["secondary"], "#74716c", 0.58, [0.28, 0.55, 0.78, 1.08], 5),
      roadLayer("primary-roads", ["primary"], "#5f5e5a", 0.62, [0.36, 0.7, 0.94, 1.28], 4),
      roadLayer("trunk-roads", ["trunk"], "#494a49", 0.66, [0.46, 0.86, 1.12, 1.46], 3),
      roadLayer("motorways", ["motorway"], "#333638", 0.7, [0.56, 1.02, 1.34, 1.66], 3),
      {
        id: "rail-network",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        filter: ["match", ["get", "class"], ["rail", "transit"], true, false],
        layout: lineLayout,
        paint: {
          "line-color": "#74716c",
          "line-opacity": 0.3,
          "line-width": ["interpolate", ["linear"], ["zoom"], 7, 0.14, 11, 0.35, 15, 0.65],
        },
      },
    ],
  };

  const map = new maplibregl.Map({
    container,
    style: urbanTextureStyle,
    center: [121.5018, 31.2990],
    zoom: 13.25,
    minZoom: 10,
    maxZoom: 17,
    bearing: -2,
    pitch: 0,
    interactive: true,
    attributionControl: false,
    antialias: true,
    canvasContextAttributes: { alpha: true },
    renderWorldCopies: false,
  });

  map.addControl(
    new maplibregl.NavigationControl({
      showCompass: false,
      showZoom: true,
      visualizePitch: false,
    }),
    "top-right",
  );

  const campusMarker = document.createElement("div");
  campusMarker.className = "campus-location-marker";
  campusMarker.setAttribute("aria-label", "复旦大学邯郸校区");
  campusMarker.innerHTML = '<span aria-hidden="true"></span><b>复旦大学（邯郸校区）</b>';
  new maplibregl.Marker({ element: campusMarker, anchor: "left", offset: [-5, 0] })
    .setLngLat([121.5018, 31.2990])
    .addTo(map);

  map.on("load", () => container.classList.add("map-ready"));
  map.on("error", (event) => {
    if (event?.error) console.error("Urban texture map:", event.error);
  });

  window.addEventListener("resize", () => map.resize(), { passive: true });
  window.FUDAN_URBAN_MAP = map;
})();
