import React, { useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as songActions from '../../store/Songs';
import * as commentActions from '../../store/comments';
import {useHistory, useParams} from 'react-router-dom';
import EditSong from '../editForm';
import './Songprofile.css';


function SongProfile() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [body, setBody] = useState('');
    const [errors, setErrors] = useState('');
    const {songId} = useParams();
    const [editSong, setEditSong] = useState(false);
    const songs = useSelector(state => state.songDetail.currentSong);
    const user = useSelector(state => state.session.user);
    let comment = Object.values(useSelector(state => state.comments));


    const deleteSong = async () => {
        await dispatch(songActions.deleteSong(songId));
        history.push('/');
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        const newComment = await dispatch(commentActions.createComments(songId, body)).catch(async (res) => {
            const data = await res.json();
            console.log(data);
            if (data.message)
            if (data.message === 'Validation Error') {

                setErrors(data.errors);
            }
            else setErrors([data.message]);
        });
        await dispatch(commentActions.getCommentsById(songId))

        if (newComment) {
            setBody('')
            setErrors([]);
        }
    }

    const deleteCommentButton = async (id, songId) => {
        await dispatch(commentActions.deleteComments(id));
        await dispatch(commentActions.getCommentsById(songId));
    }

    let deleteButton;
    let editButton;
        if (user && isLoaded && songs[songId].artist.id === user.id) {
            deleteButton =  <button className='deleteSongButton' onClick={() => deleteSong()}>Delete</button>;

            editButton = <button className='editButton' onClick={() => setEditSong(true)}>Edit</button>;
        }

        let content;
        if (editSong) {
            content =
                <h2><EditSong setEdit={() => setEditSong()} song={songs} songId={songId}/></h2>

        } else {
            if (isLoaded) {

                content =
            <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#ECECEC', height: '100vh', width: '100%', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{backgroundColor: 'white', width: '80%', height: '100%'}}>
            <div className='SongDiv'>
            <img className='img'  src='https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png' alt={songs.description} />
            <h2 className='title'>{songs[songId].songs.title}</h2>
            {/* <h3>{songs[songId].songs.description}</h3> */}
            <h3 className='artist'>{songs[songId].artist.username}</h3>
            {/* <button onClick={() => history.push('/')}>Back</button> */}
            <audio className='audioPlayer' controls>
            <source src='https://beardbarnmusicbucket.s3.amazonaws.com/The+Wild+Horse' type="audio/ogg" />
            </audio>
            {deleteButton}
            {editButton}
            </div>
            <div className='commentsDiv'>
                <form onSubmit={handleSubmit}>
                <ul>
                {errors && errors.map(error =>
                <li key={error}>{error}</li>
                )}
                </ul>
                <label>
                    <input
                    className='commentInput'
                    placeholder='Write a comment'
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    />
                </label>
                <button style={{display:'none'}} type='submit'>Submit</button>
                </form>
                    <h3 style={{display: 'flex', paddingLeft: '110px'}}>{comment.length ? comment.length : 0} comments</h3>
                <ul className='commentBorder'>
                {comment && comment.map(({id, body, userId}) => (

                   <li className='liEle' key={id}>{body} {user && comment && userId === user.id ? <button className='hiddenButton' onClick={() => dispatch(deleteCommentButton(id, songId))} >X</button> : ''}</li>
                ))}
                </ul>
            </div>
            </div>
        </div>
            }
        }

    useEffect(() => {

        dispatch(songActions.getSongByIdNum(songId)).then(() => dispatch(commentActions.getCommentsById(songId))).then(() =>
        setIsLoaded(true))

    }, [dispatch, songId, editSong])

    // useEffect(() => {
    //     const newErrors = []
    //     if (!user) newErrors.push('User must be logged in');
    //     if (!body) newErrors.push('Type comment before submitting');
    //     setErrors(newErrors)
    // }, [user, body])

    return (
        <>
        {isLoaded &&
        content
        }
        </>
    )
}

export default SongProfile;
