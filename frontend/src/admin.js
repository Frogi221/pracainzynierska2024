import React, { useEffect, useState } from "react";
import axios from "axios";
import "./stylezdarzen.css";

const Admin = () => {
  const [uzytkownicy, setUzytkownicy] = useState([]);
  const [zdarzenia, setZdarzenia] = useState([]);

  useEffect(() => {
    // Pobierz użytkowników z serwera
    axios.get("http://localhost:8081/uzytkownicy").then((response) => {
      setUzytkownicy(response.data);
    });

    // Pobierz zdarzenia z serwera
    axios.get("http://localhost:8081/zdarzenia").then((response) => {
      setZdarzenia(response.data);
    });
  }, []);

  const handleDeleteUzytkownik = (id) => {
    // Wywołaj API do usuwania użytkownika
    axios.delete(`http://localhost:8081/uzytkownicy/${id}`).then(() => {
      // Zaktualizuj stan, aby usunąć użytkownika z widoku
      setUzytkownicy((prevUsers) => prevUsers.filter((user) => user.id !== id));
    });
  };

  const handleDeleteZdarzenie = (id) => {
    // Wywołaj API do usuwania zdarzenia
    axios.delete(`http://localhost:8081/zdarzenia/${id}`).then(() => {
      // Zaktualizuj stan, aby usunąć zdarzenie z widoku
      setZdarzenia((prevZdarzenia) => prevZdarzenia.filter((zdarzenie) => zdarzenie.id !== id));
    });
  };

  return (
    <div className="container">
      <header className="header">Lista Użytkowników</header>
      <ul className="user-list">
        {uzytkownicy.map((uzytkownik) => (
          <li key={uzytkownik.email} className="user">
            <p className="user-name">
              <strong>Imię:</strong> {uzytkownik.name}
            </p>
            <p className="user-email">
              <strong>Email:</strong> {uzytkownik.email}
            </p>
            <button onClick={() => handleDeleteUzytkownik(uzytkownik.id)}>
              Usuń użytkownika
            </button>
          </li>
        ))}
      </ul>

      <header className="header">Lista Zdarzeń</header>
      <ul className="event-list">
        {zdarzenia.map((zdarzenie) => (
          <li key={zdarzenie.id} className="event">
            <p className="event-date">
              <strong>Data:</strong>{" "}
              {new Date(zdarzenie.data).toLocaleString("pl-PL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
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
            <button onClick={() => handleDeleteZdarzenie(zdarzenie.id)}>
              Usuń zdarzenie
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
