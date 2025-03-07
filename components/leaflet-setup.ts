'use client'

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

export function setupLeafletMap(container: HTMLElement) {
  const map = L.map(container).setView([51.505, -0.09], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  return map
}

export { fixLeafletIcon };
