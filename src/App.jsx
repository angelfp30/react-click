import { useEffect, useState } from 'react'

const FollowMouse = () => {
  const [enabled, setEnabled] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clickCount, setClickCount] = useState(0)
  const [clickerStyle, setClickerStyle] = useState({})
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)


  // pointer move
  useEffect(() => {
    console.log('effect ', { enabled })

    const handleMove = (event) => {
      const { clientX, clientY } = event
      setPosition({ x: clientX, y: clientY })
    }

    if (enabled) {
      window.addEventListener('pointermove', handleMove)
    }

    // cleanup:
    // -> cuando el componente se desmonta
    // -> cuando cambian las dependencias, antes de ejecutar
    //    el efecto de nuevo
    return () => { // cleanup method
      console.log('cleanup')
      window.removeEventListener('pointermove', handleMove)
    }
  }, [enabled])

  // [] -> solo se ejecuta una vez cuando se monta el componente
  // [enabled] -> se ejecuta cuando cambia enabled y cuando se monta el componente
  // undefined -> se ejecuta cada vez que se renderiza el componente

  // change body className
  useEffect(() => {
    document.body.classList.toggle('no-cursor', enabled)

    return () => {
      document.body.classList.remove('no-cursor')
    }
  }, [enabled])

  
  //click counter
  const handleClick = () => {
    setClickCount(clickCount + 1);
    console.log(clickCount);

    setClickerStyle({
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      border: '1px solid #fff',
      borderRadius: '30%',
      opacity: 0.8,
      fontSize: '0.9rem',
      color: '#fff',
      left: `${Math.floor(Math.random() * 1301)}px`,
      top: `${Math.floor(Math.random() * 520)}px`
    })
  }

  useEffect(() => {
    let intervalId
    if (isRunning) {
      intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }  else {
      clearInterval(intervalId)
    }
    return () => clearInterval(intervalId);
  }, [isRunning]); 
/*
  const toggleTimer = () => {
    setIsRunning(isRunning => !isRunning)
  }*/

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return ( 
    <>
    
      <div style={{
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid #fff',
        borderRadius: '50%',
        opacity: 0.8,
        pointerEvents: 'none',
        left: -10,
        top: -10,
        width: 25,
        height: 25,
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      />
      <div className='score'>
        Score: {clickCount}
      </div>
      <button onClick={() => {
        setEnabled(!enabled)
        setIsRunning(!isRunning)
      }}>
        {enabled ? 'Pausar' : 'Empezar'} juego
      </button>

      <div className='clicker' onClick={
          enabled ? handleClick : ''
        } 
        style={clickerStyle}>
         Click
      </div>
      <div className="timer">
        {formatTime(seconds)}
      </div>
    </>
  )
}

function App () {
  return (
    <main>
      <FollowMouse />
    </main>
  )
}

export default App