const ld = require("lodash")
const fs = require("fs")
var filepath = "./t7_JIN.json"
// const data = require(filepath)
// console.log(data.character_name)

function isSorted(arr) {
    let sorted = true
    for (i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            sorted = false
            break
        }
    }
    return sorted
}

function hex(value, tab = 16) {
    let temp = value.toString(16)
    while (temp.length < 16) {
        temp = "0" + temp
    }
    return `0x${temp}`
}

function getU15(moves) {
    // Group each by 'u15' value
    const dict = moves.reduce((dict, obj, index) => {
        dict[obj.u15] ??= []
        dict[obj.u15].push(`${index} ${obj.name}`)
        return dict
    }, {})

    fs.writeFileSync("u15_Jin.json", JSON.stringify(dict, null, 4))
}

function merge(input) {
    let command = BigInt(input.u2)
    let direction = BigInt(input.u1)
    // let final = (command << 32n) | direction
    // console.log(hex(final))
    return (command << 32n) | direction
}

function getCommandsFromSequence(inputs_header, inputs) {
    const commands = inputs_header.reduce((list, value) => {
        let n = value.u2
        let idx = value.extradata_idx
        let cmds = inputs.slice(idx, idx + n).reduce((list2, obj) => {
            list2.push(merge(obj))
            return list2
        }, [])
        list.push(...cmds)
        return list
    }, [])
    // console.log(commands)
    return [...new Set(commands)]
}

function getAllCommandsHelper(cancels) {
    return [...new Set(cancels.map(cancel => cancel.command))].sort(
        (a, b) => a - b
    )
}
// u2 - command. u1 - direction
function getAllCommands(cancels, group_cancels, inputs_header, inputs) {
    let commands1 = getAllCommandsHelper(cancels)
    let commands2 = getAllCommandsHelper(group_cancels)
    let commands3 = getCommandsFromSequence(inputs_header, inputs)
    let allCommands = ld
        .uniq(commands1.concat(commands2).concat(commands3))
        .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
    // let allCommands = ld.uniq(commands3).sort((a, b) => (a < b) ? -1 : ((a > b) ? 1 : 0))
    allCommands.forEach(value => console.log(hex(value)))
    console.log("Total Length:", allCommands.length)
    // console.log(ld.uniq(allCommands))
}

function main() {
    let data
    try {
        data = JSON.parse(fs.readFileSync(filepath, "utf-8"))
        console.log(data?.character_name)
    } catch (err) {
        console.log(err.message)
        return
    }

    // getU15(data.moves)
    getAllCommands(
        data.cancels,
        data.group_cancels,
        data.input_sequences,
        data.input_extradata
    )
}

main()
