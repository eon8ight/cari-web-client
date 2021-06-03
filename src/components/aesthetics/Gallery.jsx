import React, { useState } from 'react';

import axios from 'axios';
import {
  Classes,
  Dialog,
  Intent,
  Spinner,
} from '@blueprintjs/core';

import Paginator from '../common/Paginator';

import { ARENA_API_MAX } from '../../functions/constants';

import styles from './styles/Gallery.module.scss';

const Gallery = props => {
  const addMessage = props.addMessage;
  const mediaSourceUrl = props.aesthetic.mediaSourceUrl;

  const [currentPage, setCurrentPage] = useState(0);
  const [galleryModalBlock, setGalleryModalBlock] = useState(null);
  const [galleryData, setGalleryData] = useState(props.initialContent);

  if (galleryData === null) {
    return <Spinner size={Spinner.SIZE_LARGE} />;
  }

  const handlePageChange = data => {
    setCurrentPage(data.selected);
    setGalleryData(null);

    axios.get(`${mediaSourceUrl}?page=${data.selected + 1}&per=${ARENA_API_MAX}`)
      .then(res => setGalleryData(res.data))
      .catch(err => addMessage(`A server error occurred: ${err.response.data.message}`, Intent.DANGER));
  };

  console.log(galleryData);

  const galleryContent = galleryData.contents.filter(block => block.image !== null).map(block => {
    return (
      <div className={styles.image} key={block.id}>
        <img src={block.image.square.url} alt={block.description} width={300}
          onClick={() => setGalleryModalBlock(block)} />
      </div>
    );
  });

  let galleryModalContent = null;

  if (galleryModalBlock) {
    galleryModalContent = (
      <div className={Classes.DIALOG_BODY}>
        <a href={galleryModalBlock.image.original.url} target="_blank" rel="noopener noreferrer">
          <img alt={galleryModalBlock.description} src={galleryModalBlock.image.display.url} width={600} />
        </a>
      </div>
    );
  }

  const totalPages = Math.ceil(galleryData.length / ARENA_API_MAX);

  return (
    <>
      {totalPages > 0 && <Paginator currentPage={currentPage} className={styles.paginator}
        pageCount={totalPages} onPageChange={handlePageChange} />}
      <div className={styles.content}>
        {galleryContent}
      </div>
      <Dialog className={styles.modal} isOpen={galleryModalBlock !== null}
        onClose={() => setGalleryModalBlock(null)}>
        {galleryModalContent}
      </Dialog>
    </>
  );
}

export default Gallery;