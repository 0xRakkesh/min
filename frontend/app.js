const form = document.getElementById("shorten-form");
const targetUrlInput = document.getElementById("target-url");
const submitBtn = document.getElementById("submit-btn");
const resultBox = document.getElementById("result-box");
const shortLink = document.getElementById("short-link");
const copyBtn = document.getElementById("copy-btn");
const errorBox = document.getElementById("error-box");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  errorBox.classList.add("hidden");
  resultBox.classList.add("hidden");
  
  const longUrl = targetUrlInput.value.trim();
  if (!longUrl) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Shortening...";

  try {
    const response = await fetch("/shortner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ target_url: longUrl })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || "Failed to shorten URL.");
    }

    // Handles both JSON response { "short_url": "..." } and plain string "http://..."
    const rawData = await response.text();
    let finalUrl = "";
    try {
      const parsed = JSON.parse(rawData);
      finalUrl = typeof parsed === "string" ? parsed : (parsed.short_url || rawData);
    } catch {
      finalUrl = rawData.replace(/"/g, "");
    }

    shortLink.href = finalUrl;
    shortLink.textContent = finalUrl;
    resultBox.classList.remove("hidden");

  } catch (err) {
    errorBox.textContent = err.message || "An unexpected error occurred.";
    errorBox.classList.remove("hidden");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Shorten";
  }
});

copyBtn.addEventListener("click", async () => {
  const urlToCopy = shortLink.textContent;
  if (!urlToCopy) return;

  try {
    await navigator.clipboard.writeText(urlToCopy);
    copyBtn.textContent = "Copied!";
    copyBtn.classList.add("copied");

    setTimeout(() => {
      copyBtn.textContent = "Copy";
      copyBtn.classList.remove("copied");
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
});

// Analytics / Inspect Link Logic
const statsForm = document.getElementById("stats-form");
const statsIdInput = document.getElementById("stats-id");
const statsBtn = document.getElementById("stats-btn");
const statsResultBox = document.getElementById("stats-result-box");
const statsErrorBox = document.getElementById("stats-error-box");
const statsTargetUrl = document.getElementById("stats-target-url");
const statsClicksCount = document.getElementById("stats-clicks-count");

statsForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  statsErrorBox.classList.add("hidden");
  statsResultBox.classList.add("hidden");

  let rawId = statsIdInput.value.trim();
  if (!rawId) return;

  // Clean input: extract ID if user pasted a full URL or path
  const shortId = rawId.replace(/^https?:\/\/[^/]+\//, "").replace(/^\//, "");

  statsBtn.disabled = true;
  statsBtn.textContent = "Searching...";

  try {
    const response = await fetch(`/analytics/${encodeURIComponent(shortId)}`);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || "Link not found.");
    }

    const data = await response.json();
    statsTargetUrl.href = data.target_url;
    statsTargetUrl.textContent = data.target_url;
    statsClicksCount.textContent = `${data.clicks ?? 0} ${data.clicks === 1 ? "click" : "clicks"}`;

    statsResultBox.classList.remove("hidden");
  } catch (err) {
    statsErrorBox.textContent = err.message || "Could not retrieve stats.";
    statsErrorBox.classList.remove("hidden");
  } finally {
    statsBtn.disabled = false;
    statsBtn.textContent = "Inspect";
  }
});
