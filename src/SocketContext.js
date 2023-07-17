import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('https://vedio-call-app.onrender.com/');
// const socket = io('http://localhost:5050/');


const ContextProvider = ({ children }) => {

    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [Name, setName] = useState('');
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const [audioHook, setAudioHook] = useState(true)
    const [moveCamera, setMovecamera] = useState(true)
    const [restertVedio, setRestartVedio] = useState()
    //video: { facingMode: front ? "user" : "environment" },
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: moveCamera ? 'user' : 'environment'
            },
            audio: true
        }).then(currentStream => {
            setStream(currentStream);
            myVideo.current.srcObject = currentStream;
        });

        socket.on('me', (id) => setMe(id));

        socket.on('calluser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal });
        });
    }, [audioHook, restertVedio]);

    // console.log(me);

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream: stream });

        peer.on('signal', (data) => {
            socket.emit('answercall', { signal: data, to: call.from });
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream: stream });

        peer.on('signal', (data) => {
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name: Name });
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        socket.on('callaccepted', (signal) => {
            setCallAccepted(true);

            peer.signal(signal);
        });

        connectionRef.current = peer;
    }

    const leaveCall = () => {
        setCallEnded(true);

        connectionRef.current.destroy();

        window.location.reload();
    }

    const muteMe = (data) => {
        if(data){
            const audioTrack = stream.getAudioTracks()[0]; 
            audioTrack.enabled = true;
        }else{
            const audioTrack = stream.getAudioTracks()[0]; 
            audioTrack.enabled = false;
        }

        // stream.getTracks().forEach((track) => {
        //     if (track.readyState == 'live' && track.kind === 'audio') {
        //         track.stop();
        //     }
        // });
    }

    const moveCameraFuc = () => {
        setMovecamera(!moveCamera)
    }

    const stopcamera = (data) => {
        if (data) {
            setRestartVedio(Math.random())
        } else {
            stream.getTracks().forEach((track) => {
                if (track.readyState == 'live' && track.kind === 'video') {
                    track.stop();
                }
            });
        }
    }

    return (
        <SocketContext.Provider value={{ call, stopcamera, callAccepted, moveCameraFuc, callEnded, stream, myVideo, userVideo, Name, setName, me, callUser, leaveCall, muteMe, answerCall }}>
            {children}
        </SocketContext.Provider>
    );
}

export { ContextProvider, SocketContext };










