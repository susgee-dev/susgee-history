# Susgee History
Susgee History is a simple web tool for reading recent messages from a Twitch channel. It leverages the [recent-messages API](https://recent-messages.robotty.de/api) to display channel chat history in a more readable format.

## Key Features
- Fetch recent Twitch channel messages
- Clean and easy-to-read interface
- No message storage - uses live API data
- Lightweight and straightforward
- **NEW**: Support for custom message providers and limits
- **NEW**: Advanced options for power users

## Prerequisites
- Node.js (version 18 or later)
- npm (Node Package Manager)

## Installation
### 1. Clone the Repository
``` bash
git clone https://github.com/susgee-dev/susgee-history.git
cd susgee-history
```
### 2. Install Dependencies
``` bash
npm install
```
### 3. Run the Development Server
``` bash
npm run dev
```
The application will be available at (or the port specified in your configuration) `http://localhost:3000`

## Usage
1. Open the application
2. Enter a Twitch channel name
3. View recent chat messages in a clean, readable format

### Advanced Usage
You can customize the message provider and limit using URL parameters:

#### URL Format
```
https://history.susgee.dev/[channel]?provider=[provider-url]&limit=[message-count]
```

#### Examples
- Default usage: `https://history.susgee.dev/forsen`
- Custom provider: `https://history.susgee.dev/forsen?provider=https://recent-messages.zneix.eu/api/v2/recent-messages/`
- Custom limit: `https://history.susgee.dev/forsen?limit=10`
- Both: `https://history.susgee.dev/forsen?provider=https://recent-messages.zneix.eu/api/v2/recent-messages/&limit=100`

#### Advanced Options in UI
1. Click "Show Advanced Options" on the search page
2. Enter a custom provider URL (optional)
3. Set a custom message limit (1-1,000, optional)
4. Submit to load messages with your custom settings

#### Supported Providers
- Default: `https://recent-messages.robotty.de/api/v2/recent-messages/`
- Alternative: `https://recent-messages.zneix.eu/api/v2/recent-messages/`
- Any other compatible recent-messages API endpoint

## Technologies
- Next.js
- React
- [Twitch Recent Messages API](https://recent-messages.robotty.de/api)

## Contributing
1. Fork the repository
2. Create your feature branch () `git checkout -b feature/AmazingFeature`
3. Commit your changes () `git commit -m 'Add some AmazingFeature'`
4. Push to the branch () `git push origin feature/AmazingFeature`
5. Open a Pull Request

## License
Completely free to use for anyone. No restrictions.

## Disclaimer
This project is not affiliated with Twitch. It uses the publicly available recent-messages API.

## Special Thanks
- [Robotty Recent Messages API](https://recent-messages.robotty.de/api) for providing the chat message retrieval service
