/**
 * Centralized popup utility to handle window.open with consistent error handling
 * @param {string} url - The URL to open
 * @param {string} fallbackMessage - Message to speak if popup is blocked
 * @param {Function} speak - The speak function to use for error messages
 * @returns {boolean} - Returns true if popup was successful, false if blocked
 */
export const openPopup = (url, fallbackMessage, speak) => {
  try {
    const popup = window.open(url, '_blank');

    // Check if popup was blocked
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      console.log("Popup was blocked by browser");
      if (speak && fallbackMessage) {
        speak(fallbackMessage);
      }
      return false;
    } else {
      console.log("Popup opened successfully");
      return true;
    }
  } catch (error) {
    console.error("Error opening popup:", error);
    if (speak) {
      speak("Sorry, I couldn't open that application right now. Please try again.");
    }
    return false;
  }
};

/**
 * Check if popups are likely to be blocked
 * @returns {boolean} - Returns true if popups might be blocked
 */
export const isPopupBlocked = () => {
  const testPopup = window.open('about:blank', '_blank', 'width=1,height=1');
  if (testPopup) {
    testPopup.close();
    return false;
  }
  return true;
};
