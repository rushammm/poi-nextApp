// Remove the import and use a simpler declaration
declare namespace L {
  function heatLayer(
    latlngs: Array<[number, number, number?]>, 
    options?: {
      minOpacity?: number;
      maxZoom?: number;
      max?: number;
      radius?: number;
      blur?: number;
      gradient?: {[key: number]: string};
    }
  ): L.Layer;
}

// Declare the module to make it importable
declare module 'leaflet.heat' {}
