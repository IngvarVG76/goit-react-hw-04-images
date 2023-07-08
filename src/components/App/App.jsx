import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Loader from 'components/Loader/Loader';
import Modal from 'components/Modal/Modal';
import fetchImages from 'services/api';
import Button from 'components/Button/Button';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [totalHits, setTotalHits] = useState(0);
  const [page, setPage] = useState(1);

  const fetchImagesData = useCallback(async () => {
    setIsLoading(true);

    try {
      const { hits, totalHits } = await fetchImages(searchQuery, page);

      if (hits.length === 0) {
        toast.warn('No results found');
      }

      setImages(prevImages => [...prevImages, ...hits]);
      setTotalHits(totalHits);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, page]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      return;
    }
    fetchImagesData();
  }, [searchQuery, page, fetchImagesData]);

  const handleSearch = query => {
    setSearchQuery(query);
    setImages([]);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleImageClick = image => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <div>
      <Searchbar onSubmit={handleSearch} />

      <ImageGallery images={images} onImageClick={handleImageClick} />

      {isLoading && <Loader />}
      {images.length < totalHits && (
        <Button onClick={handleLoadMore}>Load More</Button>
      )}
      {modalIsOpen && <Modal image={selectedImage} onClose={closeModal} />}

      <ToastContainer />
    </div>
  );
};

export default App;
