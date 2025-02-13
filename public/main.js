const connection = new BareMux.BareMuxConnection("/baremux/worker.js")
const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";

// Set default transport on page load
window.addEventListener('load', async () => {
    if (!await connection.getTransport()) {
        await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
    }
    // Load Google by default
    navigateToUrl("https://www.google.com");
});

const loadingScreen = document.getElementById('loadingScreen');
const iframe = document.getElementById('iframeWindow');
const urlInput = document.getElementById('urlInput');

// Navigation button handlers
document.getElementById('backButton').onclick = () => {
    if (iframe.contentWindow.history.length > 0) {
        iframe.contentWindow.history.back();
    }
};

document.getElementById('forwardButton').onclick = () => {
    if (iframe.contentWindow.history.length > 0) {
        iframe.contentWindow.history.forward();
    }
};

document.getElementById('refreshButton').onclick = () => {
    iframe.contentWindow.location.reload();
};

document.getElementById('homeButton').onclick = () => {
    navigateToUrl("https://www.google.com");
};

// Show loading screen when iframe starts loading
function showLoading() {
    loadingScreen.style.display = 'flex';
}

// Hide loading screen when iframe finishes loading
function hideLoading() {
    loadingScreen.style.display = 'none';
}

// Function to handle navigation
function navigateToUrl(url) {
    showLoading();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }
    iframeWindow.src = __uv$config.prefix + __uv$config.encodeUrl(url);
}

// Add iframe load event listeners
iframe.addEventListener('loadstart', showLoading);
iframe.addEventListener('load', hideLoading);

document
    .getElementById("urlInput")
    .addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("searchButton").click();
        }
    });

document.getElementById("searchButton").onclick = async function (event) {
    event.preventDefault();
    
    let url = urlInput.value;
    let searchUrl = "https://www.google.com/search?q=";

    if (!url.includes(".")) {
        url = searchUrl + encodeURIComponent(url);
    }
    
    navigateToUrl(url);
};