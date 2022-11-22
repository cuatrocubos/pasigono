(() => {
  // ../pasigono/pasigono/custom_scripts/pos_scripts/pos_mettler_toledo.js
  var port;
  var textEncoder;
  var weight = 0;
  var weightLoop = false;
  var portConnected = false;
  var reader;
  onmessage = function(message) {
    if (message.data.command == "connect") {
      connectPort();
    } else if (message.data.command == "start") {
      console.log("Start called");
      weightLoop = true;
      startWeight();
    } else if (message.data.command == "stop") {
      weightLoop = false;
    }
  };
  async function connectPort() {
    var portFound = false;
    var ports = await navigator.serial.getPorts();
    textEncoder = new TextEncoderStream();
    if (ports.length > 0) {
      port = ports[0];
      var stop = false;
      try {
        await port.open({ baudRate: 9600, dataBits: 7, parity: "even", stopBits: 1 });
        textEncoder.readable.pipeTo(port.writable);
        reader = port.readable.getReader();
        portConnected = true;
      } catch (error) {
      }
    }
  }
  async function startWeight() {
    if (portConnected) {
      console.log("Port connected");
      try {
        var strWeight = "";
        await sendCommand("W");
      } catch (error) {
      }
      while (port.readable) {
        if (!weightLoop) {
          break;
        }
        try {
          while (true) {
            if (!weightLoop) {
              break;
            }
            const { value, done } = await reader.read();
            if (done) {
            }
            if (value) {
              var [response, completed] = await decodeData(value);
              if (!completed) {
                strWeight.concat(response);
              } else {
                if (strWeight == "") {
                  strWeight = response;
                } else {
                  strWeight.concat(response);
                }
                var newWeight = parseFloat(strWeight);
                console.log({ "new weight": newWeight });
                if (newWeight != weight && !isNaN(newWeight)) {
                  weight = newWeight;
                  postMessage({
                    "message": "weight",
                    "weight": weight
                  });
                }
                setTimeout(async function() {
                  strWeight = "";
                  await sendCommand("W");
                }, 500);
              }
            }
          }
        } catch (error) {
          console.log(error.message);
        } finally {
        }
      }
    } else {
    }
  }
  async function sendCommand(command) {
    try {
      var writer = textEncoder.writable.getWriter();
      await writer.write(command);
      writer.releaseLock();
    } catch (error) {
      console.log(error.message);
    }
  }
  async function decodeData(data) {
    var str = "";
    var completed = false;
    for (var i = 0; i < data.byteLength; i++) {
      if (data[i] != 2) {
        if (data[i] == 13) {
          completed = true;
        } else {
          str = str.concat(String.fromCharCode(data[i]));
        }
      }
    }
    return [str, completed];
  }
})();
//# sourceMappingURL=pos-mettler-toledo.bundle.DKYPWMUL.js.map
