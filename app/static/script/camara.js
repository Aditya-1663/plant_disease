const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const captureBtn = document.getElementById('captureBtn');
  const capturedImage = document.getElementById('capturedImage');
  const outputImage = document.getElementById('output-image');

  function openCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        video.style.display = 'block';
        captureBtn.style.display = 'inline-block';
      })
      .catch(err => {
        alert("Camera access denied or not available.");
        console.error(err);
      });
  }

  function captureImage() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');
    capturedImage.value = dataURL;
    outputImage.src = dataURL;
    outputImage.style.display = 'block';
    video.style.display = 'none';
    captureBtn.style.display = 'none';

    // Stop camera after capture
    video.srcObject.getTracks().forEach(track => track.stop());
  }

  function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
      outputImage.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
  }