function findTodaysColordleColorWithNativeDates() {
  console.log("Attempting to find today's Colordle color using native Date objects...");

  fetch('https://colordle.ryantanen.com/colors.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json(); // Parses the JSON response
    })
    .then(data => {
      const allColors = data.colors;
      console.log('Successfully fetched the list of all possible colors. Count:', allColors.length);

      // Define the start date: August 7, 2023
      // JavaScript months are 0-indexed (0 for January, 7 for August)
      const startDate = new Date(2023, 7, 7); // Year, Month (0-11), Day
      // It's important to set the time to the beginning of the day for consistent day diff calculation
      startDate.setHours(0, 0, 0, 0);


      const today = new Date(); // Gets the current date and time
      // Also set today's time to the beginning of the day for fair comparison
      today.setHours(0, 0, 0, 0);


      // Calculate the difference in milliseconds
      const diffInMilliseconds = today.getTime() - startDate.getTime();

      // Convert milliseconds to days (1 day = 24 * 60 * 60 * 1000 milliseconds)
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const daysPassed = Math.floor(diffInMilliseconds / millisecondsPerDay);

      const colorIndex = daysPassed;

      // For logging and verification:
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      console.log('Game start date:', startDate.toLocaleDateString(undefined, options));
      console.log('Today\'s date:', today.toLocaleDateString(undefined, options));
      console.log('Days passed since start date:', daysPassed);
      console.log('Calculated index for today\'s color:', colorIndex);

      if (colorIndex >= 0 && colorIndex < allColors.length) {
        const todaysCorrectColor = allColors[colorIndex];
        console.log('----------------------------------------------------');
        console.log("TODAY'S (May 8, 2025) CORRECT COLORDLE COLOR IS:", todaysCorrectColor);
        console.log('----------------------------------------------------');
        alert("Today's Colordle color is: " + todaysCorrectColor);
      } else {
        console.error('Error: Calculated color index (' + colorIndex + ') is out of bounds. Total colors available:', allColors.length);
        alert('Error: Calculated color index is out of bounds. Check console.');
      }
    })
    .catch(error => {
      console.error('Failed to fetch colors.json or determine today\'s color:', error);
      alert('An error occurred. Check the console for details.');
    });
}

findTodaysColordleColorWithNativeDates();
