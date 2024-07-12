#!/usr/bin/env node
import {Command} from "commander"
import { addUserFromFileInquirer, getOfflineUsersInquirer, ipSearchInquirer, loginUserInquirer, randomUsersInquirer, showUsersInquirer, userDataUpdateInquirer } from "./src/inquirers.js";
const program = new Command();


program
  .name('MTK')
  .description('Attack usernames')
  .version('1.0.0');

program.command('login')
  .description('Add a string into substrings and display as an array')
  .action(() => {
    loginUserInquirer()
   });

program.command('random')
  .description('random users ')
  .action(() => {
    randomUsersInquirer()
   });

program.command('add')
  .description('random users ')
  .action(() => {
    addUserFromFileInquirer()
   });

program.command('offline')
  .description('Get offline users')
  .action(() => {
    getOfflineUsersInquirer()
   });

program.command('ip')
  .description('scan ip address')
  .action(() => {
    ipSearchInquirer()
   });

program.command('list')
.description('Show list names')
.action(() => {
    showUsersInquirer()
 });

 program.command('update')
.description('update data')
.action(() => {
    userDataUpdateInquirer()
 });


program.parse();