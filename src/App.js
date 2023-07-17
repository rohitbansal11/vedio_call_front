import { AppBar, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import './App.css';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import Options from './components/Options/Options';
import Notification from './components/Notification/Notification';
import Testfile from './components/teste/Testfile'

// const useStyles = makeStyles((theme) => ({
//   appBar: {
//     // [theme.breakpoints.down('xs')]: {
//     //   width: '90%',
//     // },
//   },

//   image: {
//     marginLeft: '15px',
//   },
// }));

function App() {
  // const classes = useStyles();

  return (

    <>
      <Notification />

      <Testfile />
      {/* Video Palyer */}
      {/* <VideoPlayer /> */}

      {/* Options Component */}
      <div className='app_options'>
        <Options>
          {/* Notification Component */}
        </Options>
      </div>
    </>
  );
}

export default App;
