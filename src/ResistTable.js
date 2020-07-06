import React from "react";
import ReactTable from "react-table";
import { getTypeMod } from "./AttackTable";
import { typeIndicatedString } from "./Utils";
const Types = require("./resistances.json");

export class ResistTable extends React.Component {
  typeRowObj(type, pokemon) {
    const atkMods = pokemon.map(p => {
      return getTypeMod(p.type1, type) * getTypeMod(p.type2, type);
    });
    const defMods = pokemon.map(
      p => getTypeMod(type, p.type1) * getTypeMod(type, p.type2)
    );
    return {
      name: type,
      atk4x: atkMods.filter(a => a === 4).length,
      atk2x: atkMods.filter(a => a === 2).length,
      atk1x: atkMods.filter(a => a === 1).length,
      def1x: defMods.filter(a => a === 1).length,
      def2x: defMods.filter(a => a === 2).length,
      def4x: defMods.filter(a => a === 4).length,
      atkNoEffect: atkMods.filter(m => m === 0).length,
      defNoEffect: defMods.filter(m => m === 0).length
    };
  }

  render() {
    return (
      <ReactTable
        showPaginationBottom={false}
        data={Object.keys(Types).map(t =>
          this.typeRowObj(t, this.props.pokemon)
        )}
        defaultPageSize={17}
        className="-striped -highlight"
        columns={[
          {
            Header: "Type",
            columns: [
              {
                Header: "Type",
                width: 80,
                accessor: "name",
                Cell: row =>
                  row.value !== "" && typeIndicatedString(row.value, row.value)
              }
            ]
          },
          {
            Header: "Resist",
            columns: [
              {
                Header: "0x",
                width: 50,
                className: "center",
                accessor: "defNoEffect"
              },
              {
                Header: "4x",
                width: 50,
                className: "center",
                accessor: "def4x"
              },
              {
                Header: "2x",
                width: 50,
                className: "center",
                accessor: "def2x"
              },
              {
                Header: "1x",
                width: 50,
                className: "center",
                accessor: "def1x"
              }
            ]
          },
          {
            Header: "Vulnerable",
            columns: [
              {
                Header: "4x",
                width: 50,
                className: "center",
                accessor: "atk4x"
              },
              {
                Header: "2x",
                width: 50,
                className: "center",
                accessor: "atk2x"
              },
              {
                Header: "1x",
                width: 50,
                className: "center",
                accessor: "atk1x"
              }
            ]
          }
        ]}
      />
    );
  }
}
