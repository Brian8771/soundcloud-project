import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from 'react-router-dom';
// import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from './store/session';
// import * as songActions from './store/Songs';
import Navigation from "./components/Navigation";
import Songs from "./components/Songs";
import SongProfile from "./components/SongProfile";
import CreateSong from "./components/CreateSong";
import UserSongs from "./components/MySongs";
import UserProfile from "./components/UserProfile";
import { getAllAlbums } from "./store/album";
import { getSongs } from "./store/Songs";
import CreateAlbum from "./components/CreateAlbum.js";
import UploadChoice from "./components/UploadChoice";
import AlbumProfile from "./components/AlbumProfile";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(dispatch(getAllAlbums())).then(dispatch(getSongs())).then(() =>
      setIsLoaded(true));
  }, [dispatch]);


  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (

        <Switch>
          <Route exact path='/'>
            <Songs />
          </Route>
          <Route path='/signup'>
            <SignupFormPage />
          </Route>
          <Route path='/upload'>
            <UploadChoice />
          </Route>
          <Route path='/songs/create'>
            <CreateSong />
          </Route>
          <Route path='/albums/create'>
            <CreateAlbum />
          </Route>
          <Route path={'/songs/user'}>
            <UserSongs />
          </Route>
          <Route path='/songs/:songId'>
            <SongProfile />
          </Route>
          <Route path={`/album/:id`}>
            <AlbumProfile />
          </Route>
          <Route path='/artists/:id'>
            <UserProfile />
          </Route>
        </Switch>
      )}
      {/* <CreateSong/> */}
    </>
  );
}

export default App;
