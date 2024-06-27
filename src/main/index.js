import { app,
  shell,
  BrowserWindow,
  ipcMain,
  session,
  Notification,
webContents} from 'electron'
const Jimp = require('jimp');
const util = require('util');
import os from "os"
const screensaver = require('screensaver');
const execPromise = util.promisify(exec);
import imglyRemoveBackground from "@imgly/background-removal"
import { exec } from 'child_process';
import cron from 'node-cron'
import randomString from 'randomized-string'
import {nodemailer} from "nodemailer"
import { join } from 'path'
import fs from 'fs/promises'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import mongoose from 'mongoose'
import { Employee,Company } from './db'
import axios from 'axios';
import { emit, eventNames } from 'process'
import { number } from 'randomized-string/lib/types'
import {startServer} from './server'
import dotenv from 'dotenv';
dotenv.config()
mongoose.connect(import.meta.env.VITE_MONGODB_LINK);


const db = mongoose.connection;

const userDataPath = app.getPath('userData');
const dataFilePath = join(userDataPath, 'userdata.json');
async function saveUserData(data) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data));
    console.log('User data saved successfully.');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}
      
async function loadUserData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
}
async function clearUserData() {
  try {
    // Overwrite userdata.json with an empty object
    await fs.writeFile(dataFilePath, JSON.stringify({}));
    console.log('All data inside userdata.json has been cleared.');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('User data file does not exist.');
    } else {
      console.error('Error clearing user data file:', error);
    }
  }
}
let quote;
let message;
let eventNote;
let urgentNote;
let productNote;
let voteNote;
const dailyQuote=(text)=>{
  quote=new Notification({
    title:'Quote',
    body:text,
  icon:join(__dirname,"../../resources/icon.png")})
}
const welcomeMessage=(userId)=>{
  message=new Notification({
    title:'Welcome',
    body:`${userId} :)`,
  icon:join(__dirname,"../../resources/icon.png")})
}
const eventNotification=(time,eventName,place,eventDescription)=>{
  eventNote=new Notification({
    title:'New event is up',
    body:`Event Name: ${eventName}
    time: ${time}
    Place: ${place}
    About: ${eventDescription}`,
  icon:join(__dirname,"../../resources/icon.png")})
}
const urgentNotification=(urgent)=>{
  urgentNote=new Notification({
    title:'Urgent notification !',
    body:`Subject: ${urgent}`,
  icon:join(__dirname,"../../resources/icon.png")})
}
const voteNotification=(text)=>{
  voteNote=new Notification({
    title:'Vote started :D',
    body:`Subject: ${text}`,
  icon:join(__dirname,"../../resources/icon.png")})
}
const productNotification=(productName,deadline,team)=>{
  productNote=new Notification({
    title:'New product waiting for shipping',
    body:`Product Name: ${productName}
    Deadline: ${deadline}
    Responsible Team: ${team}`,
  icon:join(__dirname,"../../resources/icon.png")})
}
let npmProcess;
let eventSet;
let mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    transparent: true,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
    
  })
  
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  
  
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createWindow()
  db.on('error', console.error.bind(console, 'Connection error:'));
  db.once('open', async function () {
    console.log('Connected to the database');
    //do something
    try{
      
      console.log('working ..')
      const ses = session.fromPartition('persist:name')
      ses.setUserAgent('')
      
      startServer();
      //save the main event to work with it
      ipcMain.on('trigger',(event)=>{
        try {
          console.log("trigger works fine")
        eventSet=event.sender;
        } catch (error) {
          console.error("trigger failed: ",error);
        }
      })
      ipcMain.on('fire',(event,dataToSend)=>{
        try {
          console.log("fire works fine")
        eventSet.send('fire',dataToSend)
        } catch (error) {
          console.error("fire failed: ",error);
        }
      })
      
      try {
        clearUserData()     
      
      const userData = await loadUserData();
      // console.log("path",dataFilePath)
      if(userData){
        
        const loginEmployee=await Employee.findOne({userId:userData.userId,password:userData.password})
        if(loginEmployee){
          ses.setUserAgent(loginEmployee.email);
          mainWindow.hide()
          const { stdout, stderr } = await execPromise(`${join(__dirname, '../../resources/startChromeExtension.bat')}`)
        }
        
        console.log('Loaded user data:', userData);
      }
      } catch (error) {
       console.error("image upload/clear failed: ",error); 
      }
      
      

      // ipcMain.emit('fire',1)
        
      //inject code
//       const cmd = 'npm start';
      
      
// // Function to write text on an image
// async function writeTextOnImage() {
//     // Load the image
//     const image = await Jimp.read(join(__dirname,'../../resources/welcomeImage.jpg'));

//     // Define the font (Jimp provides some built-in fonts)
//     const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

//     // Write "Hello World" on the image at coordinates (x, y)
//     image.print(font, 10, 10, 'Hello World');

//     // Save the modified image
//     await image.writeAsync(join(__dirname, '../../resources/output.jpg'));
    
//     console.log('Text written on image successfully');
// }

// // Execute the function
// writeTextOnImage().catch(console.error);

      // try {

        // console.log(join(app.getPath('desktop'), 'companyNotificationApp', 'browser-notification-company-app'))
        
        // npmProcess = exec(cmd, { cwd: path.join(app.getPath('desktop'), 'companyNotificationApp', 'browser-notification-company-app') });
        //start react server
        // const npmProcess = await execPromise(cmd, { cwd: join(app.getPath('desktop'), 'companyNotificationApp', 'browser-notification-company-app') });
        // console.log("child process started")
        // const { stdout, stderr } = await execPromise(cmd, { cwd: join(app.getPath('desktop'), 'companyNotificationApp', 'browser-notification-company-app') });
        // console.log(stdout, stderr)
       
    //     const systemRoot = process.env.SystemRoot;

    // // Construct the path to the System32 directory
    // const system32Path = join(systemRoot, 'System32');

    // console.log('System32 Path:', system32Path);
    // const { stdout, stderr } = await execPromise(`reg add "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows Photo Viewer\\Slideshow\\Screensaver" /v EnclosureDirectory /t REG_SZ /d "${join(__dirname, '../../resources')}" /f`)
    // const { stdout, stderr } = await execPromise('start PhotoScreensaver.scr /s');
        // if (stderr) {
        //   return `Stderr: ${stderr}`;
        // }
        // return stdout;
      // } catch (error) {
      //   return `Error: ${error.message}`;
      // }
      
      //change stream for companies
      try {
        Company.watch().on('change', async(data) => {
          console.log("changes made: ",data)
          if(data.operationType=='update'){
                const getUser=await Employee.findOne({email:ses.getUserAgent()})
                if(getUser){
                  let companySerialId=getUser.companyId;
                  let getCompany=await Company.findOne({serialId:companySerialId}).lean()
                  let dataToSend={
                    events:getCompany.events.reverse(),
                    urgents:getCompany.urgents,
                    products:getCompany.products.reverse(),
                    voteSubject:getCompany.vote.subject
                  }
                  let updatedField=data.updateDescription.updatedFields
                  console.log(Object.keys(updatedField)[0])
  
                  if(Object.keys(updatedField)[0].match(/events/g)){
                    eventSet.send('fire',{events:dataToSend.events})
                    eventNotification(
                      dataToSend.events[0].date,
                      dataToSend.events[0].name,
                      dataToSend.events[0].place,
                      dataToSend.events[0].description
                    )
                    eventNote.show()
                    console.log("events...")
                    console.log(Object.values(updatedField)[0])
                  }else if(Object.keys(updatedField)[0].match(/urgents/g)){
                    eventSet.send('fire',{urgents:dataToSend.urgents.reverse()})
                    urgentNotification(dataToSend.urgents[0])
                    urgentNote.show()
                    console.log("urgents...")
                  }else if(Object.keys(updatedField)[0].match(/products/g)){
                    eventSet.send('fire',{products:dataToSend.products})
                    productNotification(
                      dataToSend.products[0].name,
                      dataToSend.products[0].name,
                      dataToSend.products[0].team
                    )
                    productNote.show()
                    console.log("products...")
                  }else if(Object.keys(updatedField)[0].match(/vote/g)){
                    eventSet.send('fire',{voteSubject:dataToSend.voteSubject})
                    voteNotification(
                      dataToSend.voteSubject
                    )
                    voteNote.show()
                    console.log("vote...")
                  }
                  
                }   
          }
          if(data.ns.coll=='employees'){
            let getUser=await Employee.findOne({email:ses.getUserAgent()})
            if(getUser){
              let voteChoice=getUser.vote
              eventSet.send('fire',{voteChoice:voteChoice})
            }
          }
        });
      } catch (error) {
        console.error("watch: ",error);
      }
      //change stream for emlpoyee
      Employee.watch().on('change',async(data)=>{

      })
      //listen for image 
      ipcMain.on('save-image', (event, imageData) => {
        try {
          const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
        const filePath = join(app.getPath('userData'), 'splash.png');
        console.log(imageData)
        fs.writeFile(filePath, base64Data, 'base64', (err) => {
          if (err) {
            console.error('Failed to save image', err);
            event.reply('save-image-response', 'error');
          } else {
            console.log('Image saved successfully');
            event.reply('save-image-response', 'success');
          }
        });
        } catch (error) {
          console.error("save image: ",error);
        }
      });
      //notification starter
      ipcMain.on('notification-starter',async(event)=>{
        try {
          let rule=await Company.findOne({email:ses.getUserAgent()}).lean()
        console.log(rule.rules)
        event.sender.send('notification',
        {rule:rule.rules,events:rule.events.reverse(),urgents:rule.urgents.reverse(),
          products:rule.products})
        } catch (error) {
          console.error("notification starter: ",error);
        }
      })
      
      //notification starter for employee
      ipcMain.on('notification-starter-employee',async(event)=>{
        try {
          const findEmployee=await Employee.findOne({email:ses.getUserAgent()})
        if(findEmployee){
        const companySerialId=findEmployee.companyId
        console.log("companySerialId: ",companySerialId)
        const rule=await Company.findOne({serialId:companySerialId}).lean()
        console.log(rule.rules)
        event.sender.send('notification-employee',
        {rule:rule.rules,events:rule.events.reverse(),urgents:rule.urgents.reverse(),
          products:rule.products})
        }
        } catch (error) {
          console.error("notification starter employee: ",error);
        }
      })
      //notification
      ipcMain.on('notification',async(event)=>{
        try{
          cron.schedule('1 * * * * *',async()=>{
            fetch("https://type.fit/api/quotes")
            .then(function(response) {
            return response.json();
            })
            .then (async function(data) {
              let newQuote=data[Math.floor(Math.random() * data.length)];
              dailyQuote(newQuote.text)
              quote.show()
              let rule=await Company.findOne({email:ses.getUserAgent()}).lean()
              console.log(rule.rules)

              event.sender.send('notification',
              {text:newQuote.text,author:newQuote.author,
                rule:rule.rules,events:rule.events.reverse(),urgents:rule.urgents.reverse(),
                products:rule.products})
            })
            .catch((error)=>console.error("promise notification: ",error))
          })
        
        }catch(error){
          console.error("notification channel: ",error)
        }
      })
      //notification for employee
      ipcMain.on('notification-employee',async(event)=>{
        try{
          cron.schedule('1 * * * * *',async()=>{
            fetch("https://type.fit/api/quotes")
            .then(function(response) {
            return response.json();
            })
            .then (async function(data) {
              let newQuote=data[Math.floor(Math.random() * data.length)];
              dailyQuote(newQuote.text)
              quote.show()
              const findEmployee=await Employee.findOne({email:ses.getUserAgent()})
              if(findEmployee){
              const companySerialId=findEmployee.companyId
              console.log("companySerialId: ",companySerialId)
              const rule=await Company.findOne({serialId:companySerialId}).lean()
              console.log(rule.rules)
              event.sender.send('notification-employee',
              {text:newQuote.text,author:newQuote.author,
                rule:rule.rules,events:rule.events.reverse(),urgents:rule.urgents.reverse(),
                products:rule.products})
              }

              
            })
            .catch((error)=>console.error("promise notification: ",error))
          })
        
        }catch(error){
          console.error("notification channel: ",error)
        }
      })
      //login
      ipcMain.on('login',async(event,data)=>{
       try {
        const {userId,password}=data;
        console.log(data)
        const loginEmployee=await Employee.findOne({userId:userId,password:password})
        console.log("loginEmployee: ",loginEmployee)
        const loginCompany=await Company.findOne({userId:userId,password:password})
        console.log("loginCompany: ",loginCompany)
        if(loginEmployee!=null){
          //store userId inside roaming 
          saveUserData({ userId: userId,password:password });
          ses.setUserAgent(loginEmployee.email)
          const logedInEmployee=await Employee.updateOne({email:ses.getUserAgent()},
          {$set:{logedIn:true}},{new:true})
          event.sender.send('login',"employee")

          setTimeout(async() => {
            mainWindow.hide()
            const { stdout, stderr } = await execPromise(`${join(__dirname, '../../resources/startChromeExtension.bat')}`)
          }, 5000);
         
          // const interfaces = os.networkInterfaces();
          //   console.log(interfaces)
          //   let ipsArray=[]
          //   Object.values(interfaces).forEach((inFace,i)=>{
          //           console.log(inFace)
          //           inFace.forEach((val)=>{
          //               if (val.family === 'IPv4' && !val.internal) {
          //                   console.log(val.address)
          //                   ipsArray.push(val.address)
          //               }
          //           })
          //   })
          // //change login state
          // const logedInEmployee=await Employee.updateOne({email:ses.getUserAgent()},
          // {$set:{logedIn:true},$push:{connectedWithIps:{$each:ipsArray}}},{new:true})
        console.log("employee loged in",logedInEmployee)
          
          welcomeMessage(userId)
          message.show()
          // mainWindow.hide() 
        }else if(loginCompany!=null){
          ses.setUserAgent(loginCompany.email)
          event.sender.send('login',"company")
          saveUserData({ userId: userId,password:password });
          welcomeMessage(userId)
          message.show()
        }else{
          event.sender.send('login',"notFound")
        }
       } catch (error) {
        console.error("login: ",error);
       }
      })
      //logout
      ipcMain.on('logout',async(event)=>{
        try {
          console.log("logout is triggred")
          const logoutUser=await Employee.findOneAndUpdate({email:ses.getUserAgent()}
          ,{$set:{logedIn:false,connectedWithIps:[]}},{new:true})
          sessionEmail='';
          console.log("loged out state: ",logoutUser)
        } catch (error) {
          console.error("error logout: ",error);
        }
      })
      //signup employye
      ipcMain.on('signup-employee',async(event,data)=>{
        try {
          console.log("sign up employee channel: ",data)
        const {name,userId,password,email,companyId}=data;
        const checkCompanySerialId=await Company.findOne({serialId:companyId})
        console.log("comâny serial id: ",checkCompanySerialId)
        if(checkCompanySerialId!=null){
          const newEmployee=await Employee.updateOne({userId:userId},
            {$set:{userId:userId,email:email,password:password,name:name,companyId:companyId},
          $inc:{numberOfEmployees:1}},
          {upsert:true})
          console.log('newEmployee upserted: ',newEmployee.upsertedCount)
          if(newEmployee.upsertedCount!=0){event.sender.send('signup-employee',"created")}
          else{
            event.sender.send('signup-employee',"employeeAlreadyExists")
          }
          
        }else{
          event.sender.send('signup-employee',"wrongSerialId")

        }
        } catch (error) {
         console.error("error signup employee: ",error); 
        }
      })
      //add emloyee
      ipcMain.on('add-employee',async(event,data)=>{
        try{
          console.log("add Employee is triggered")
          const {userId,password}=data;
          const getCompany=await Company.findOne({email:ses.getUserAgent()})
          if(getCompany){
            const addEmployee=await Employee.updateOne({userId:userId,password:password}
              ,{$set:{userId:userId,password:password}}
              ,{upsert:true})
            console.log("new employee is added: ",addEmployee)
          }
        }catch(error){console.error('error add employee ',error)}

      })
      //signup company
      ipcMain.on('signup-company',async(event,data)=>{
        try {
          console.log("sign up company channel: ",data)
        const {name,email,userId,password}=data;
        let serialId=randomString.generate(6);
        const interfaces = os.networkInterfaces();
         console.log(interfaces)
         let ipsArray=[]
        Object.values(interfaces).forEach((inFace,i)=>{
                console.log(inFace)
                inFace.forEach((val)=>{
                    if (val.family === 'IPv4' && !val.internal) {
                        console.log(val.address)
                        ipsArray.push(val.address)
                    }
                })
        })
        const newCompany=await Company.updateOne({userId:userId},
          {$set:{email:email,name:name,password:password,userId:userId,serialId:serialId,
          numberOfEmployees:0,ip:ipsArray[0]}},
        {upsert:true})
        console.log("resut for insertion company:",newCompany)
        event.sender.send('signup-company',"created")
        } catch (error) {
          console.log("error signup company: ",error)
        }
      })
      //rules
      ipcMain.on('rules',async(event)=>{
        try {
          console.log("rules is triggered")
          const finRules=await Company.findOne({email:ses.getUserAgent()}).lean()
          console.log(finRules.rules)
          event.sender.send('rules',finRules.rules)
        } catch (error) {
          console.error("rules: ",error);
        }
      })
      //add rules
      ipcMain.on('add-rules',async(event,data)=>{
        try {
          const {rule}=data
        console.log("new rule receved: ",rule)
        const addRules=await Company.findOneAndUpdate({email:ses.getUserAgent()},
        {$push:{rules:rule}},
        {new:true})
        console.log("added rule: ",addRules)
        } catch (error) {
          console.error("add rules: ",error);
        }
      })
      //add event
      ipcMain.on('add-event',async(event,data)=>{
        try {
          console.log("add event triggered")
        const {name,date,description,place}=data
        const newEvent=await Company.findOneAndUpdate({email:ses.getUserAgent()},
        {$push:{events:{name:name,date:date,description:description,place:place}}},
        {new:true})
        console.log("event add result: ",newEvent)
        let rule=await Company.findOne({email:ses.getUserAgent()}).lean()
              console.log(rule.rules)
        event.sender.send('notification',{events:rule.events.reverse(),rule:rule.rules})
        } catch (error) {
          console.error("add event: ",error);
        }
      })
      //start vote
      ipcMain.on('vote',async(event,data)=>{
        try {
          if(data){
            const {subject}=data
          console.log("vote triggered: ",subject)
          const startVote=await Company.updateOne({email:ses.getUserAgent()},
            {$set:{vote:{subject:subject,numberOfVotes:0}}})
          console.log("vote started: ",startVote)
          event.sender.send('vote',{subject:subject,nbVotes:0,result:'',percentage:0})
          }else{
            const checkForVote=await Company.findOne({email:ses.getUserAgent()}).lean()
            console.log("checked for vote: ",checkForVote)
          }
        } catch (error) {
          console.error("start vote: ",error);
        }
      })
      //vote for employee
      ipcMain.on('vote-employee',async(event,data)=>{
        try {
          if(data){
            const {vote}=data
            console.log("vote triggered: ",vote)
            const getUser=await Employee.findOneAndUpdate({email:ses.getUserAgent()},
          {$set:{vote:vote}},{new:true})
            if(getUser){
              let companySerialId=getUser.companyId;
              let getCompany=await Company.findOneAndUpdate({serialId:companySerialId},
                {$push:{"vote.result":vote},$inc:{"vote.numberOfVotes":1}},{new:true})
                event.sender.send('vote-employee',{subject:getCompany.vote.subject,
                  vote:vote})
            }
          }else{
            const checkForVote=await Company.findOne({email:ses.getUserAgent()}).lean()
            console.log("checked for vote: ",checkForVote)
          }
  
        } catch (error) {
          console.error("vote for employee: ",error);          
        }
      })
      //add urgents
      ipcMain.on('add-urgents',async(event,data)=>{
        try {
          
        console.log("add urgents is triggered: ",data)
        const newUrgent=await Company.findOneAndUpdate({email:ses.getUserAgent()},
        {$push:{urgents:data.subject}},{new:true}).lean()
        console.log("new urgent is added: ",newUrgent.urgents)
        event.sender.send('add-urgents',{urgents:newUrgent.urgents.reverse()})
        } catch (error) {
          console.error("add urgents: ",error);
        }
      })
      //add products
      ipcMain.on('add-products',async(event,data)=>{
        try {
          console.log("add products triggered",data)
        const {name,deadline,team}=data
        const newProduct=await Company.findOneAndUpdate({email:ses.getUserAgent()},
      {$push:{products:{name:name,deadline:deadline,team:team}}},
    {new:true})
    console.log("newProduct added: ",newProduct)
    event.sender.send('add-products',{products:newProduct.products})

        } catch (error) {
          console.error("add products: ",error);          
        }
      })
      
    }catch(error){
      console.error('error accured',error)
      console.log('connection to mongodb server failed')
    }
  })
  
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // if (npmProcess) {
    //   npmProcess.kill();
    //   npmProcess = null;
    //   console.log("process ended")
    // }
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
