import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import generateNonInteractiveElement from '../generateNonInteractiveElement';
let keyboardEventListenerAbortController = new AbortController();

function Present() {
  const [presentation, setPresentation] = useState(null);
  const [showingSlide, setShowingSlide] = useState(0);
  const [isShowingFullScreenButton, setIsShowingFullScreenButton] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { presentationid } = useParams();

  useEffect(() => {
    async function decideIfFetchPresentation() {
      if (location.state?.presentation && location.state?.sentAt + 1000 > Date.now()) {
        document.querySelector('.Present').requestFullscreen();
        setPresentation(location.state.presentation.data);

      } else if (presentationid) {
        setIsShowingFullScreenButton(true);
        const response = await fetch(`/api/user/${localStorage.getItem('id')}/presentation/${presentationid}`, { method: 'GET', headers: { 'content-type': 'application/json', 'x-access-token': localStorage.getItem('token') } });
        const presentation = await response.json();

        if (presentation.invalidToken) {
          console.log(presentation.msg);
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          return navigate('/auth');
        }
        setPresentation(JSON.parse(presentation.data));
      }
    }
    decideIfFetchPresentation();
  }, []);

  // Keyboard shortcut event emitters
  keyboardEventListenerAbortController.abort();
  keyboardEventListenerAbortController = new AbortController();
  document.addEventListener('keydown', handleKeyboardEvents, { signal: keyboardEventListenerAbortController.signal });
  function handleKeyboardEvents(e) {
    if (e.key === 'ArrowLeft') {
      if (showingSlide > 0) {
        setShowingSlide(showingSlide - 1);
      }
    } else if (e.key === 'ArrowRight') {
      if (showingSlide < presentation.slides.length - 1) {
        setShowingSlide(showingSlide + 1);
      }
    }
  }

  // Check when user leaves fullscrean mode, and naviagte back to dashboard
  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      if (!window.screenTop && !window.screenY) {
        navigate('/present/dashboard');
      }
    });
  }, []);

  return (
    <div className="Present">
      {presentation && (
        <div style={presentation.presentationOptions}>
          {presentation.slides[showingSlide].map((element, index) => generateNonInteractiveElement(element, index))}
        </div>
      )}
      {isShowingFullScreenButton && (
        <span onClick={() => {
          document.querySelector('.Present').requestFullscreen();
          setIsShowingFullScreenButton(false);
        }}><br/><br/><br/><br/>Click anywhere to start!</span>
      )}
    </div>
  )
}

export default Present;
