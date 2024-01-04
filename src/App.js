import ReactPlayer from 'react-player'
import './App.css';
import goal1 from './videos/goal1.mp4'
import goal2 from './videos/goal2.mp4'
import goal3 from './videos/goal3.mp4'
import goal4 from './videos/goal4.mp4'
import miss1 from './videos/miss1.mp4'
import miss2 from './videos/miss2.mp4'
import miss3 from './videos/miss3.mp4'
import {useEffect, useState} from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const VIDEOS = [
  {
    video: goal1,
    timeToStop: 4,
    goal: true
  },
  {
    video: goal2,
    timeToStop: 1.5,
    goal: true
  },
  {
    video: goal3,
    timeToStop: 2,
    goal: true
  },
  {
    video: goal4,
    timeToStop: 3,
    goal: true
  },
  {
    video: miss1,
    timeToStop: 1.4,
    goal: false
  },
  {
    video: miss2,
    timeToStop: 2,
    goal: false
  },
  {
    video: miss3,
    timeToStop: 2,
    goal: false
  },
]

const randomVideos = VIDEOS.sort(() => Math.random() - 0.5)
function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [open, setOpen] = useState(false);
  const [counter, setCounter] = useState(0);
  const [step, setStep] = useState(0)
  const [isShowedModal, setIsShowedModal] = useState(false)
  const [isClickCTAButton, setIsClickSTAButton] = useState(false)

  const leaveFromPage = () => {
    !isClickCTAButton && window.gtag('event', 'open_prelending', {
      'isLeaveFromPage': true, step
    })
  }

  useEffect(() => {
    window.addEventListener("beforeunload", leaveFromPage);
    window.gtag('event', 'open_prelending')

    return () => window.removeEventListener("beforeunload", leaveFromPage);
  }, [])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const checkGoal = (predict) => {
    if(predict === randomVideos[step].goal) {
      setCounter((count) => count + 1)
    }

    handleClose()
    setIsPlaying(true)
  }

  const isFinished = step === randomVideos.length

  const finishContent = () => {
    if(counter <= randomVideos.length && counter >= 5) {
      return <h1 className='title-text'>Seu sucesso é impressionante! Agora, você pode ganhar dinheiro facilmente junto com o seu time favorito. Clique no link e comece a ganhar agora mesmo com um bônus de R$30000!</h1>
    }
    if(counter < 5 && counter >= 3) {
      return <h1 className='title-text'>Você quase chegou lá, mas sua intuição no futebol está indo muito bem. Clique no link, junte-se ao seu time favorito, e com um bônus de R$30000, você terá sorte e a oportunidade de ganhar bem!</h1>
    }

    return <h1 className='title-text'>Parece que você precisa de um pouco mais de sorte no futebol. Mas não se preocupe, o amor pelo seu time pode mudar tudo! Siga o link e, com um bônus de R$30000, sua sorte vai mudar na próxima vez!</h1>
  }

  const openOffer = () => {
    !isClickCTAButton && window.gtag('event', 'open_prelending', {
      step, isFinished
    })
    setIsClickSTAButton(true)
    window.open('https://l8quo.bemobtrcks.com/click', '_blank')
  }

  const finishButton = (
    <Button
      variant="contained"
      {...(isFinished && { size: "large", color: "success" })}
      onClick={openOffer}
    >
      Receber o bônus
    </Button>
  )

  return (
    <div className="App">
      <div className="container">
        {
          !isFinished && (
            <>
              <h1 className='title-text'>Teste sua sagacidade no futebol, adivinhe se haverá gol.</h1>
              <div className='ramka-5'>
                <ReactPlayer
                  url={randomVideos[step]?.video}
                  playing={isPlaying}
                  width={'500px'}
                  height={'auto'}
                  muted={true}
                  controls={true}
                  onProgress={(state) => {
                    if(state.playedSeconds >= randomVideos[step]?.timeToStop && !isShowedModal) {
                      setIsPlaying(false)
                      handleOpen()
                      setIsShowedModal(true)
                    }
                  }}
                  onEnded={() => {
                    setStep((value) => value + 1)
                    setIsShowedModal(false)
                  }}
                />
              </div>
            </>
          )
        }
        {
          isFinished && (
            <div>
              { finishContent() }
              { finishButton }
            </div>
          )
        }
        <h1 className='counter'>placar: {counter} / {randomVideos.length}</h1>
      </div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Haverá gol?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Button onClick={() => checkGoal(true)}>Sim</Button>
            <Button onClick={() => checkGoal(false)}>Não</Button>
            { finishButton }
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default App;
