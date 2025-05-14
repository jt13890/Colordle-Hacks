/**
 * Vigenere Cipher Decoder
 * This function decodes a ciphertext using a given key and alphabet.
 * It's based on the likely behavior of the 'vigeneren' library used by Colordle.
 * @param {string} ciphertext The text to decode.
 * @param {string} key The Vigenere key.
 * @returns {string} The decoded plaintext.
 */
function vigenereDecode(ciphertext, key) {
    // The alphabet used by the 'vigeneren' library (based on its source or common Vigenere implementations)
    const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789"; // Assuming this is the correct alphabet
    let decodedText = "";
    const keyLength = key.length;
    const alphabetLength = alphabet.length;

    for (let i = 0; i < ciphertext.length; i++) {
        const ciphertextCharOriginal = ciphertext[i];
        const ciphertextChar = ciphertextCharOriginal.toLowerCase(); // Process in lowercase
        const keyChar = key[i % keyLength].toLowerCase(); // Key is also processed in lowercase

        const ciphertextIndex = alphabet.indexOf(ciphertextChar);
        const keyIndex = alphabet.indexOf(keyChar);

        if (ciphertextIndex === -1) {
            decodedText += ciphertextCharOriginal; // Append original if char not in alphabet
            continue;
        }

        if (keyIndex === -1) {
            console.error("Error: Key character '" + keyChar + "' not found in alphabet. Check VIGENERE_KEY and alphabet definition.");
            return "Error: Invalid key character";
        }

        let decodedCharIndex = (ciphertextIndex - keyIndex + alphabetLength) % alphabetLength;
        decodedText += alphabet[decodedCharIndex];
    }
    return decodedText;
}

/**
 * Finds the color for the normal daily Colordle challenge.
 */
function findNormalModeColor() {
    console.log("Attempting to find today's Normal Mode Colordle color...");

    fetch('https://colordle.ryantanen.com/colors.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const allColors = data.colors;
            console.log('Successfully fetched the list of all possible colors for Normal Mode. Count:', allColors.length);

            const startDate = new Date(2023, 7, 7); // August 7, 2023 (JS months are 0-indexed)
            startDate.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const diffInMilliseconds = today.getTime() - startDate.getTime();
            const millisecondsPerDay = 24 * 60 * 60 * 1000;
            const daysPassed = Math.floor(diffInMilliseconds / millisecondsPerDay);
            const colorIndex = daysPassed;

            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            console.log('Game start date (for normal mode):', startDate.toLocaleDateString(undefined, options));
            console.log('Current date:', today.toLocaleDateString(undefined, options));
            console.log('Days passed since start date:', daysPassed);
            console.log('Calculated index for today\'s color:', colorIndex);

            if (colorIndex >= 0 && colorIndex < allColors.length) {
                const todaysCorrectColor = allColors[colorIndex];
                const successMsg = `NORMAL MODE Colordle color for ${today.toLocaleDateString(undefined, options)} IS: ${todaysCorrectColor}`;
                console.log('----------------------------------------------------');
                console.log(successMsg);
                console.log('----------------------------------------------------');
                alert(successMsg);
            } else {
                const errorMsg = `Error: Calculated color index (${colorIndex}) for Normal Mode is out of bounds. Total colors available: ${allColors.length}`;
                console.error(errorMsg);
                alert(errorMsg);
            }
        })
        .catch(error => {
            const errorMsg = 'Failed to fetch colors.json or determine today\'s Normal Mode color:';
            console.error(errorMsg, error);
            alert(errorMsg + "\n" + error.message + "\nCheck console for details.");
        });
}

/**
 * Finds and decodes the Colordle Friend Challenge color from the URL.
 */
function findFriendChallengeColor() {
    console.log("Attempting to find Friend Challenge color...");

    const params = new URLSearchParams(window.location.search);
    const encodedColor = params.get("c");

    if (!encodedColor) {
        const msg = "No 'c' parameter found in the URL. This doesn't seem to be a Colordle friend challenge link, or the parameter is missing.";
        console.log(msg);
        alert(msg);
        return;
    }

    console.log("Encoded color parameter ('c') from URL:", encodedColor);

    const VIGENERE_KEY = "q2wedrfghjklkjnb"; // Key used by Colordle
    let decodedColorName = "";

    console.log("Using custom Vigenère decoder implementation for Friend Challenge.");
    decodedColorName = vigenereDecode(encodedColor, VIGENERE_KEY);

    if (decodedColorName && !decodedColorName.startsWith("Error:")) {
        const successMsg = "Decoded Friend Challenge Color Name: " + decodedColorName;
        console.log("----------------------------------------------------");
        console.log("DECODED FRIEND CHALLENGE COLOR NAME IS:", decodedColorName);
        console.log("----------------------------------------------------");
        alert(successMsg); // MODIFIED LINE: Removed the note from the alert.
    } else {
        const errorMsg = "Failed to decode the Friend Challenge color name from parameter: " + encodedColor;
        console.error(errorMsg, "Decoded attempt:", decodedColorName);
        alert(errorMsg + "\nCheck console for more details.");
    }
}

/**
 * Main function to ask user for mode and then find the color.
 */
function getColordleSecretColor() {
    const choice = prompt("Which Colordle mode's color do you want to find?\n1. Normal Mode (Daily Color)\n2. Friend Challenge Mode\n\nEnter 1 or 2:");

    if (choice === "1") {
        findNormalModeColor();
    } else if (choice === "2") {
        // Ensure you are on a friend challenge URL before running this.
        if (!window.location.search.includes("c=")) {
             alert("You chose Friend Challenge Mode, but your current URL doesn't seem to have a '?c=...' parameter. Please navigate to the friend challenge link first.");
             console.log("Friend challenge mode selected, but no 'c' parameter in URL.");
             return;
        }
        findFriendChallengeColor();
    } else if (choice === null) {
        console.log("User cancelled the prompt.");
    } else {
        alert("Invalid choice. Please enter 1 or 2.");
        console.log("Invalid choice made by user:", choice);
    }
}

// Execute the main function
// Make sure you are on a Colordle page (colordle.ryantanen.com)
// If choosing Friend Challenge Mode, ensure the URL has the ?c=... parameter.
getColordleSecretColor();
