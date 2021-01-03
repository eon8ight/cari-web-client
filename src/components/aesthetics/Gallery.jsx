import React, { useState } from 'react';

import axios from 'axios';
import {
  Classes,
  Dialog,
  Intent,
  Spinner,
} from '@blueprintjs/core';

import { truncate } from 'lodash/string';

import Paginator from '../common/Paginator';

import { API_ROUTE_AESTHETIC_FIND_GALLERY_CONTENT } from '../../functions/constants';

import styles from './styles/Gallery.module.scss';

const TRUNCATE_OPTS = { length: 80 };

const Gallery = props => {
  const [currentPage, setCurrentPage] = useState(0);
  const [galleryModalBlock, setGalleryModalBlock] = useState(null);
  const [galleryData, setGalleryData] = useState(props.aesthetic.galleryContent.contents);

  const handlePageChange = data => {
    setCurrentPage(data.selected);
    setGalleryData(null);

    axios.get(`${API_ROUTE_AESTHETIC_FIND_GALLERY_CONTENT}/${props.aesthetic.aesthetic}?page=${data.selected + 1}`)
      .then(res => setGalleryData(res.data.contents))
      .catch(err => props.addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER));
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
      <div className={Classes.DIALOG_BODY}>
        <a href={galleryModalBlock.image.original.url} target="_blank" rel="noopener noreferrer">
          <img alt={galleryModalBlock.description} src={galleryModalBlock.image.display.url} />
        </a>
      </div>
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
      <Dialog className={styles.modal} isOpen={galleryModalBlock !== null}
        title={galleryModalBlock && truncate(galleryModalBlock.title, TRUNCATE_OPTS)}
        onClose={() => setGalleryModalBlock(null)}>
        {galleryModalContent}
      </Dialog>
    </>
  );
}

export default Gallery;