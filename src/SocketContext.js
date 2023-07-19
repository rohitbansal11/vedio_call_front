import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
const SocketContext = createContext();

const socket = io('https://vedio-call-app.onrender.com/');
// const socket = io('http://localhost:5050/');


const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [callToid, setCallToId] = useState()
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [Name, setName] = useState('');
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const [audioHook, setAudioHook] = useState(true)
    const [moveCamera, setMovecamera] = useState(false)
    const [facingMode, setFacingMode] = useState('user');
    //video: { facingMode: front ? "user" : "environment" },
    useEffect(() => {

        navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
            }
        }).then(currentStream => {
            setStream(currentStream);
            myVideo.current.srcObject = currentStream;
            // if (connectionRef.current && callAccepted) {
            //     const videoTrack = stream.getVideoTracks()[0];
            //     connectionRef.current.peer.addTrack(videoTrack, currentStream);
            // }

            console.log(connectionRef.current.peer.streams)

            if (connectionRef.current && callAccepted) {
                connectionRef.current.peer.replaceTrack(
                    stream.getVideoTracks()[0],
                    currentStream.getVideoTracks()[0],
                    stream
                );
            }
        });

        socket.on('me', (id) => setMe(id));

        socket.on('calluser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal });
        });

    }, [facingMode]);



    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream: stream });

        peer.on('signal', (data) => {
            socket.emit('answercall', { signal: data, to: call.from });
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        connectionRef.current = {
            peer,
            localStream: stream,
        };

        // stream.getTracks().forEach((track) => {
        //     connectionRef.current.peer.addTrack(track, stream);
        // });
        peer.signal(call.signal);


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

        connectionRef.current = { peer };
        connectionRef.current.localStream = stream;

    }

    const leaveCall = () => {
        setCallEnded(true);

        connectionRef.current.destroy();

        window.location.reload();
    }

    const muteMe = (data) => {
        const audioTrack = stream.getAudioTracks()[0];
        if (data) {
            audioTrack.enabled = true;
        } else {
            audioTrack.enabled = false;
        }
    }

    // Switch between front and back cameras
    const flipCamera = () => {
        const videoTracks = stream.getVideoTracks();
        videoTracks.forEach((track) => {
            track.stop();
        });

        setFacingMode((prevFacingMode) =>
            prevFacingMode === 'environment' ? 'user' : 'environment'
        );
    };



    const stopcamera = (data) => {
        const vedioTrack = stream.getVideoTracks()[0];
        if (data) {
            vedioTrack.enabled = true;
        } else {
            vedioTrack.enabled = false;
        }

    }

    return (
        <SocketContext.Provider value={{ call, setCallToId, flipCamera, stopcamera, callAccepted, callEnded, stream, myVideo, userVideo, Name, setName, me, callUser, leaveCall, muteMe, answerCall }}>
            {children}
        </SocketContext.Provider>
    );
}

export { ContextProvider, SocketContext };










