require("dotenv").config();

async function getSpotifyToken() {
  const clientId     = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const credentials  = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  // URL oficial de Spotify para obtener el token
  const res  = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("No se pudo obtener el token de Spotify");
  return data.access_token;
}

async function getRecommendations(resultado) {
  const token = await getSpotifyToken();

  // 1. Ampliamos las queries usando arrays con opciones más cortas y efectivas
  const queries = {
    GANO:   ["fiesta", "cumbia", "cuarteto", "pump up", "happy pop", "celebration"],
    EMPATO: ["chill", "lofi beats", "indie tranquilo", "relax", "musica de fondo"],
    PERDIO: ["sad indie", "tango", "melancolía", "sad blues", "canciones tristes"],
  };

  // 2. Elegimos una categoría de palabras al azar
  const opciones = queries[resultado] || queries.EMPATO; 
  const queryAleatoria = opciones[Math.floor(Math.random() * opciones.length)];
  const query = encodeURIComponent(queryAleatoria);

  // 3. Bajamos un poco el offset máximo a 5 para no quedarnos sin resultados
  const randomOffset = Math.floor(Math.random() * 5);

  // 4. URL oficial con sintaxis corregida (?q=)
  const url = `https://api.spotify.com/v1/search?q=$?q=${query}&type=playlist&market=AR&limit=5&offset=${randomOffset}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const text = await res.text();
  const data = JSON.parse(text);
  
  // Limpiamos los nulls
  const playlistsLimpias = (data.playlists?.items ?? []).filter(Boolean);

  // 👀 AQUÍ ESTÁN LOS CONSOLE.LOG MÁGICOS
  console.log("\n=========================================");
  console.log(`🎧 [DEBUG SPOTIFY]`);
  console.log(`🔍 Palabra buscada: "${queryAleatoria}"`);
  console.log(`🎲 Salto (offset) aplicado: ${randomOffset}`);
  console.log(`📦 Cantidad devuelta: ${playlistsLimpias.length} playlists`);
  console.log("-----------------------------------------");
  
  // Imprimimos los nombres de lo que encontró para que lo veas en la terminal
  playlistsLimpias.forEach((pl, index) => {
      console.log(`   ${index + 1}. ${pl.name}`);
  });
  console.log("=========================================\n");

  return playlistsLimpias;
}

module.exports = { getRecommendations };