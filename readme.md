<p><img width="400" src="https://scontent-sin6-1.xx.fbcdn.net/v/t1.0-9/27337338_2005560616139356_8635670197888099331_n.jpg?oh=445c791911f0bc4069cfcfddd2103af2&oe=5B1BEECB"/ alt="hayati bot"></p>
nik hayatinya probolinggo_dev

## Requirements
Before installing this project, you have to setup your environment with following requrements:
- git [download and install git](https://git-scm.com/)
- `node@8.9.4`
we recommend you to install node using nvm: [download and install nvm](https://github.com/creationix/nvm)
- `yarn@1.3.2` [download and install yarn](https://yarnpkg.com/en/)

## Installation
```bash
$ git clone https://github.com/probolinggo-dev/hayati-bot.git
$ cd hayati-bot
$ yarn install
```

Before running this project, first you have to create telegram bot for your own then add your bot token into `.env` file, yaa I know that `.env` file doesn't exist yet, so create it and you can see `.env.example` as an example.

### Generate token
[create telegram bot](https://core.telegram.org/bots)

[generate newsapi token](https://newsapi.org/register)

now you're ready to make an impact
```bash
$ yarn start
```

## License

  [MIT](LICENSE)
