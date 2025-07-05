import { useEffect, useState } from 'react';
import L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  Marker,
  Popup,
  Polyline,
  LayersControl,
  LayerGroup,
} from 'react-leaflet';
import { useLoaderData } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import * as CTSAPI from '../lib/CTS-API';
import * as API from '../lib/API';

import tramLines from '../lignes_tram.json';

import VeloparcMarkerIcon from '../img/veloparc_marker_icon.png';
import ParkingMarkerIcon from '../img/parking_marker_icon.png';
import TicketMarkerIcon from '../img/ticket_marker_icon.png';
import SignalMarkerIcon from '../img/signal_marker_icon.png';
import SignalIcon from '../img/signal.png';

import '../../node_modules/leaflet/dist/leaflet.css';

import Signal from '../Components/Signal';
import Login from '../Components/Login';

export function loader() {
  return Promise.all([
    CTSAPI.getParkings(),
    CTSAPI.getVeloparcs(),
    CTSAPI.getRetailOulets(),
    CTSAPI.getLinesDelivery(),
    API.getSignals(),
  ]).then(([parkings, veloparcs, retailOutlets, linesDelivery, loaderDataSignals]) => ({
    parkings,
    veloparcs,
    retailOutlets,
    linesDelivery,
    loaderDataSignals,
  }));
}

export default function Map() {
  useEffect(() => {
    document.title = 'CTScam - Carte';

      if (!localStorage.getItem('favorites')) {
          localStorage.setItem('favorites', JSON.stringify([]));
          console.log('localStorage', localStorage.getItem('favorites'));
      }
  }, []);

  const { user } = useAuth();

  const { veloparcs, parkings, retailOutlets, linesDelivery, loaderDataSignals } = useLoaderData();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignalModal, setShowSignalModal] = useState(false);
  const [signals, setSignals] = useState(loaderDataSignals);

  const handleClickSignal = (e) => {
    if (user) {
      setShowSignalModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleSignalClose = (newSignal) => {
    setShowSignalModal(false);

    setSignals([...signals, newSignal]);
  };

  return (
    <>
      {showLoginModal && <Login onClose={() => setShowLoginModal(false)}></Login>}
      {showSignalModal && <Signal onClose={handleSignalClose}></Signal>}
      <MapContainer center={[48.57, 1447.75]} zoom={13} zoomControl={false} className="w-full h-full !bg-neutral-950">
        <div className="absolute cursor-pointer right-4 bottom-24 z-999" onClick={handleClickSignal}>
          <img
            className="w-20 h-20 duration-100 hover:scale-110"
            src={SignalIcon}
            alt="signal"
            title="Signaler un contrôleur"
          />
        </div>
        <TileLayer url="https://cartodb-basemaps-b.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" />
        <LayersControl position="topright">
          <LayersControl.Overlay checked name="Ligne de tram">
            <LayerGroup>
              {tramLines.map((tramLine, i) => (
                <Polyline
                  key={i}
                  pathOptions={{
                    color:
                      '#' +
                      linesDelivery.AnnotatedLineRef.find((line) => line.LineRef == tramLine.ligne).Extension
                        .RouteColor,
                  }}
                  positions={tramLine.geo_shape.geometry.coordinates.map((coord) => [coord[1], 1440 + coord[0]])}
                >
                  <Popup>{tramLine.ligne}</Popup>
                </Polyline>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Points de ventes">
            <LayerGroup>
              {retailOutlets.map((veloparc, i) => (
                <Marker
                  key={i}
                  icon={
                    new L.Icon({
                      iconUrl: TicketMarkerIcon,
                      popupAnchor: [-1, -31],
                      iconSize: [30, 41],
                      iconAnchor: [15, 40],
                    })
                  }
                  position={[veloparc.Latitude, 1440 + veloparc.Longitude]}
                >
                  <Popup>{veloparc.Designation}</Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Signalements">
            <LayerGroup>
              {signals.map((signal, i) => (
                <Marker
                  key={i}
                  icon={
                    new L.Icon({
                      iconUrl: SignalMarkerIcon,
                      popupAnchor: [-1, -31],
                      iconSize: [30, 53],
                      iconAnchor: [15, 52],
                    })
                  }
                  position={[signal.latitude, 1440 + signal.longitude]}
                ></Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Parkings">
            <LayerGroup>
              {parkings.map((par, i) => (
                <Marker
                  key={i}
                  icon={
                    new L.Icon({
                      iconUrl: ParkingMarkerIcon,
                      popupAnchor: [-1, -31],
                      iconSize: [30, 41],
                      iconAnchor: [15, 40],
                    })
                  }
                  position={[par.Latitude, 1440 + par.Longitude]}
                >
                  <Popup>{par.Designation}</Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Véloparcs">
            <LayerGroup>
              {veloparcs.map((veloparc, i) => (
                <Marker
                  key={i}
                  icon={
                    new L.Icon({
                      iconUrl: VeloparcMarkerIcon,
                      popupAnchor: [-1, -31],
                      iconSize: [30, 41],
                      iconAnchor: [15, 40],
                    })
                  }
                  position={[veloparc.Latitude, 1440 + veloparc.Longitude]}
                >
                  <Popup>{veloparc.Designation}</Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
        <ZoomControl position="topright" />
      </MapContainer>
    </>
  );
}
