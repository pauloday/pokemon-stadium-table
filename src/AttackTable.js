import React from "react";
import ReactTable from "react-table";
import { pokeBlock, getMove } from "./Utils";
import { idCol, nameCol, typeCol, statCol } from "./Poketable";
const Types = require("./resistances.json");

export function getTypeMod(attackType, defendType) {
  if (attackType === "NULL" || defendType === "NULL") {
    return 1;
  }
  const attackStr = Types[attackType].attack.strong.includes(defendType);
  const attackWeak = Types[attackType].attack.weak.includes(defendType);
  const atkNoEffect = Types[attackType].attack.noEffect.includes(defendType);
  let mod = 1;
  // check attack strengths
  if (attackStr) {
    mod *= 2;
  } else if (attackWeak) {
    mod *= 0.5;
  } else if (atkNoEffect) {
    mod = 0;
  }
  return mod;
}

export class AttackTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comparePokemon: props.attacker
    };
    this.damageCol = this.damageCol.bind(this);
  }

  maxDamage(attacker, defender, moveName) {
    if (attacker === null || defender === null || moveName === null) {
      return 0;
    }
    const move = getMove(moveName);
    const stat = move.category;
    let atkStat = "";
    let defStat = "";
    let stab = 1;
    let typeMod =
      getTypeMod(move.type, defender.type1) *
      getTypeMod(move.type, defender.type2);
    switch (stat) {
      case "Status":
        return 0;
      case "Special":
        atkStat = "spatk";
        defStat = "spdef";
        break;
      case "Physical":
        atkStat = "atk";
        defStat = "def";
        break;
      default:
        break;
    }
    if (attacker.type1 === move.type || attacker.type2 === move.type) {
      stab = 1.5;
    }
    const levelterm = 42; // (2 * attacker Lvl) / 5 + 2 = 42 (lol) when atk lvl = 100
    const attackerterm = attacker[atkStat] * move.pow;
    const statterm = (levelterm * attackerterm) / defender[defStat];
    const typeterm = (statterm / 50 + 2) * stab * typeMod;
    return typeterm;
  }

  attackDamageString(maxDam) {
    if (maxDam === 0) {
      return "-";
    }
    const minDam = Math.round(maxDam * 0.85);
    return `${minDam} - ${Math.round(maxDam)}`;
  }

  longAttackDamageString(attacker, defender, moveName) {
    const maxDam = this.maxDamage(attacker, defender, moveName);
    if (maxDam === 0) {
      return "No Damage";
    }
    const maxPct = (100 * maxDam) / defender.hp;
    const minPct = (100 * maxDam * 0.85) / defender.hp;
    console.log(attacker, defender, maxPct, minPct);
    return `Damage: ${this.attackDamageString(maxDam)} (${Math.round(
      minPct
    )}% - ${Math.round(maxPct)}%)`;
  }

  damageCol(moveName) {
    const maxDam = def =>
      Math.round(this.maxDamage(this.props.attacker, def, moveName));
    return {
      id: `damage-${moveName}`,
      Header: moveName,
      accessor: p => maxDam(p),
      className: "center",
      Cell: row => this.attackDamageString(row.value)
    };
  }

  // attacker = pokemon selected from main table, defender = pokemon selected from this one
  render() {
    const { attacker } = this.props;
    const defender = this.state.comparePokemon;
    const atkDams = [
      attacker.move1,
      attacker.move2,
      attacker.move3,
      attacker.move4
    ].map(m => this.longAttackDamageString(attacker, defender, m));
    const defDams = [
      defender.move1,
      defender.move2,
      defender.move3,
      defender.move4
    ].map(m => this.longAttackDamageString(defender, attacker, m));
    return (
      <div>
        <ReactTable
          filterable
          data={this.props.data}
          defaultPageSize={10}
          className="-striped -highlight"
          getTdProps={(state, row, col, instance) => ({
            onClick: (event, cb) => {
              const clickedPokemon = this.props.data.filter(
                p => p.pokeid === row.original.pokeid
              )[0];
              this.setState({ comparePokemon: clickedPokemon });
              cb();
            }
          })}
          columns={[
            {
              Header: "Name",
              columns: [idCol, nameCol]
            },
            {
              Header: "Type",
              columns: [typeCol("Type 1", "type1"), typeCol("Type 2", "type2")]
            },
            {
              Header: "Stats",
              columns: [
                statCol("HP", "hp"),
                statCol("Atk", "atk"),
                statCol("Def", "def"),
                statCol("SpAtk", "spatk"),
                statCol("SpDef", "spdef"),
                statCol("Speed", "speed")
              ]
            },
            {
              Header: "Move Damage",
              columns: [
                this.damageCol(attacker.move1),
                this.damageCol(attacker.move2),
                this.damageCol(attacker.move3),
                this.damageCol(attacker.move4)
              ]
            }
          ]}
        />
        {defender !== null && pokeBlock(defender, defDams)}
        {defender !== null && pokeBlock(attacker, atkDams)}
        {defender === null && pokeBlock(attacker)}
      </div>
    );
  }
}
