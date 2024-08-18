const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const offerTextarea = document.getElementById('offer');
const answerTextarea = document.getElementById('answer');
const startButton = document.getElementById('startButton');
const submitAnswerButton = document.getElementById('submitAnswer');

const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
});

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(stream => {
    localVideo.srcObject = stream;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  })
  .catch(error => console.error('Error accessing media devices.', error));

peerConnection.ontrack = event => {
  remoteVideo.srcObject = event.streams[0];
};

peerConnection.onicecandidate = event => {
  if (event.candidate) {
    console.log('New ICE candidate:', JSON.stringify(event.candidate));
  }
};

// オファーを生成してテキストエリアに表示
startButton.addEventListener('click', async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  offerTextarea.value = JSON.stringify(offer);
});

// 受信したオファーを処理し、アンサーを生成
submitAnswerButton.addEventListener('click', async () => {
  const offer = JSON.parse(offerTextarea.value);
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  answerTextarea.value = JSON.stringify(answer);
});
