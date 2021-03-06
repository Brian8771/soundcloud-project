import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as songActions from '../../store/Songs';
import './edit.css'


function EditSong({song, songId, setEdit}) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(song[songId].songs.title);
    const [description, setDescription] = useState(song[songId].songs.description);
    const [url, setUrl] = useState(song[songId].songs.url)
    const [previewImage, setPreviewImage] = useState(song[songId].songs.previewImage);
    const [errors, setErrors] = useState([]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        const song = {

            title,
            description,
            url,
            previewImage,
        }
        await dispatch(songActions.editSong(songId, song));
        await dispatch(songActions.getSongByIdNum(songId));
        await setEdit(false);
    }

    useEffect(() => {
        const newErrors = []

        if (url && !url.endsWith('.wav')) newErrors.push('Song must end with .wav');
        if (previewImage && !previewImage.endsWith('.jpg')) newErrors.push('If adding image it must be .jpg')
        setErrors(newErrors)
    }, [url, previewImage])

    return (
        <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#ECECEC', height: '100vh', width: '100%', flexDirection: 'column', alignItems: 'center', position: 'relative', bottom: '20px'}}>
        <div style={{backgroundColor: 'white', width: '80%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', width: '100%', height: '100vh', justifyContent: 'start', alignItems: 'center'}}>
            <h2 style={{display: 'flex', justifyContent: 'center', alignItems: 'start'}}>Edit Song</h2>
            <ul>
                {errors && errors.map(error =>
                <li key={error}>{error}</li>
                )}
                </ul>
            <label className='labelEdit'>Title:
            </label>
                <input
                className='inputEdit'
                name='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type='text'
                required={true}
                />
            <label className='labelEdit'>Description:
            </label>
                <input
                className='inputEdit'
                name='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type='text'
                />
            <label className='labelEdit'>Url:
            </label>
                <input
                className='inputEdit'
                name='url'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                type='text'
                required={true}
                />
            <label className='labelEdit'>ImageUrl:
            </label>
                <input
                className='inputEdit'
                name='imageUrl'
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value === '' ? '' : e.target.value)}
                type='text'
                />
            <button disabled={errors.length > 0 ? true : false} className='editSongButton' type='submit'>Upload</button>

        </form>
        </div>
        </div>
    )
}

export default EditSong;
