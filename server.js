require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getRecommendations } = require("./spotify");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// ── LIGAS Y EQUIPOS ──────────────────────────────────────────────
const ligas = [
  {
    id: "arg",
    nombre: "Liga Profesional Argentina",
    pais: "Argentina",
    bandera: "🇦🇷",
    equipos: [
      { id: "135150", nombre: "Aldosivi" },
      { id: "135151", nombre: "Argentinos Juniors" },
      { id: "135681", nombre: "Atlético Tucumán" },
      { id: "135154", nombre: "Banfield" },
      { id: "137771", nombre: "Barracas Central" },
      { id: "135155", nombre: "Belgrano" },
      { id: "135156", nombre: "Boca Juniors" },
      { id: "137603", nombre: "Central Córdoba" },
      { id: "135159", nombre: "Defensa y Justicia" },
      { id: "137782", nombre: "Deportivo Riestra" },
      { id: "135160", nombre: "Estudiantes de La Plata" },
      { id: "135161", nombre: "Gimnasia y Esgrima LP" },
      { id: "135163", nombre: "Huracán" },
      { id: "135164", nombre: "Independiente" },
      { id: "137777", nombre: "Independiente Rivadavia" },
      { id: "135165", nombre: "Lanús" },
      { id: "135166", nombre: "Newell's Old Boys" },
      { id: "137775", nombre: "Platense" },
      { id: "135170", nombre: "Racing Club" },
      { id: "135171", nombre: "River Plate" },
      { id: "135172", nombre: "Rosario Central" },
      { id: "135173", nombre: "San Lorenzo" },
      { id: "135175", nombre: "Sarmiento" },
      { id: "136674", nombre: "Talleres de Córdoba" },
      { id: "135177", nombre: "Tigre" },
      { id: "135178", nombre: "Unión" },
      { id: "135179", nombre: "Vélez Sarsfield" },
    ],
  },
  {
    id: "esp",
    nombre: "La Liga",
    pais: "España",
    bandera: "🇪🇸",
    equipos: [
      { id: "133604", nombre: "Athletic Club" },
      { id: "133739", nombre: "Atlético de Madrid" },
      { id: "133732", nombre: "Barcelona" },
      { id: "133736", nombre: "Betis" },
      { id: "133738", nombre: "Celta de Vigo" },
      { id: "133741", nombre: "Espanyol" },
      { id: "133744", nombre: "Getafe" },
      { id: "133746", nombre: "Girona" },
      { id: "133728", nombre: "Las Palmas" },
      { id: "133735", nombre: "Leganés" },
      { id: "133730", nombre: "Mallorca" },
      { id: "133729", nombre: "Osasuna" },
      { id: "133733", nombre: "Rayo Vallecano" },
      { id: "133731", nombre: "Real Madrid" },
      { id: "133745", nombre: "Real Sociedad" },
      { id: "133743", nombre: "Sevilla" },
      { id: "133734", nombre: "Valencia" },
      { id: "133742", nombre: "Valladolid" },
      { id: "133740", nombre: "Villarreal" },
      { id: "133737", nombre: "Alavés" },
    ],
  },
  {
    id: "eng",
    nombre: "Premier League",
    pais: "Inglaterra",
    bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    equipos: [
      { id: "133604", nombre: "Arsenal" },
      { id: "133612", nombre: "Aston Villa" },
      { id: "133600", nombre: "Bournemouth" },
      { id: "133597", nombre: "Brentford" },
      { id: "133601", nombre: "Brighton" },
      { id: "133615", nombre: "Chelsea" },
      { id: "133591", nombre: "Crystal Palace" },
      { id: "133598", nombre: "Everton" },
      { id: "133590", nombre: "Fulham" },
      { id: "133596", nombre: "Ipswich" },
      { id: "133619", nombre: "Leicester" },
      { id: "133616", nombre: "Liverpool" },
      { id: "133613", nombre: "Manchester City" },
      { id: "133602", nombre: "Manchester United" },
      { id: "133618", nombre: "Newcastle" },
      { id: "133614", nombre: "Nottingham Forest" },
      { id: "133599", nombre: "Southampton" },
      { id: "133617", nombre: "Tottenham" },
      { id: "133593", nombre: "West Ham" },
      { id: "133611", nombre: "Wolves" },
    ],
  },
  {
    id: "bra",
    nombre: "Brasileirão",
    pais: "Brasil",
    bandera: "🇧🇷",
    equipos: [
      { id: "135764", nombre: "Athletico Paranaense" },
      { id: "135770", nombre: "Atlético Mineiro" },
      { id: "135765", nombre: "Bahia" },
      { id: "135762", nombre: "Botafogo" },
      { id: "135763", nombre: "Corinthians" },
      { id: "135760", nombre: "Cruzeiro" },
      { id: "135766", nombre: "Cuiabá" },
      { id: "135769", nombre: "Flamengo" },
      { id: "135773", nombre: "Fluminense" },
      { id: "135761", nombre: "Fortaleza" },
      { id: "135776", nombre: "Grêmio" },
      { id: "135768", nombre: "Internacional" },
      { id: "135771", nombre: "Juventude" },
      { id: "135767", nombre: "Palmeiras" },
      { id: "135774", nombre: "RB Bragantino" },
      { id: "135775", nombre: "Santos" },
      { id: "135772", nombre: "São Paulo" },
      { id: "135777", nombre: "Sport Recife" },
      { id: "135778", nombre: "Vasco da Gama" },
      { id: "135779", nombre: "Vitória" },
    ],
  },
];

// ── ENDPOINTS ────────────────────────────────────────────────────

// GET /api/ligas → todas las ligas con sus equipos
app.get("/api/ligas", (req, res) => {
  res.json(ligas);
});

// GET /api/ligas/:ligaId → equipos de una liga específica
app.get("/api/ligas/:ligaId", (req, res) => {
  const liga = ligas.find((l) => l.id === req.params.ligaId);
  if (!liga) return res.status(404).json({ error: "Liga no encontrada" });
  res.json(liga);
});

// GET /api/equipo/:id → último partido + resultado + playlists
app.get("/api/equipo/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const url = `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${id}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: "No se encontraron partidos" });
    }

    const partido = data.results[0];
    const golesLocal = parseInt(partido.intHomeScore);
    const golesVisitante = parseInt(partido.intAwayScore);
    const idLocal = partido.idHomeTeam;

    let resultado = "";
    if (id === idLocal) {
      if (golesLocal > golesVisitante) resultado = "GANO";
      else if (golesLocal < golesVisitante) resultado = "PERDIO";
      else resultado = "EMPATO";
    } else {
      if (golesVisitante > golesLocal) resultado = "GANO";
      else if (golesVisitante < golesLocal) resultado = "PERDIO";
      else resultado = "EMPATO";
    }

    const playlists = await getRecommendations(resultado);

    res.json({ resultado, partido, playlists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});