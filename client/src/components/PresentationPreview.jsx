import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import generateNonInteractiveElement from '../generateNonInteractiveElement';

import arrowLeftIcon from '../assets/arrow_left_icon.svg';
import arrowRightIcon from '../assets/arrow_right_icon.svg';
import editIcon from '../assets/edit_icon.svg';
import playIcon from '../assets/play_icon.svg';
import trashIcon from '../assets/trash_icon.svg';

function PresentationPreview({ presentations, selectedPresentationIndex, setSelectedPresentationIndex, user, setUser }) {
  const [viewingSlideIndex, setViewingSlideIndex] = useState(0);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const navigate = useNavigate();

  // Parse the presentation into JSON, and store it in selectedPresentation
  useEffect(() => {
    setSelectedPresentation({ ...presentations[selectedPresentationIndex], data: JSON.parse(presentations[selectedPresentationIndex].data) });
    setViewingSlideIndex(0);
  }, [presentations, selectedPresentationIndex]);

  function handleChangeViewingSlide(direction) {
    if (direction === 'prev') {
      setViewingSlideIndex(viewingSlideIndex - 1);
    } else if (direction === 'next') {
      setViewingSlideIndex(viewingSlideIndex + 1);
    }
  }

  function handleStartEdit() {
    navigate(`/edit/${selectedPresentation._id}`, {state: {presentation: selectedPresentation, sentAt: Date.now()}});
  }

  function handleStartPresent() {
    navigate(`/present/${selectedPresentation._id}`, {state: {presentation: selectedPresentation, sentAt: Date.now()}});
  }

  async function handleDelete() {
    await fetch(`/api/user/${localStorage.getItem('id')}/presentation/${presentations[selectedPresentationIndex]._id}`, { method: 'DELETE', headers: { 'content-type': 'application/json', 'x-access-token': localStorage.getItem('token') }, body: JSON.stringify({}) });
    
    setSelectedPresentationIndex(0);
    setIsDeleteModal(false);

    const presentationsAfterDelete = structuredClone(presentations);
    presentationsAfterDelete.splice(selectedPresentationIndex, 1);
    setUser({...user, presentations: presentationsAfterDelete});
  }

  return (
    <>
      {selectedPresentation && (
        <div className="PresentationPreview">
          <div style={selectedPresentation.data.presentationOptions}>
            {selectedPresentation.data.slides[viewingSlideIndex].map((element, index) => generateNonInteractiveElement(element, index))}
          </div>
          <div>
            <div onClick={handleStartEdit}><img src={editIcon} /></div>
            <div onClick={handleStartPresent}><img src={playIcon} /></div>
            <div onClick={() => setIsDeleteModal(true)} className={presentations.length === 1 ? 'disabled' : ''}><img src={trashIcon} /></div>
            <div onClick={() => handleChangeViewingSlide('prev')} className={viewingSlideIndex === 0 ? 'disabled' : ''}><img src={arrowLeftIcon} /></div>
            <div onClick={() => handleChangeViewingSlide('next')} className={viewingSlideIndex === selectedPresentation.data.slides.length - 1 ? 'disabled' : ''}><img src={arrowRightIcon} /></div>
            <span>{presentations[selectedPresentationIndex].title}</span>
          </div>
        </div>
      )}
      {isDeleteModal && (
        <div className='modal' onClick={() => setIsDeleteModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <p>Are you sure about deleting {presentations[selectedPresentationIndex].title}?</p>
            <button onClick={handleDelete}>Yes</button>
            <button onClick={() => setIsDeleteModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  )
}

export default PresentationPreview;
