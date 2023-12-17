import { useEffect, useRef, useState } from 'react';

import { Html5QrcodeScanType, Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';

import CameraComponent from '../photo';
import styles from './index.module.scss';

const formatsToSupport = [Html5QrcodeSupportedFormats.QR_CODE];

const Home = () => {
  const [scanState, setScanState] = useState(false);

  const scanner = useRef<Html5QrcodeScanner | null>(null);

  const onScanSuccess = (decodedText, decodedResult) => {
    // handle the scanned code as you like, for example:
    setScanState(true);
    console.log(`Code matched = ${decodedText}`, decodedResult);
    scanner.current?.clear();
  };

  const onScanFailure = (error) => {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  };

  useEffect(() => {
    if (document.getElementById('reader') && !scanner.current?.getState()) {
      scanner.current = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          formatsToSupport: formatsToSupport,
        },
        /* verbose= */ false,
      );
      if (scanner.current) {
        scanner.current.render(onScanSuccess, onScanFailure);
      }
    }
  }, []);

  return <div className={styles.content}>{scanState ? <CameraComponent /> : <div id="reader" />}</div>;
};

export default Home;
