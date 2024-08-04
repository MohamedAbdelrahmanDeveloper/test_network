import axios from 'axios'
import CryptoJS  from "crypto-js";
import { readFile, setData, setDataTwo } from './fileSystem.js';
import child_process from 'child_process'
import { PASSWORD, SECRET, URL } from './var.js';

function execute(command, callback){
    child_process.exec(command, function(error, stdout, stderr){ callback(stdout); });
};


export async function login(username) {
    try {
        var data = {"username":username,"password":PASSWORD}
        var payload = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString()
        const res = await axios.post(`${URL}/user/api/index.php/api/auth/login`, {
            payload
        })
        return res.data.token
    } catch (error) {
        return Promise.reject('no user > ' + username)
    }
}

export function userData(token, fileName, options = null) {
    axios.get(`${URL}/user/api/index.php/api/user`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        let user = res.data.data
        user.permissions = res.data.permissions
        if (options === 'save') {
            setData(fileName, user)
        }
        else {
            console.log(user);
        }
    }).catch(error=> {
        // console.log('error', error);
    })
}

export function addUsersFromFileUsers(fromFile, toFile) {
    let usernames = JSON.parse(readFile(fromFile))
    usernames.forEach(user=>{
        login(user).then(token=>{
            userData(token, toFile, 'save')
        }).catch(error=> {
            console.log('error d', error);
        })
    })
}

export function random(start=1,end=10) {
    for (let index = start; index < end; index++) {
        login(index).then(token=> {
            console.table({
                username: index,
                token
            });
            setData('users.json', index)
        }).catch(er=> {
            console.log(er);
        })
    }
}

export function ipSearch(ip) {
    execute(`nmap -sn -T5 --min-parallelism 10 -oG - ${ip}`, function(res){
        const ipNew = ip.split('.')[0]
        const data = res.replaceAll(`Host: ${ipNew}`, `Host: http://${ipNew}`)
        console.log(data);
    });
}



function ipUser(token, username) {
    const sessionPayload = CryptoJS.AES.encrypt(JSON.stringify({"page":1,"count":10,"sortBy":"radacctid","direction":"desc"}), SECRET).toString()
    axios.post(`${URL}/user/api/index.php/api/index/session`, {
            payload: sessionPayload
        }, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            let sessions = res.data.data
            if (sessions.length > 0) {
                const data = {
                    username,
                }
                console.log(`User: ${username} router: http://${sessions[0].framedipaddress} mac: ${sessions[0].callingstationid} Status: ${sessions[0].acctstoptime ? "Offline" : "Online"}`);
                console.table(sessions);
                if (sessions[0].framedipaddress.startsWith('172')) {
                    setData('usersbldy.json', username)
                }
            }
            else {
                console.log('No sessions of', username)
            }
        }).catch(error=> {
            console.log('error');
        })
}

export function getIpUsers(username) {
    if (username) {
        login(username).then(token=>{
            ipUser(token,username)
        }).catch(error=> {
            console.log('error ', error);
        })
    } else {
        let usernames = JSON.parse(readFile('data.json'))
        usernames.map(user=>{
            login(user.username).then(token=>{
                ipUser(token,user.username)
            }).catch(error=> {
                console.log('error ', error);
            })
        })
    }
}


function offlineUser(token, username, isDays, isMany, traffic, trafficPayload) {
    axios.get(`${URL}/user/api/index.php/api/service`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            let user = res.data.data
            if (!user.status) {
                if (user.subscription_status.expiration && user.subscription_status.status && user.subscription_status.traffic) {
                    let profile_name = checkDataUsage(user.profile_name)
                    if (profile_name >= isMany) {
                        if (isDays) {
                            let days = Math.floor((new Date(user.expiration) - new Date()) / (1000 * 60 * 60 * 24))
                            traffic ? userTraffic(`yes | ${days} day | baqa is = ${user.profile_name} GB | `, username , trafficPayload) : console.log(`yes | ${days} day | baqa is = ${profile_name}GB | `, username, trafficPayload);
                        }
                        else {
                            traffic ? userTraffic(`Yes | baqa is = ${user.profile_name}GB | `, username, trafficPayload) : console.log(`yes | ${days} day | baqa is = ${profile_name}GB | `, username, trafficPayload);
                            console.log();
                        }
                    }
                }
                // else {
                //     console.log('No ', username);
                // }
            }
        }).catch(error=> {
            console.log('error', error);
        })
}

export function getOfflineUsers(file, isDays, isMany, traffic) {
    const dateForPayload = {
        "report_type":"daily",
        "month": new Date().getMonth() + 1,
        "year": new Date().getFullYear(),
        "user_id":null
    }
    const trafficPayload = CryptoJS.AES.encrypt(JSON.stringify(dateForPayload), SECRET).toString()
    let usernames = JSON.parse(readFile(file))
    usernames.map(user=>{
        login(user.username).then(token=>{
            offlineUser(token,user.username, isDays, isMany, traffic, trafficPayload)
        }).catch(error=> {
            // console.log('error ', error);
        })
    })
}

export function getIpUsersFromFile(fileName) {
    let usernames = JSON.parse(readFile(fileName))
    usernames.map(user=>{
        login(user.username).then(token=>{
            ipUser(token,user.username)
        }).catch(error=> {
            // console.log('error ', error);
        })
    })
}

export function showUsers(fileName) {
    let users = JSON.parse(readFile(fileName))
    let newUsers = users.map(user => {
        return {username: user.username, name:user.name}
    })
    console.table(newUsers)
}


function checkDataUsage(dataString) {
    let regex = /(\d+)GB/; // Looks for any consecutive number followed by GB
    let match = regex.exec(dataString);

    if (match) {
        let dataAmount = parseInt(match[1]); // Convert the matched value to an integer
        return parseInt(dataAmount)
    } else {
        return null
    }
}

export function userDataUpdate(fileName, options = null) {
    let usernames = JSON.parse(readFile(fileName))
    usernames.map(user=>{
        login(user.username).then(token=>{
            axios.get(`${URL}/user/api/index.php/api/user`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                let user = res.data.data
                user.permissions = res.data.permissions
                if (options === 'save') {
                    setDataTwo(fileName, user)
                }
                else {
                    console.log(user);
                }
            }).catch(error=> {
                // console.log('error', error);
            })
        }).catch(error=> {
            // console.log('error ', error);
        })
    })
}

export function userTraffic(text, username, trafficPayload) {
    login(username).then(token=>{
        axios.post(`${URL}/user/api/index.php/api/traffic`,{
            payload: `${trafficPayload}`
        },{
            headers: { Authorization: `Bearer ${token}` },
            
        }).then(res => {
            let traffic = res.data.data
            console.log(text, username, traffic.total);
        }).catch(error=> {
            console.log('error', error);
        })
    }).catch(error=> {
        console.log('error ', error);
    })
}