import React from "react";
import MatchSorter from "match-sorter";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./index.css";
const Pokemon = require("./pokemon.json");

export const TypeColors = {
  Normal: "#9A9B86",
  Fire: "#FC290D",
  Water: "#2380FF",
  Electric: "#FEC510",
  Grass: "#64C83D",
  Ice: "#52BFFF",
  Fighting: "#AD4031",
  Poison: "#9A3A88",
  Ground: "#D6B03B",
  Flying: "#747FFF",
  Psychic: "#FC3387",
  Bug: "#9AB305",
  Rock: "#AD9C4F",
  Ghost: "#524CB0",
  Dragon: "#6243EE",
  Dark: "#644333",
  Steel: "#9A99AE"
};

export function sortIntStrings(a, b) {
  const na = Number(a);
  const nb = Number(b);
  if (a === "∞") {
    return -1;
  }
  if (b === "∞") {
    return 1;
  }
  if (na === nb) {
    return 0;
  }
  return na < nb ? 1 : -1;
}

export function getPokemon(id) {
  return makeData().filter(p => `${p.pokeid}` === `${id}`)[0];
}

export function makeData() {
  return Pokemon;
}

export function getMove(name) {
  try {
    const moves = require("./moves.json");
    return moves.find(m => m.name === name);
  } catch (e) {
    console.log("error getting move", name, e);
  }
}

export function typeIndicatedString(type, string) {
  return (
    <span>
      <span
        style={{
          color: TypeColors[type],
          transition: "all .3s ease"
        }}
      >
        &#x25cf;
      </span>{" "}
      {string}
    </span>
  );
}

function moveBlock(move, damageStr) {
  return (
    <div style={{ width: "200px" }}>
      {move !== undefined && (
        <div>
          <p style={{ fontWeight: "bold" }}>{move.name}</p>
          <p>{move.category}</p>
          {typeIndicatedString(move.type, move.type)}
          <p>Accuracy: {move.acc}</p>
          <p>Power: {move.pow}</p>
          <p>PP: {move.pp}</p>
          {damageStr !== undefined && damageStr}
          <p style={{ wordWrap: "break-word" }}>{move.effect}</p>
        </div>
      )}
    </div>
  );
}

function getSprite(pokemon) {
  const s = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
    pokemon.pokeid
  }.png`;
  return s;
}

function nameBlock(pokemon) {
  const boldStyle = {
    lineHeight: "96px",
    display: "inline",
    fontWeight: "bold"
  };
  const inlineStyle = {
    lineHeight: "96px",
    display: "inline",
    marginRight: "10px"
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <img src={getSprite(pokemon)} alt={pokemon.name} />
      <div style={{ marginLeft: "10px" }}>
        <p style={{ ...boldStyle, paddingRight: "10px" }}>{pokemon.name}</p>
        <div
          style={{
            paddingRight: "10px",
            display: "inline",
            flexDirection: "row"
          }}
        >
          {typeIndicatedString(pokemon.type1, pokemon.type1)}
          {pokemon.type2 !== "NULL" && (
            <span style={{ marginLeft: "10px" }}>
              {pokemon.type2 !== "NULL" &&
                typeIndicatedString(pokemon.type2, pokemon.type2)}
            </span>
          )}
        </div>
        <p style={boldStyle}>hp: </p>
        <p style={inlineStyle}>{pokemon.hp}</p>
        <p style={boldStyle}>atk: </p>
        <p style={inlineStyle}>{pokemon.atk}</p>
        <p style={boldStyle}>def: </p>
        <p style={inlineStyle}>{pokemon.def}</p>
        <p style={boldStyle}>spatk: </p>
        <p style={inlineStyle}>{pokemon.spatk}</p>
        <p style={boldStyle}>spdef: </p>
        <p style={inlineStyle}>{pokemon.spdef}</p>
        <p style={boldStyle}>speed: </p>
        <p style={inlineStyle}>{pokemon.speed}</p>
      </div>
    </div>
  );
}

export function pokeBlock(pokemon, d = {}) {
  return (
    <div>
      <div style={{ marginLeft: "15px" }}>
        {nameBlock(pokemon)}
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          {moveBlock(getMove(pokemon.move1), d[0])}
          {moveBlock(getMove(pokemon.move2), d[1])}
          {moveBlock(getMove(pokemon.move3), d[2])}
          {moveBlock(getMove(pokemon.move4), d[3])}
        </div>
      </div>
    </div>
  );
}

export function pokeTabs(pokemon) {
  return (
    <Tabs>
      <TabList>
        <Tab>Expanded</Tab>
        <Tab>Compact</Tab>
      </TabList>
      <TabPanel>{pokeBlock(pokemon)}</TabPanel>
    </Tabs>
  );
}

function getStatRank(stat, val, data = Pokemon) {
  const sorted = data
    .map(p => p[stat])
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    })
    .sort(sortIntStrings);
  return Math.round(100 * (sorted.indexOf(val) / sorted.length));
}

export function rankedStat(stat, val, data = Pokemon) {
  const pctRank = getStatRank(stat, val, data);
  return (
    <div>
      {val} <span style={{ color: "grey" }}>({pctRank}%)</span>
    </div>
  );
}

export function multiSorter(keys) {
  const sorter = (filter, rows) => {
    return MatchSorter(rows, filter.value, {
      keys: keys,
      threshold: MatchSorter.rankings.WORD_STARTS_WITH
    });
  };
  return sorter;
}
