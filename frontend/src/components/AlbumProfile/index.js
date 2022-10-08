import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { getAllAlbums } from '../../store/album';
import './AlbumProfile.css'

function AlbumProfile() {
    const id = useParams();

    const history = useHistory();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const { songId } = useParams();
    const album = Object.values(useSelector(state => state.albums.allAlbums)).filter(x => x.id === Number(id.id))[0];
    const user = useSelector(state => state.session.user);
    console.log(album)

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const newComment = await dispatch(commentActions.createComments(songId, body)).catch(async (res) => {
    //         const data = await res.json();
    //         if (data.message)
    //             if (data.message === 'Validation Error') {

    //                 setErrors(data.errors);
    //             }
    //             else setErrors([data.message]);
    //     });
    //     await dispatch(commentActions.getCommentsById(songId))

    //     if (newComment) {
    //         setBody('')
    //         setErrors([]);
    //     }
    // }


    // let deleteButton;
    // let editButton;
    // if (user && isLoaded && songs[songId].artist.id === user.id) {
    //     deleteButton = <button className='deleteSongButton' onClick={() => deleteSong()}>Delete</button>;

    //     editButton = <button className='editButton' onClick={() => setEditSong(true)}>Edit</button>;
    // }

    // let content;
    // if (editSong) {
    //     content =
    //         <h2><EditSong setEdit={() => setEditSong()} song={songs} songId={songId} /></h2>

    // } else {
    //     if (isLoaded) {

    let content;
    content = <div className='mainDiv'>
        <div className='innerMainDiv'>
            <div className='SongDiv'>
                <div className='songDetailDiv'>
                    <div className='songDetailsInnerDiv'>
                        <div className='audioAndTitleDiv'>
                            <div style={{ width: 'auto' }}>
                                <h2 className='title'>{album.title}</h2>
                                {/* <h3>{songs[songId].songs.description}</h3> */}
                                <NavLink to={`/artists/${album.User.id}`}>
                                    <h3 className='artist'>{album.User.username}</h3>
                                </NavLink>
                            </div>
                            <div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                                {
                                    album.previewImage.endsWith('.jpg') ?
                                        <img className='img' src={album.previewImage} alt={album.description} /> :
                                        <img className='img' src='https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png' alt={album.description} />
                                }
                            </div>
                            {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    {editButton}
                                    {deleteButton}
                                </div> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className='albumDiv'>
                <div className='albumDetailsDiv'>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img className='userImage' src={album.User.previewImage} alt={album.User.username} />
                        <p>{album.User.username}</p>
                    </div>
                    <div className='albumDesc'>
                        <p>Album description: {album.description}</p>
                        <div>
                            {album && album.Songs.map(song => {
                                return <NavLink className='songNav' to={`/songs/${song.id}`}>
                                    <img className='smallImage' src={song.previewImage} alt={song.title} />
                                    <p className='songP'>{song.title}</p>
                                </NavLink>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    useEffect(() => {
        dispatch(getAllAlbums()).then(() =>
            setIsLoaded(true))

    }, [])
    return (
        <>
            {isLoaded &&
                content
            }
        </>
    )
}






export default AlbumProfile;
