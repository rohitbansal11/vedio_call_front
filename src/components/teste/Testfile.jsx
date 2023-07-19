import React, { useContext, useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { SocketContext } from '../../SocketContext';
import './testcs.css';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import { BrowserView, MobileView } from 'react-device-detect';
import Webcam from "react-webcam";
const VideoPlayer = () => {
    const hdh = 'https://i.postimg.cc/521rVkhD/image.png'
    const [micHook, setMicHook] = useState(true)
    const [cameraHook, setcameraHook] = useState(false)
    const [hideCamera, setHidecamear] = useState(true)


    const { call, flipCamera, callAccepted, callEnded, stream, myVideo, userVideo, Name, muteMe, stopcamera } = useContext(SocketContext);

    return (
        <>

            <div class="header">

                <div class="container">
                    <div class="row">
                        <div class="col-2">
                            {
                                stream && (
                                    <>
                                        {/* {
                                            !hideCamera ?
                                                <img src={hdh} class="host-img video"/> :
                                                <video playsInline ref={myVideo} autoPlay class="host-img video" />

                                        } */}
                                        <video playsInline ref={myVideo} autoPlay class="host-img video" />



                                        <div class="contarols">

                                            <span style={{
                                                cursor: 'pointer',
                                                margin: '10px'
                                            }} onClick={() => {
                                                setMicHook(!micHook)
                                                muteMe(!micHook)
                                            }} >{micHook ? <MicNoneOutlinedIcon sx={{ fontSize: 40 }} /> : <MicOffOutlinedIcon sx={{ fontSize: 40 }} />}</span>
                                            <MobileView>
                                                <span style={{
                                                    cursor: 'pointer',
                                                    margin: '10px'
                                                }} onClick={() => {
                                                    setcameraHook(!cameraHook)
                                                    flipCamera(!cameraHook)
                                                }} ><FlipCameraAndroidIcon /></span>
                                            </MobileView>



                                            <span style={{
                                                cursor: 'pointer',
                                                margin: '10px'
                                            }} onClick={() => {
                                                stopcamera(!hideCamera)
                                                setHidecamear(!hideCamera)

                                            }} >{hideCamera ? <VideocamOutlinedIcon sx={{ fontSize: 40 }} /> : <VideocamOffOutlinedIcon sx={{ fontSize: 40 }} />}</span>

                                        </div>
                                    </>
                                )
                            }

                        </div>
                        <div class="col-2">

                            {
                                callAccepted && !callEnded && (
                                    <video playsInline ref={userVideo} autoPlay className='video' />


                                )
                            }


                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VideoPlayer;