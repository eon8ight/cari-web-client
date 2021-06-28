import React, { useState } from 'react';

import axios from 'axios';
import {
  Classes,
  Dialog,
  Intent,
  Spinner,
} from '@blueprintjs/core';
import { decode } from 'he';

import Paginator from '../common/Paginator';

import { ARENA_API_MAX } from '../../functions/constants';

import styles from './styles/Gallery.module.scss';

const BLOCK_CLASS_ATTACHMENT = 'Attachment';
const BLOCK_CLASS_IMAGE = 'Image';
const BLOCK_CLASS_MEDIA = 'Media';

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

  const galleryContent = galleryData.contents.map(block => {
    switch (block.class) {
      case BLOCK_CLASS_IMAGE:
      case BLOCK_CLASS_MEDIA:
        return (
          <div className={styles.imageContainer} key={block.id}>
            <img src={block.image.square.url} alt={block.description} className={styles.image}
              height={300} width={300} onClick={() => setGalleryModalBlock(block)} />
          </div>
        );
      case BLOCK_CLASS_ATTACHMENT:
        return (
          <div className={styles.blockPreview} key={block.id}
            onClick={() => setGalleryModalBlock(block)}>
            <h3>
              No Preview
              <br />
              ({block.attachment.content_type})
            </h3>
          </div>
        );
      default:
        return null;
    }
  }).filter(blockElem => blockElem !== null);

  let galleryModalContent = null;

  if (galleryModalBlock) {
    switch (galleryModalBlock.class) {
      case BLOCK_CLASS_IMAGE:
        galleryModalContent = (
          <a href={galleryModalBlock.image.original.url} target="_blank" rel="noopener noreferrer">
            <img alt={galleryModalBlock.description} src={galleryModalBlock.image.display.url} width={600} />
          </a>
        );

        break;
      case BLOCK_CLASS_ATTACHMENT:
        switch (galleryModalBlock.attachment.content_type.split('/')[0]) {
          case 'video':
            galleryModalContent = (
              <video autoplay controls muted>
                <source src={galleryModalBlock.attachment.url} />
                Your browser does not support video playback.
              </video>
            );

            break;
          default:
            galleryModalContent = 'This file type is not yet supported.';
            break;
        }

        break;
      case BLOCK_CLASS_MEDIA:
        const embedHtml = decode(galleryModalBlock.embed.html);
        galleryModalContent = <div dangerouslySetInnerHTML={{ __html: embedHtml }}></div>;
        break;
      default:
        galleryModalContent = 'This file type is not yet supported.';
        break;
    }

    galleryModalContent = (
      <div className={Classes.DIALOG_BODY}>
        {galleryModalContent}
      </div>
    );
  }

  let paginator = null;
  const totalPages = Math.ceil(galleryData.length / ARENA_API_MAX);

  if (totalPages > 0) {
    paginator = (
      <Paginator currentPage={currentPage} className={styles.paginator}
        pageCount={totalPages} onPageChange={handlePageChange} />
    );
  }

  return (
    <>
      {paginator}
      <div className={styles.content}>
        {galleryContent}
      </div>
      <Dialog className={styles.modal} isOpen={galleryModalBlock !== null}
        onClose={() => setGalleryModalBlock(null)}>
        {galleryModalContent}
      </Dialog>
      {paginator}
    </>
  );
}

export default Gallery;