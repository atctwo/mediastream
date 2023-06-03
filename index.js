
const alert_error = "alert-setup-error";
const alert_info  = "alert-setup-info";
function setAlertText(alert_id, text="", error=false)
{
    let alert = document.getElementById(alert_id)
    alert.innerText = text;
    // alert.style.display = display;

    if (error) {
        alert.classList.add("alert-danger");
        alert.classList.remove("alert-info");
    } else {
        alert.classList.remove("alert-danger");
        alert.classList.add("alert-info");
    }
}

function requestPermissions(callback)
{
    // check if media devices is supported
    if (!navigator.mediaDevices) {
        setAlertText(alert_info, "Media Devices aren't supported on this device :/", true);
        return;
    }

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    }).then(mediaStream => {
        callback();
    }).catch(err => {
        console.error("Error getting media stream permissions", err);
        setAlertText(alert_info, `Error getting media stream permissions\n(${err.name} - ${err.message})`, true);
    })
}

function getUserMediaDevices()
{
    // show alert
    setAlertText(alert_info, "Getting list of media devices...  Please wait");

    // get references to select elements
    const setup = document.getElementById("setup-container");
    const video_in = document.getElementById("select-video-src");
    const audio_in = document.getElementById("select-audio-src");

    // request permissions
    requestPermissions(() => {

        // check if media devices is supported
        if (!navigator.mediaDevices) {
            setAlertText(alert_info, "Media Devices aren't supported on this device :/", true);
            return;
        }

        // clear alert
        setAlertText(alert_info, "Got list of devices");

        // remove existing options
        while (video_in.childElementCount > 0) video_in.removeChild(video_in.firstChild);
        while (audio_in.childElementCount > 0) audio_in.removeChild(audio_in.firstChild);

        // add 'none' options
        let opt_none_video = document.createElement("option");
        opt_none_video.innerText = "None";
        opt_none_video.value = "none";
        video_in.appendChild(opt_none_video);

        let opt_none_audio = document.createElement("option");
        opt_none_audio.innerText = "None";
        opt_none_audio.value = "none";
        audio_in.appendChild(opt_none_audio);

        // enumerate devices and populate select elements
        if (!navigator.mediaDevices?.enumerateDevices) {
            console.log("enumerateDevices() not supported.");
        } else {
            // List cameras and microphones.
            navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
                devices.forEach((device) => {
                    //   console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
                    //   console.log(device)

                    let opt = document.createElement("option");
                    opt.innerText = `${device.label}`;
                    opt.value = device.deviceId;
                    
                    switch(device.kind) {
                        case "audioinput":
                            audio_in.appendChild(opt);
                            break;

                        // case "audiooutput":
                        //     audio_out.appendChild(opt);
                        //     break;

                        case "videoinput":
                            video_in.appendChild(opt);
                            break;
                    }
                });
            })
            .catch((err) => {
                console.error(`${err.name}: ${err.message}`);
                setAlertText(alert_info, "Error enumerating devices", true);
            });
        }

    });
}

function requestDeviceStream()
{
    // check if media devices is supported
    if (!navigator.mediaDevices) {
        setAlertText(alert_info, "Media Devices aren't supported on this device :/", true);
        return;
    }

    setAlertText(alert_info, "Setting up device stream...");

    const video_src = document.getElementById("select-video-src").value;
    const audio_src = document.getElementById("select-audio-src").value;

    // Prefer camera resolution nearest to 1280x720.
    const constraints = {};

    if (audio_src == "none" || audio_src == "") {
        constraints.audio = false;
    } else {
        constraints.audio = {
            deviceId: {
                exact: audio_src
            },
            echoCancellation: false,
            autoGainControl: false,
            noiseCancellation: false,
            googEchoCancellation: false,
            googAutoGainControl: false,
            googNoiseSuppression: false,
            googHighpassFilter: false
        };
    }

    if (video_src == "none" || video_src == "") {

        constraints.video = false;

    } else {
        constraints.video = {
            deviceId: {
                exact: video_src
            },
            width: 1920,
            height: 1080
        };
    }

    console.log("getUserMedia constraints", constraints);
    
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((mediaStream) => {
            showStream(mediaStream);
        })
        .catch((err) => {
        // always check for errors at the end.
        console.error(`Error getting device stream\n(${err.name} - ${err.message})`, err);
        console.dir(err);
        setAlertText(alert_info, `Error setting up device stream\n(${err.name} - ${err.message})`, true);
    });
}

function requestDisplayStream()
{
    // check if media devices is supported
    if (!navigator.mediaDevices) {
        setAlertText(alert_info, "Media Devices aren't supported on this device :/", true);
        return;
    }

    setAlertText(alert_info, "Setting up display stream");

    navigator.mediaDevices.getDisplayMedia({})
        .then((mediaStream) => {
            showStream(mediaStream);
        })
        .catch(err => {
            console.error(`Error getting display stream\n(${err.name} - ${err.message})`, err);
            console.dir(err);
            setAlertText(alert_info, `Error setting up device stream\n(${err.name} - ${err.message})`, true);
        })
}

function showStream(stream)
{   
    setAlertText(alert_info, "Got stream!  Now showing...");

    const video = document.getElementById("video");
    const setup = document.getElementById("setup-container");

    video.srcObject = stream;
    video.onloadedmetadata = () => {
        video.play();
        video.style.display = "block";
        setup.style.display = "none";
    };
    window.stream = stream;
}

function requestUrlStream()
{
    let url = document.getElementById("stream-url").value;
    setAlertText(alert_info, "Loading " + url);

    const video = document.getElementById("video");
    const setup = document.getElementById("setup-container");

    video.src = url;
    video.onloadedmetadata = () => {
        setAlertText(alert_info, "URL loaded!  Now playing.");
        video.style.display = "block";
        setup.style.display = "none";
        video.play();
    };
}

function muteAudio()
{
    const video = document.getElementById("video");
    video.muted = !video.muted;
}

function freezeVideo()
{
    const video = document.getElementById("video");
    if (video.paused) video.play();
    else video.pause();
}

function requestPictureInPicture()
{
    const video = document.getElementById("video");
    video.requestPictureInPicture();
}

function toggleDisplay(...elements)
{
    for (const element of elements)
    {
        let setup = document.getElementById(element);
        if (getComputedStyle(setup).display == "none") setup.style.display = "block";
        else setup.style.display = "none";
    }
}

function setStreamObjectFit(object_fit)
{
    const video = document.getElementById("video");
    video.style.objectFit = object_fit;
}

function reqPermissionsIfExpanding()
{
    const collapse = document.getElementById("collapse-video");
    // console.log("collapse", collapse.classList.contains("collapse"))
    // console.log("collapsing", collapse.classList.contains("collapsing"))
    // console.log("show", collapse.classList.contains("show"))

    if (collapse.classList.contains("collapsing")) {
        getUserMediaDevices();
    }
}