import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import QRCode from "qrcode";
import axios from "axios";

function App() {
  const [qrimage, setQrImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    try {
      const request = await axios.post(
        "http://localhost:8000/api/payment/create"
      );
      const response = await request.data;

      setMessage(response.message);

      QRCode.toDataURL(response.url)
        .then((url) => {
          console.log(url);
          setQrImage(url);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {}
  };

  return (
    <>
      <div>
        <h1>test-solana-pay</h1>
        <span>{message}</span>
        <button onClick={handleClick}>Solana Payment</button>

        {qrimage && <img src={qrimage}></img>}
      </div>
    </>
  );
}

export default App;
