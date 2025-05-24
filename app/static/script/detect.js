
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const captureBtn = document.getElementById("captureBtn");
  const capturedImage = document.getElementById("capturedImage");
  const outputImage = document.getElementById("output-image");
  const uploadArea = document.getElementById("upload-area");
  const inputImage = document.getElementById("inputImage");

  let stream = null;

  // Open Camera and Hide Upload Area
  function openCamera() {
    uploadArea.style.display = "none";
    outputImage.style.display = "none";

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        stream = mediaStream;
        video.srcObject = mediaStream;
        video.style.display = "block";
        captureBtn.style.display = "inline-block";
        video.play();
      })
      .catch((err) => {
        alert("Camera access denied or not available.");
        console.error(err);
      });
        document.getElementById("uploadTab").classList.remove("active");
  document.getElementById("cameraTab").classList.add("active");
  }

  // Stop Camera
  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    video.style.display = "none";
    captureBtn.style.display = "none";
  }

  // Switch to Upload Mode
  function showUpload() {
    stopCamera();
    uploadArea.style.display = "block";
    outputImage.style.display = "none";
    inputImage.value = ""; // Reset file input
      document.getElementById("uploadTab").classList.add("active");
  document.getElementById("cameraTab").classList.remove("active");
  }

  // Capture Image from Camera and Resize/Compress
  function captureImage() {
    const context = canvas.getContext("2d");

    // Set max dimensions
    const maxWidth = 640;
    const maxHeight = 480;

    let width = video.videoWidth;
    let height = video.videoHeight;

    // Maintain aspect ratio
    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }

    canvas.width = width;
    canvas.height = height;

    context.drawImage(video, 0, 0, width, height);

    // Convert to JPEG Base64 (70% quality)
    const dataURL = canvas.toDataURL("image/jpeg", 0.7);
    capturedImage.value = dataURL;

    // Show preview
    outputImage.src = dataURL;
    outputImage.style.display = "block";

    stopCamera(); // Stop camera after capture

    // Alert size
    const sizeInKB = (getBase64ImageSize(dataURL) / 1024).toFixed(2);
    alert(`Image captured successfully! Size: ${sizeInKB} KB`);
  }

  // Preview Uploaded Image
  function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
      outputImage.src = reader.result;
      outputImage.style.display = "block";
    };
    reader.readAsDataURL(file);
  }

  // Get size of base64 image string in bytes
  function getBase64ImageSize(base64String) {
    const base64 = base64String.split(",")[1];
    const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
    const base64Length = base64.length;
    return (base64Length * 3) / 4 - padding;
  }
// Get Location
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
         
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // alert("Location access granted. Coordinates:", lat, lon);

          // document.getElementById("latitude").value = lat;
          // document.getElementById("longitude").value = lon;

          fetchLocationName(lat, lon);
        },
        function (error) {
          console.error("Geolocation error:", error.message);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  }

   async function fetchLocationName(lat, lon) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      const address = data.address;
    //   alert("aaaaaaa",address)
    // alert("village: " + address.village
    //     + "\n town: " + address.town
    //     + "\n suburb: " + address.suburb
    //     + "\n city: " + address.city
    //     + "\n county: " + address.county
    //     + "\n state: " + address.state
    //     + "\n country: " + address.country
    // );
      // Safely access relevant fields
      const village = address.village || address.town || address.suburb || "";
      const city = address.city || address.county || "";
      const state = address.state || "";
      const country = address.country || "";

      // Combine and clean
      const locationParts = [village, city, state, country].filter(Boolean);
      const locationName = locationParts.join(", ");

      // Assign to hidden field
      document.getElementById("location").value = locationName;
      // alert("Detected Location: " + locationName);
    } catch (err) {
      console.error("Error fetching location name:", err);
    }
  }

  window.onload = getLocation;