import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './EditListing.css'
import { ListingsContext } from '../../context/ListingContext'
import { Helmet } from 'react-helmet'

const EditListing = () => {

    const { fetchToEditData, editListing, handleEditChange, handleImageEditChange, handleUpdateSubmit, previewImg } = useContext(ListingsContext);
    const { id } = useParams();

    useEffect(() => {
        fetchToEditData(id);
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault()
        handleUpdateSubmit(id);
    }

    return (
        <div className='edit-listing'>

            <Helmet>
                <title>Edit Listing | stayEasy</title>
                <meta name="description" content="Update your property details, images, and pricing on StayEasy." />
            </Helmet>
            <div className="edit-listing-content">
                <h3>Edit your Listing...</h3>

                <form className="edit-listing-form" encType="multipart/form-data" onSubmit={handleSubmit}>

                    <div className='input-field'>
                        <label htmlFor="title">Title :</label>
                        <input type="text" name="title" value={editListing?.title || ''} onChange={handleEditChange} id="title" />
                    </div>

                    <div className='input-field'>
                        <label htmlFor="description">Description :</label>
                        <textarea name="description" value={editListing?.description || ''} onChange={handleEditChange} id="description" rows='5'></textarea>
                    </div>

                    <div className="prevImg-container">
                        {previewImg ? (
                            <img src={previewImg} alt="Preview" />
                        ) : (
                            <img src={editListing?.image?.url} alt="Previous Image" />
                        )}
                    </div>

                    <div className='input-field'>
                        <label htmlFor="image">Upload Listing Image :</label>
                        <input type="file" name="image" onChange={handleImageEditChange} id="image" />
                    </div>

                    <div className="combined-fields">
                        <div className='input-field'>
                            <label htmlFor="price">Price :</label>
                            <input name="price" value={editListing?.price || ''} onChange={handleEditChange} id="price" />
                        </div>

                        <div className='input-field'>
                            <label htmlFor="country">Country :</label>
                            <input type="text" name="country" value={editListing?.country || ''} onChange={handleEditChange} id="country" />
                        </div>
                    </div>

                    <div className='input-field'>
                        <label htmlFor="location">Location :</label>
                        <input type="text" name="location" value={editListing?.location || ''} onChange={handleEditChange} id="location" />
                    </div>

                    <button type='submit'>Edit Listing</button>
                </form>
            </div>
        </div>

    );
}

export default EditListing;

