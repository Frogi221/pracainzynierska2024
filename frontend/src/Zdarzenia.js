import React, { useEffect, useState } from "react";
import axios from "axios";
import "./stylezdarzen.css";

const Zdarzenia = () => {
  const [zdarzenia, setZdarzenia] = useState([]);

  useEffect(() => {
    // Pobierz zdarzenia z serwera
    axios.get("http://localhost:8081/zdarzenia").then((response) => {
      setZdarzenia(response.data);
    });
  }, []);

  return (
    <div className="container">
      <header className="header">Lista Zdarzeń</header>
      <ul className="event-list">
        {zdarzenia.map((zdarzenie) => (
          <li key={zdarzenie.id} className="event">
            <p className="event-date">
              <strong>Data:</strong> {zdarzenie.data}
            </p>
            {/* Dodaj godzinę, jeśli jest dostępna */}
            {zdarzenie.godzina && (
              <p className="event-time">
                <strong>Godzina:</strong> {zdarzenie.godzina}
              </p>
            )}
            {zdarzenie.lokalizacja && (
              <p className="event-location">
                <strong>Lokalizacja:</strong> {zdarzenie.lokalizacja}
              </p>
            )}
            <p className="event-description">
              <strong>Opis:</strong> {zdarzenie.opis}
            </p>
            {zdarzenie.image && (
              <img
                src={zdarzenie.image}
                alt="Zdjęcie zdarzenia"
                className="event-image"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Zdarzenia;
