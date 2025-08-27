import React, { useEffect, useRef } from 'react';

const MapComponent = ({ patientLocation, driverLocation, hospitalLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      mapRef.current &&
      !mapInstanceRef.current
    ) {
      const initMap = () => {
        // Load Leaflet CSS if not already loaded
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
          document.head.appendChild(link);
        }

        // Load Leaflet JS if not already loaded
        if (!window.L) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
          script.onload = initializeMap;
          script.onerror = () => console.error('Failed to load Leaflet JS');
          document.head.appendChild(script);
        } else {
          initializeMap();
        }
      };

      const initializeMap = () => {
        const L = window.L;

        // Fix for default marker icons
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Helper function to extract coordinates from different possible formats
        const getCoordinates = (location) => {
          if (!location) return null;
          
          // Handle GeoJSON format: { coordinates: [lng, lat] }
          if (location.coordinates && Array.isArray(location.coordinates)) {
            const [lng, lat] = location.coordinates;
            return { lat, lng };
          }
          
          // Handle direct lat/lng format: { lat, lng }
          if (location.lat && location.lng) {
            return { lat: location.lat, lng: location.lng };
          }
          
          return null;
        };

        // Extract coordinates from all locations
        const patientCoords = getCoordinates(patientLocation);
        const driverCoords = getCoordinates(driverLocation);
        const hospitalCoords = getCoordinates(hospitalLocation);

        // Check if we have at least patient and driver coordinates
        if (!patientCoords && !driverCoords) {
          // Show default map centered on a general location if no coordinates available
          const defaultCoords = { lat: 30.7333, lng: 76.7794 }; // Chandigarh, India
          const map = L.map(mapRef.current).setView([defaultCoords.lat, defaultCoords.lng], 10);
          mapInstanceRef.current = map;

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(map);

          // Add a placeholder message
          const placeholderDiv = L.divIcon({
            className: 'placeholder-message',
            html: `
              <div style="
                background: rgba(249, 115, 22, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                text-align: center;
                font-weight: bold;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
              ">
                📍 Waiting for location data...
              </div>
            `,
            iconSize: [200, 50],
            iconAnchor: [100, 25],
          });

          L.marker([defaultCoords.lat, defaultCoords.lng], { icon: placeholderDiv }).addTo(map);
          return;
        }

        // Use patient location as center, fallback to driver location
        const centerCoords = patientCoords || driverCoords;
        
        // Initialize the map
        const map = L.map(mapRef.current).setView([centerCoords.lat, centerCoords.lng], 13);
        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        // Custom icon for markers
        const createCustomIcon = (color, symbol = '●', shouldBounce = false) => {
          return L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div style="
                width: 30px;
                height: 30px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 3px 10px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 14px;
                animation: ${shouldBounce ? 'bounce 2s infinite' : 'none'};
                position: relative;
                z-index: 1000;
              ">
                ${symbol}
              </div>
              <style>
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-5px); }
                }
              </style>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });
        };

        const markers = [];

        // Add patient marker if coordinates are available
        if (patientCoords) {
          const patientIcon = createCustomIcon('#ef4444', '🆘', true); // Red with bounce
          const patientMarker = L.marker([patientCoords.lat, patientCoords.lng], { icon: patientIcon })
            .addTo(map)
            .bindPopup(`
              <div style="text-align: center; padding: 12px; min-width: 180px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 8px 0; color: #ef4444; font-size: 16px; font-weight: bold;">🚨 Patient Location</h3>
                <p style="margin: 0; font-weight: bold; font-size: 13px; color: #333;">${patientLocation.address || 'Emergency Location'}</p>
                <div style="margin-top: 8px; padding: 6px; background: #fef2f2; border-radius: 4px; border-left: 3px solid #ef4444;">
                  <p style="margin: 0; font-size: 12px; color: #666;">Priority: High</p>
                </div>
              </div>
            `);
          markers.push(patientMarker);
        }

        // Add driver marker if coordinates are available
        if (driverCoords) {
          const driverIcon = createCustomIcon('#f97316', '🚑'); // Orange ambulance
          const driverMarker = L.marker([driverCoords.lat, driverCoords.lng], { icon: driverIcon })
            .addTo(map)
            .bindPopup(`
              <div style="text-align: center; padding: 12px; min-width: 180px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 8px 0; color: #f97316; font-size: 16px; font-weight: bold;">🚑 Ambulance</h3>
                <p style="margin: 0; font-weight: bold; font-size: 13px; color: #333;">Your Current Location</p>
                <div style="margin-top: 8px; padding: 6px; background: #fff7ed; border-radius: 4px; border-left: 3px solid #f97316;">
                  <p style="margin: 0; font-size: 12px; color: #666;">Status: En Route</p>
                </div>
              </div>
            `);
          markers.push(driverMarker);
        }

        // Add hospital marker if coordinates are available
        if (hospitalCoords) {
          const hospitalIcon = createCustomIcon('#10b981', '🏥'); // Green hospital
          const hospitalMarker = L.marker([hospitalCoords.lat, hospitalCoords.lng], { icon: hospitalIcon })
            .addTo(map)
            .bindPopup(`
              <div style="text-align: center; padding: 12px; min-width: 180px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 8px 0; color: #10b981; font-size: 16px; font-weight: bold;">🏥 Hospital</h3>
                <p style="margin: 0; font-weight: bold; font-size: 13px; color: #333;">${hospitalLocation.name || 'Assigned Hospital'}</p>
                <p style="margin: 2px 0; font-size: 12px; color: #666;">${hospitalLocation.address || ''}</p>
                <div style="margin-top: 8px; padding: 6px; background: #f0fdf4; border-radius: 4px; border-left: 3px solid #10b981;">
                  <p style="margin: 0; font-size: 12px; color: #666;">Emergency Ready</p>
                </div>
              </div>
            `);
          markers.push(hospitalMarker);
        }

        // Draw routes if we have the necessary coordinates
        if (driverCoords && patientCoords) {
          // Route from driver to patient (solid line)
          const ambulanceRoute = L.polyline(
            [
              [driverCoords.lat, driverCoords.lng],
              [patientCoords.lat, patientCoords.lng],
            ],
            {
              color: '#f97316',
              weight: 4,
              opacity: 0.8,
            }
          ).addTo(map);
        }

        if (patientCoords && hospitalCoords) {
          // Route from patient to hospital (dashed line)
          const routeToHospital = L.polyline(
            [
              [patientCoords.lat, patientCoords.lng],
              [hospitalCoords.lat, hospitalCoords.lng],
            ],
            {
              color: '#10b981',
              weight: 3,
              opacity: 0.6,
              dashArray: '10, 5',
            }
          ).addTo(map);
        }

        // Add emergency coverage circle around patient location
        if (patientCoords) {
          L.circle([patientCoords.lat, patientCoords.lng], {
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.1,
            weight: 2,
            opacity: 0.4,
            radius: 1000, // 1km radius
          }).addTo(map);
        }

        // Fit map to show all markers with padding
        if (markers.length > 0) {
          const group = L.featureGroup(markers);
          map.fitBounds(group.getBounds().pad(0.3));
        }

        // Add a legend
        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = function () {
          const div = L.DomUtil.create('div', 'legend');
          div.style.cssText = `
            background: rgba(255, 255, 255, 0.9);
            padding: 8px 12px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-size: 12px;
            line-height: 1.4;
            border-left: 4px solid #f97316;
          `;
          div.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px; color: #333;">Legend</div>
            <div style="margin: 2px 0;"><span style="color: #ef4444;">🆘</span> Patient</div>
            <div style="margin: 2px 0;"><span style="color: #f97316;">🚑</span> Ambulance</div>
            ${hospitalCoords ? '<div style="margin: 2px 0;"><span style="color: #10b981;">🏥</span> Hospital</div>' : ''}
          `;
          return div;
        };
        legend.addTo(map);

        // Simulate real-time ambulance movement towards patient (if both coordinates exist)
        if (driverCoords && patientCoords && driverCoords.lat !== patientCoords.lat) {
          let moveCount = 0;
          const totalMoves = 30;
          
          const moveInterval = setInterval(() => {
            if (moveCount < totalMoves && mapInstanceRef.current) {
              const progress = moveCount / totalMoves;
              const newLat = driverCoords.lat + (patientCoords.lat - driverCoords.lat) * progress * 0.3; // Move 30% of the way
              const newLng = driverCoords.lng + (patientCoords.lng - driverCoords.lng) * progress * 0.3;
              
              // Update ambulance marker position
              const ambulanceMarker = markers.find(marker => 
                marker.getPopup().getContent().includes('Ambulance')
              );
              if (ambulanceMarker) {
                ambulanceMarker.setLatLng([newLat, newLng]);
              }
              
              moveCount++;
            } else {
              clearInterval(moveInterval);
            }
          }, 300);

          // Store cleanup function
          mapInstanceRef.current.cleanup = () => {
            clearInterval(moveInterval);
          };
        }
      };

      initMap();
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        if (mapInstanceRef.current.cleanup) {
          mapInstanceRef.current.cleanup();
        }
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [patientLocation, driverLocation, hospitalLocation]);

  return (
    <div
      ref={mapRef}
      style={{
        height: '100%',
        width: '100%',
        minHeight: '300px',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    />
  );
};

export default MapComponent;