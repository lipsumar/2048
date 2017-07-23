# 2048 Genetic

> Make bots play 2048 until they figure out the best fixed sequence of keys to win

## Install

1. Clone the repo, `cd` into it
2. `npm install`
3. set env var "CLOUDANT_PW": `export CLOUDANT_PW='thepassword'`

## Usage

```bash
node genetic-evolution.js --name <database_name> --config <config> [--popsize <population-size>] [--games <number-of-games>]
```

**Options**:
* `name`: the cloudant database name. Will be created automatically, must not exist;
* `config`: config name. Should be the name of a js file in `configs/`
* `popsize`: population size (optional, default 10)
* `games`: number of games to play for each bot (optional, default 10)


A [cloudant](https://cloudant.com) database will be created.

## Todo
* serialize config
* pause/resume
