import React, { useEffect, useRef, useState } from 'react';

import { Button } from 'antd';

import { CameraOutlined, SyncOutlined } from '@ant-design/icons';

import styles from './photo.module.scss';

const CameraComponent = () => {
  const cameraVideoRef = useRef(null);
  const [imgSrc, setImgSrc] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [mediaDevice, setMediaDevice] = useState<MediaDeviceInfo[]>([]);

  function successFunc(mediaStream: MediaStream) {
    const video = cameraVideoRef.current;
    // 旧的浏览器可能没有srcObject
    if ('srcObject' in video) {
      video.srcObject = mediaStream;
    }
    video.onloadedmetadata = () => video.play();
  }

  function errorFunc(err: Error) {
    console.log(`${err.name}: ${err.message}`);
    // always check for errors at the end.
  }

  // 启动摄像头
  const openMedia = (device) => {
    console.log('device', device);

    const opt = {
      audio: false,
      video: { width: window.innerWidth, height: window.innerHeight, exact: device.deviceId },
    };
    const index = mediaDevice.findIndex((i) => i.deviceId === device.deviceId);
    setActiveIndex(index);
    navigator.mediaDevices.getUserMedia(opt).then(successFunc).catch(errorFunc);
  };

  // 关闭摄像头
  const closeMedia = () => {
    const video = cameraVideoRef.current;
    const stream = video.srcObject;
    if ('getTracks' in stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
  };

  const toggleCamera = () => {
    let currentIndex = activeIndex === mediaDevice.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(currentIndex);
    openMedia(mediaDevice[currentIndex]);
  };

  const initMediaDevice = () => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevice = devices.filter((i) => i.kind === 'videoinput');
        openMedia(videoDevice[0], 0);
        setMediaDevice(videoDevice);
      })
      .catch(() => setMediaDevice([]));
  };

  const takePhoto = async () => {
    const video = cameraVideoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = 750;
    canvas.height = 1334;
    const ctx = canvas.getContext('2d');
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    await ctx.drawImage(video, 0, 0, 750, 1334); // 把视频中的一帧在canvas画布里面绘制出来
    closeMedia(); // 获取到图片之后可以自动关闭摄像头
    setImgSrc(canvas.toDataURL());
  };

  const retake = () => {
    openMedia(mediaDevice[0]);
    setImgSrc('');
  };

  useEffect(() => {
    initMediaDevice();
  }, []);

  return (
    <div>
      {imgSrc ? (
        <img id="imgTag" src={imgSrc} className={styles.photo} />
      ) : (
        <video id="cameraVideo" ref={cameraVideoRef} className={styles.camera} />
      )}
      <div className={styles.footer}>
        {imgSrc ? (
          <Button onClick={retake}>重拍</Button>
        ) : (
          <>
            <div className={styles.toggleBtn} onClick={toggleCamera}>
              <SyncOutlined style={{ fontSize: '20px', color: 'white' }} />
            </div>
            <div className={styles.takeBtn} onClick={takePhoto}>
              <CameraOutlined style={{ fontSize: '30px', color: 'white' }} />
            </div>
            <div className={styles.toggleBtn} style={{ visibility: 'hidden' }}>
              <SyncOutlined style={{ fontSize: '20px', color: 'white' }} />
            </div>
          </>
        )}
      </div>

      <button onClick={closeMedia}>关闭摄像头</button>
    </div>
  );
};

export default CameraComponent;
