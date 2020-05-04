# ME Monitor

Features include
* Restart ME server after a certain period of time
* Restart ME server if it has stopped
* Send a message to the server warning of a server restart

## Prerequisites

[Node.js](https://nodejs.org/en/) >= 12

Create a .env file in your project directory and setup environment variables
.env.example contains the used variable names

```
SERVICE_NAME:             Your Medieval Engineers server windows service name
REMOTE_API_URL:           URL to access your Medieval Engineers Remote API
API_KEY:                  Medieval Engineers Remote API Key
DISCORD_WEBHOOK_ID:       Your Discord webhook ID
DISCORD_WEBHOOK_TOKEN:    Your Discord webhook token
```

## Install

Clone the repository

`git clone git@github.com:13Tim37/ME-Monitor.git`

Set up environment variables

Install packages

`npm install`

Run the application

`npm run start`

Or run the application in dev mode with

`npm run start:dev`
