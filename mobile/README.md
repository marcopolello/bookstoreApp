# YouTube Trimmer App

This is a React Native application that allows users to input a YouTube link for any music video and provides an interface to trim a segment of the video with sound.

## Features

- Input a YouTube video link.
- Play and pause the video.
- Select start and end times for trimming.
- Execute the trim operation to create a segment of the video.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd youtube-trimmer-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```

2. Open the app on your mobile device or emulator.

3. Input a valid YouTube video link on the Home Screen.

4. Navigate to the Trim Screen to select the segment you want to trim.

## Components

- **VideoPlayer**: Handles video playback using `react-native-video`.
- **TrimControls**: Provides UI for trimming the video.
- **InputLink**: Allows users to input and validate YouTube links.

## Utilities

- **videoUtils**: Contains utility functions for video operations and interfacing with the YouTube API.

## Contributing

Feel free to submit issues or pull requests for improvements and bug fixes.

## License

This project is licensed under the MIT License.