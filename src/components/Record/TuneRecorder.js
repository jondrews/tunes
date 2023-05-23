import { useEffect, useState } from "react"
import "./TuneRecorder.css"

export default function TuneRecorder() {
  const [deviceList, setDeviceList] = useState([])

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      devices.forEach((device) => {
        if (device.kind === "audioinput") {
          setDeviceList((oldList) => [...oldList, device])
        }
      })
    })
  }, [])

  return (
    <div>
      TuneRecorder
      <select id="inputdevices">
        {deviceList.map((device, idx) => {
          return <option key={idx} value={device.deviceId}>([{idx}]{device.deviceId}): {device.label}</option>
        })}
      </select>
    </div>
  )
}
