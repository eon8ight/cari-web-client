import React, { useState } from 'react';
import Modal from 'react-modal';

import axios from 'axios';
import { Spinner } from '@blueprintjs/core';

import Paginator from '../common/Paginator';

import { API_ROUTE_AESTHETIC_FIND_GALLERY_CONTENT } from '../../functions/constants';

import styles from './styles/Gallery.module.scss';

const Gallery = props => {
  const [currentPage, setCurrentPage] = useState(0);
  const [galleryModalBlock, setGalleryModalBlock] = useState(null);
  const [galleryData, setGalleryData] = useState(props.aesthetic.galleryContent.contents);

  const handlePageChange = data => {
    setCurrentPage(data.selected);
    setGalleryData(null);

    axios.get(`${API_ROUTE_AESTHETIC_FIND_GALLERY_CONTENT}/${props.aesthetic.aesthetic}?page=${data.selected + 1}`)
      .then(res => setGalleryData(res.data.contents));
  };

  if(!galleryData) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  const galleryContent = galleryData.filter(block => block.image !== null).map(block => {
    return (
      <div className={styles.image} key={block.id}>
        <img src={block.image.thumb.url} alt={block.description}
          onClick={() => setGalleryModalBlock(block)} />
      </div>
    );
  });

  let galleryModalContent = null;

  if (galleryModalBlock) {
    galleryModalContent = (
      <>
        <h2>{galleryModalBlock.title}</h2>
        <a href={galleryModalBlock.image.original.url} target="_blank" rel="noopener noreferrer">
          <img src={galleryModalBlock.image.display.url} alt={galleryModalBlock.description} />
        </a>
      </>
    );
  }

  const totalPages = Math.ceil(props.aesthetic.galleryContent.length / 15);

  return (
    <>
      <div className={styles.content}>
        {galleryContent}
      </div>
      {totalPages > 0 && <Paginator currentPage={currentPage} className={styles.paginator}
        pageCount={totalPages} onPageChange={handlePageChange} />}
      <Modal className={styles.modal} overlayClassName={styles.modalOverlay}
        isOpen={galleryModalBlock !== null}
        onRequestClose={() => setGalleryModalBlock(null)}>
        {galleryModalContent}
      </Modal>
    </>
  );
}

export default Gallery;