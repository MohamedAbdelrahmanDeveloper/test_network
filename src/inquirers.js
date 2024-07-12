import inquirer from "inquirer";
import { addUsersFromFileUsers, getIpUsers, getIpUsersFromFile, getOfflineUsers, ipSearch, login, random, showUsers, userData, userDataUpdate } from "./init.js";

const files = ['data.json', 'bldy.json']

export let loginUserInquirer = () => { 
    inquirer.prompt([
        {
        type: "input",
        name: "username",
        message: "Whats is your username?"
        },    
        {
        type: "confirm",
        name: "details",
        message: "Do you want view details user?"
        }     
    ])
    .then((answers) => {
        login(answers.username).then(token=> {
            if (answers.details) {
                userData(token)
            }
            else {
                console.log(token);
            }
        }).catch(err=> {
            console.log('error',err);
        })
    })
}

export let randomUsersInquirer = () => { 
    inquirer.prompt([
        {
        type: "input",
        name: "start",
        message: "Whats is number start?"
        },   
        {
        type: "input",
        name: "end",
        message: "Whats is number end?"
        }     
    ])
    .then((answers) => {
        random(answers.start, answers.end)
    })
}

export let addUserFromFileInquirer = () => { 
    inquirer.prompt([
        {
            type: "input",
            name: "fromFile",
            message: "Enter from file name"
        },
        {
            type: "list",
            name: "toFile",
            choices: files,
            message: "Enter to file name"
        }
    ])
    .then((answers) => {
        addUsersFromFileUsers(answers.fromFile, answers.toFile)
    })
}

let getIpFromUsernameInquirer = () => { 
    inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "Enter username"
        }   
    ])
    .then((answers) => {
        getIpUsers(answers.username)
    })
}

let getIpUsersFromFileInquirer = () => { 
    inquirer.prompt([
        {
            type: "list",
            name: "fileName",
            choices: files,
            message: "Enter fileName"
        }   
    ])
    .then((answers) => {
        getIpUsersFromFile(answers.fileName)
    })
}

export let getOfflineUsersInquirer = () => { 
    inquirer.prompt([
        {
            type: "list",
            name: "file",
            choices: files,
            message: "Enter file"
        },
        {
            type: "confirm",
            name: "days",
            message: "Do you want view days user?"
        },
        {
            type: "number",
            name: "many",
            message: "Do you want view >= 40GB user?"
        },
        {
            type: "confirm",
            name: "traffic",
            message: "Do you want view traffic?"
        } 
    ])
    .then((answers) => {
        getOfflineUsers(answers.file, answers.days, answers.many, answers.traffic)
    })
}

let scanIPInquirer = () => { 
    inquirer.prompt([
        {
            type: "input",
            name: "ip",
            default: "172.0.0.*",
            message: "Enter ip require"
        }   
    ])
    .then((answers) => {
        ipSearch(answers.ip)
    })
}

export let ipSearchInquirer = () => { 
    inquirer.prompt([
        {
            type: "list",
            name: "choices",
            choices: [
                "Get ip from username",
                "Scan iP",
                "Get ip users from file",
            ],
            message: "Select"
        }  
    ])
    .then((answers) => {
        if (answers.choices === "Get ip from username") {
            getIpFromUsernameInquirer()
        }
        else if (answers.choices === "Scan iP") {
            scanIPInquirer()
        }
        else if (answers.choices === "Get ip users from file") {
            getIpUsersFromFileInquirer()
        }
        else {
            console.log('Please select');
        }
    })
}

export let showUsersInquirer = () => { 
    inquirer.prompt([
        {
            type: "list",
            name: "file",
            choices: files,
            message: "Enter file name"
        }   
    ])
    .then((answers) => {
        showUsers(answers.file)
    })
}

export let userDataUpdateInquirer = () => { 
    inquirer.prompt([
        {
            type: "list",
            name: "file",
            choices: files,
            message: "Enter file"
        }
    ])
    .then((answers) => {
        userDataUpdate(answers.file, 'save')
    })
}