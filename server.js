const express = require('express');
const app = express();
app.use(express.json());

const albumsData = require('./albumsData.json');
const fs = require('fs');

const saveToJson = (qs) => {
    fs.writeFileSync('./albumsData.json', JSON.stringify(qs, null, 4));
  };
  
  const getFromJson = () => JSON.parse(fs.readFileSync('./albumsData.json'));

const getAlbumById = (req, res) => {
    const albumId = parseInt(req.params.albumId);
    const album = albumsData.find(a => a.albumId === albumId)
    if (album) {
        res.send(album)
    } else {
        res.status(404).send('Queen album not found')
    }
};

const saveNewAlbum = (req, res) => {
    const newAlbum = req.body;
    const albums = getFromJson();
    const sameAlbum = albums.find((q) => q.collectionName === newAlbum.collectionName);
    if (sameAlbum) {
      response
        .status(400)
        .send("An album with the same content already exists.");
    }
    const maxId = Math.max(...albums.map((q) => q.albumId));
    newAlbum.albumId = maxId + 1;
    albums.push(newAlbum);
    saveToJson(albums);
    res.status(201).send(newAlbum);
}
  
const editAlbumById = (request, response) => {
    const albumId = parseInt(request.params.albumId);
    const editedAlbum = request.body;
  
    const albums = getFromJson();
    const jsonAlbum = albums.find((q) => q.albumId === albumId);
    jsonAlbum.artistName = editedAlbum.artistName;
    jsonAlbum.collectionName = editedAlbum.collectionName;
    jsonAlbum.artworkUrl100 = editedAlbum.artworkUrl100;
    jsonAlbum.releaseDate = editedAlbum.releaseDate;
    jsonAlbum.primaryGenreName = editedAlbum.primaryGenreName;
    jsonAlbum.url = editedAlbum.url;
    
    saveToJson(albums);
  
    response.status(200).send(editedAlbum);
};
  
const deleteAlbumById = (request, response) => {
    const albumId = parseInt(request.params.albumId);
  
    let albums = getFromJson();
    const jsonAlbum = albums.find((q) => q.albumId === albumId);
    if (jsonAlbum) {
      albums = albums.filter((q) => q.albumId != albumId);
      saveToJson(albums);
      response.status(200).send(jsonAlbum);
    } else {
      response.status(404).send("Did not find album with id " + albumId);
    }
};
  



app.get('/albums', (req, res) => {
    res.send(albumsData)
});
app.get('/albums/:albumId', getAlbumById);
app.post('/albums', saveNewAlbum);
app.put('/albums/:albumId', editAlbumById);
app.delete('/quotes/:albumId', deleteAlbumById);

app.listen(3000, () => console.log("Server is up and running"));