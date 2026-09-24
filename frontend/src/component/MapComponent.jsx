"use client"

import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import styles from "./MapComponent.module.css"

//  FIXED: Proper marker icon setup
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

export default function MapComponent({ location, onCoordinatesChange }) {
  const [coordinates, setCoordinates] = useState(null)
  const [isLoading, setIsLoading] = useState(false) //  ADDED: Loading state
  const defaultCoordinates = { lat: 27.7172, lng: 85.324 } // Default Kathmandu
  const debounceTimer = useRef(null)
  const mapRef = useRef(null) //  ADDED: Map reference

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (!location) {
      setCoordinates(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true) // ADDED: Set loading state

    debounceTimer.current = setTimeout(async () => {
      try {
        console.log("🔍 Searching for location:", location) //  ADDED: Debug log

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`,
        )
        const data = await res.json()

        console.log("📍 Search results:", data) //  ADDED: Debug log

        if (data.length > 0) {
          const newCoordinates = {
            lat: Number.parseFloat(data[0].lat),
            lng: Number.parseFloat(data[0].lon),
          }

          console.log("Setting coordinates:", newCoordinates) //  ADDED: Debug log

          setCoordinates(newCoordinates)
          onCoordinatesChange(newCoordinates)
        } else {
          console.log("❌ No results found for:", location) //  ADDED: Debug log
          setCoordinates(null)
        }
      } catch (error) {
        console.error("❌ Error searching location:", error) //  ADDED: Debug log
        setCoordinates(null)
      } finally {
        setIsLoading(false) // ADDED: Clear loading state
      }
    }, 500)

    return () => clearTimeout(debounceTimer.current)
  }, [location, onCoordinatesChange])

  // FIXED: Force map refresh when coordinates change
  useEffect(() => {
    if (mapRef.current && coordinates) {
      setTimeout(() => {
        mapRef.current.invalidateSize()
      }, 100)
    }
  }, [coordinates])

  const displayCoordinates = coordinates || defaultCoordinates

  return (
    <div className={styles.mapContainer}>
      {/* ADDED: Loading indicator */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(255,255,255,0.9)",
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 1000,
          }}
        >
          Searching...
        </div>
      )}

      <MapContainer
        center={[displayCoordinates.lat, displayCoordinates.lng]}
        zoom={coordinates ? 15 : 12} //  FIXED: Higher zoom when location found
        className={styles.leafletContainer}
        key={`${displayCoordinates.lat}-${displayCoordinates.lng}`}
        ref={mapRef} //  ADDED: Map reference
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance
          //  FIXED: Force initial size calculation
          setTimeout(() => {
            mapInstance.invalidateSize()
          }, 100)
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19} //  ADDED: Max zoom level
        />
        <Marker position={[displayCoordinates.lat, displayCoordinates.lng]}>
          <Popup>{coordinates ? location : "Default Location (Kathmandu)"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
