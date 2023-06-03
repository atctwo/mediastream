 
# Media Stream

This is a web tool for viewing media streams from user devices (like USB webcams and capture cards) and displays (like windows or full windows).  The intention was to create a tool that can be used to view a full-screen feed of a capture card, but it can be used for lots of other things!


A live version of the tool is available at https://atctwo.net/projects/mediastream

# How it works

The UI of the tool uses [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/getting-started/introduction/).  Media device access is acheived using the [Media Capture and Streams API](https://w3c.github.io/mediacapture-main/).  To get a feed of user devices like webcams, the [`getUserMedia()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) method is used, and to get display feeds, [`getDisplayMedia()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) is used.