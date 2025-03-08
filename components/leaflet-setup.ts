import L from 'leaflet';

// Fix Leaflet default icon issue in Next.js
const fixLeafletIcon = () => {
  // Only run this on the client side
  if (typeof window !== 'undefined') {
    // @ts-expect-error - Leaflet's Icon.Default.prototype._getIconUrl is not typed but needs to be deleted
    delete L.Icon.Default.prototype._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    });
  }
};

export { fixLeafletIcon };
