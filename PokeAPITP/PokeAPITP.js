#!/usr/bin/env node
import axios from 'axios';
import inquirer from 'inquirer';

async function getPokemonData(pokemonName) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data for ${pokemonName}. Please make sure the name is correct.`);
        return null;
    }
}

async function getMoveData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching move data.');
        return null;
    }
}

class Player {
    constructor(pokemonData) {
        this.name = pokemonData.name;
        this.hp = 300;
        this.moves = [];
    }

    async setMoves(availableMoves) {
        const movePromises = availableMoves.slice(0, 5).map(async (move) => {
            const moveData = await getMoveData(move.move.url);
            return {
                name: moveData.name,
                power: moveData.power || 0,
                accuracy: moveData.accuracy || 100,
                pp: moveData.pp || 0,
            };
        });

        const fetchedMoves = await Promise.all(movePromises);
        this.moves = fetchedMoves.filter((move) => move.power > 0);
    }

    performMove(moveIndex, opponent) {
        const move = this.moves[moveIndex];

        if (move.pp <= 0) {
            console.log(`${this.name} tried to use ${move.name}, but it's out of PP.`);
            return false;
        }

        move.pp--;

        const hitChance = Math.random() * 100;
        if (hitChance > move.accuracy) {
            console.log(`${this.name} missed the attack ${move.name}.`);
            return false;
        }

        opponent.hp -= move.power;
        if (opponent.hp < 0) opponent.hp = 0;

        console.log(`${this.name} uses ${move.name} and deals ${move.power} damage to ${opponent.name}.`);

        return true;
    }

    isAlive() {
        return this.hp > 0;
    }
}

function botChooseMove(player) {
    return Math.floor(Math.random() * player.moves.length);
}

async function playGame(playerPokemonName) {
    const playerPokemonData = await getPokemonData(playerPokemonName);
    const botPokemonData = await getPokemonData('pikachu');

    if (!playerPokemonData || !botPokemonData) {
        console.log("Error fetching Pokémon data. Please try again.");
        return;
    }

    const player = new Player(playerPokemonData);
    const bot = new Player(botPokemonData);

    console.log(`A wild ${bot.name} appeared!`);
    console.log(`Go, ${player.name}!\n`);

    await Promise.all([player.setMoves(playerPokemonData.moves), bot.setMoves(botPokemonData.moves)]);

    while (player.isAlive() && bot.isAlive()) {
        const choices = player.moves.map((move, index) => ({
            name: `${move.name} (PP: ${move.pp}, Power: ${move.power}, Accuracy: ${move.accuracy}%)`,
            value: index,
        }));

        const { playerMoveIndex } = await inquirer.prompt([
            {
                type: 'list',
                name: 'playerMoveIndex',
                message: 'Choose an attack:',
                choices,
            },
        ]);

        player.performMove(playerMoveIndex, bot);

        if (!bot.isAlive()) {
            console.log(`\n${bot.name} fainted! You won! 🎉`);
            break;
        }

        const botMoveIndex = botChooseMove(bot);
        bot.performMove(botMoveIndex, player);

        if (!player.isAlive()) {
            console.log(`\n${player.name} fainted! You lost. 😞`);
            break;
        }

        console.log(`\n${player.name}: ${player.hp} HP remaining.`);
        console.log(`${bot.name}: ${bot.hp} HP remaining.\n`);
    }
}

async function startGame() {
    const { playerPokemonName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'playerPokemonName',
            message: 'Choose your Pokémon: ',
        },
    ]);

    playGame(playerPokemonName);
}

startGame();
