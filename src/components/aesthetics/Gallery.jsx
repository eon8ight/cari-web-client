import React, { useState } from 'react';
import Modal from 'react-modal';
import ReactPaginate from 'react-paginate';

import axios from 'axios';

const GALLERY_MODAL_STYLES = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  }
};

export default (props) => {
  const [ galleryModalBlock, setGalleryModalBlock ] = useState(null);
  const [ galleryData, setGalleryData ] = useState(props.aesthetic.galleryContent.contents);

  const handlePageChange = (data) => {
    axios.get(`${process.env.REACT_APP_API_URL}/aesthetic/findGalleryContent/${props.aesthetic.aesthetic}?page=${data.selected + 1}`)
      .then(res => setGalleryData(res.data.contents));
  };

  const galleryContent = galleryData.map(block => {
    return (
      <div className="gallery-image" key={block.id}>
        <img src={block.image.thumb.url} alt={block.description}
             onClick={() => setGalleryModalBlock(block)} />
      </div>
    );
  });

  let galleryModalContent = null;

  if(galleryModalBlock) {
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
      <div id="galleryContainer">
        {galleryContent}
      </div>
      <ReactPaginate pageCount={totalPages} pageRangeDisplayed={5} marginPagesDisplayed={2}
                     onPageChange={handlePageChange} initialPage={0}
                     disableInitialCallback={true} />
      <Modal isOpen={galleryModalBlock !== null} onRequestClose={() => setGalleryModalBlock(null)}
             style={GALLERY_MODAL_STYLES}>
        {galleryModalContent}
      </Modal>
    </>
  );
}
