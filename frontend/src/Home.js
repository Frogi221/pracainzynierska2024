import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const Glowna = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    data: new Date().toISOString().substr(0, 10),
    godzina: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    lokalizacja: "",
    opis: "",
    image: null,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const apiKey = "ee0d24b485f54bf1ba02b51f21945de3";
          const url = `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=${apiKey}&pretty=1`;

          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              const address = data.results[0].formatted;
              setFormData({ ...formData, lokalizacja: address });
            })
            .catch((error) => {
              console.log(error);
            });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  const getLocation = () => {
    handleLocation();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post('http://localhost:8081/zdarzenie', formData) // Zmień URL na odpowiedni dla twojego serwera
      .then((response) => {
        console.log("Zdarzenie zostało dodane do bazy danych:", response.data);
        // Tutaj możesz dodać obsługę przekierowania po pomyślnym dodaniu zdarzenia.
      })
      .catch((error) => {
        console.error("Błąd podczas dodawania zdarzenia:", error);
      });

    setFormData({
      data: new Date().toISOString().substr(0, 10),
      godzina: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      lokalizacja: "",
      opis: "",
      image: null,
    });
  };

  const handleImageChange = (event) => {
    setFormData({ ...formData, image: event.target.files[0] });
  };

  return (
    <div className="glowna-styl">
      <h1>Formularz dodawania zdarzenia drogowego</h1>
      <form className="glowna-form" onSubmit={handleSubmit}>
        <label>
          Data zdarzenia:
          <input
            type="date"
            name="data"
            value={formData.data}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Godzina zdarzenia:
          <input
            type="time"
            name="godzina"
            value={formData.godzina}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Lokalizacja zdarzenia:
          <input
            type="text"
            name="lokalizacja"
            value={formData.lokalizacja}
            onChange={handleInputChange}
            onBlur={handleLocation}
            required
          />
          <button type="button" onClick={getLocation}>
            Ustaw moją lokalizację
          </button>
        </label>
        <label>
          Opis zdarzenia:
          <textarea
            name="opis"
            value={formData.opis}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Zdjęcie:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        <button type="submit">Dodaj zdarzenie</button>
      </form>
    </div>
  );
};

export default Glowna;
