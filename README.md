# Susgee History

Susgee History is a simple web tool for reading recent messages from a Twitch channel. It leverages
the [recent-messages API](https://recent-messages.robotty.de/api) to display channel chat history in a more readable
format.

## Key Features

- Fetch recent Twitch channel messages
- Clean and easy-to-read interface
- No message storage - uses live API data
- Lightweight and straightforward
- **NEW**: Support for custom message providers and limits
- **NEW**: Advanced options for power users
- **NEW**: Reverse order of messages
- **NEW**: Support for direct logs URLs

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

You can customize the message provider, channel, limit, and more using URL parameters:

#### URL Format

```
https://history.susgee.dev/?c=[channel]&provider=[provider-url]&limit=[message-count]&reverse&url=[direct-logs-url]
```

#### Parameters

- `c`: The channel name (e.g., `forsen`)
- `provider`: A custom provider URL (e.g., `https://recent-messages.zneix.eu/api/v2/recent-messages/`)
- `limit`: Maximum number of messages to fetch (e.g., `100`)
- `reverse`: Include this parameter to show oldest messages first
- `url`: A direct logs URL (e.g., `https://logs.susgee.dev/channel/channelname/user/username/2025/7`)

#### Priority

- If `c` (channel) parameter is set, it will use the default or specified provider with that channel
- If `c` is not set but `url` is set, it will fetch logs directly from the URL
- If neither `c` nor `url` is set, it will display the search form

#### Examples

- Default usage: `https://history.susgee.dev/?c=forsen`
- Custom provider:
  `https://history.susgee.dev/?c=forsen&provider=https://recent-messages.zneix.eu/api/v2/recent-messages/`
- Custom limit: `https://history.susgee.dev/?c=forsen&limit=10`
- Reverse order: `https://history.susgee.dev/?c=forsen&reverse`
- Direct logs URL: `https://history.susgee.dev/?url=https://logs.susgee.dev/channel/channelname/user/username/2025/7`
- Combined options:
  `https://history.susgee.dev/?c=forsen&provider=https://recent-messages.zneix.eu/api/v2/recent-messages/&limit=1000&reverse`

> Note: The old URL format (`/[channel]?provider=...`) will still work and will be automatically redirected to the new
> format with the root path.

#### Advanced Options in UI

1. Click "Show Advanced Options" on the search page
2. Select a provider from the dropdown or choose "Direct Logs URL" for direct log URLs
3. Enter a custom provider URL or direct logs URL (if applicable)
4. Set a custom message limit (e.g. 10000, optional)
5. Reverse the order of messages (optional)
6. Submit to load messages with your custom settings

#### Supported Providers

- Robotty (default): `https://recent-messages.robotty.de/api/v2/recent-messages/`
- Zneix: `https://recent-messages.zneix.eu/api/v2/recent-messages/`
- Zonian: `https://logs.zonian.dev/rm/`
- Direct Logs URL: Any URL that provides raw IRC data (e.g.,
  `https://logs.susgee.dev/channel/channelname/user/username/2025/7`)
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
