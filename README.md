# 2048 Genetic

> Make bots play 2048 until they figure the best fixed sequence of keys to win

## Install

1. Clone the repo, `cd` into it
2. `npm install`
3. set env var "CLOUDANT_PW": `export CLOUDANT_PW='thepassword'`

## Usage

```bash
node genetic-evolution.js --name <database_name>
```

A [cloudant](https://cloudant.com) database will be created.

## Todo
* serialize config
* pause/resume
