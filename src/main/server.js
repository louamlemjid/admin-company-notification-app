
const express = require('express');
const bodyParser=require('body-parser')
var session = require('express-session')
const os =require("os")
import { error } from 'console';
import { Employee,Company } from './db'
const http = require('https')
const cors = require('cors');
const {WebSocket}=require("ws")
const cron=require('node-cron')
import {app} from 'electron'
const fs=require('fs/promises')
import { join } from 'path'

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

function startServer() {
  const app = express();
  const PORT = 3031;
  console.log(userDataPath)


  // Set up the WebSocket server
//   const wss = new WebSocket.Server({ port: 8080 });
  app.use(session({
      
      secret: "top secret !",
      resave: false,
      saveUninitialized: false,
      cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days 
      }
  }));
  app.use(cors());
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
  app.use('/images', express.static(userDataPath));

  app.use(express.json());
  var sessionEmail;
  loadUserData().then((userData)=>{
    if(userData!={}){
        console.log('Loaded user data from server express: ', userData);
        Employee.findOne({userId:userData.userId,password:userData.password}).then((loginEmployee)=>{
            if(loginEmployee)sessionEmail=loginEmployee.email;
        }).catch((error1)=>console.error(error1))
      };
  }).catch((error)=>console.error(error))
    // company serving image logo on
    app.get('/api', (req, res) => {
        try {
            // Replace with the actual filename of the image you want to serve
        const imageName = 'splash.png';
        const imageUrl = `http://192.168.56.1:${PORT}/images/${imageName}`;
    
        res.json({
            imageUrl: imageUrl
        });
        } catch (error) {
           console.error("api route failed: ",error); 
        }
        
    });
        app.post('/login',async(req,res)=>{
            try {
                console.log(req.body)
            const {userId,password}=req.body;
            
            const loginEmployee=await Employee.findOne({userId:userId,password:password})
            console.log("loginEmployee: ",loginEmployee)
            const loginCompany=await Company.findOne({userId:userId,password:password})
            console.log("loginCompany: ",loginCompany)
            if(loginEmployee!=null){
                sessionEmail=loginEmployee.email
                console.log(sessionEmail)
                res.json({loginInfo:"employee",name:loginEmployee.name});
                saveUserData({ userId: userId,password:password });
                const logedInEmployee=await Employee.findOneAndUpdate({email:sessionEmail},
                    {$set:{logedIn:true}},{new:true})
        //loging in with ip
        //     const interfaces = os.networkInterfaces();
        //     console.log(interfaces)
        //     let ipsArray=[]
        //     Object.values(interfaces).forEach((inFace,i)=>{
        //             console.log(inFace)
        //             inFace.forEach((val)=>{
        //                 if (val.family === 'IPv4' && !val.internal) {
        //                     console.log(val.address)
        //                     ipsArray.push(val.address)
        //                 }
        //             })
                    
        //     })
        //     console.log("ipsArray: ",ipsArray)
        // //change login state
        // const logedInEmployee=await Employee.findOneAndUpdate({email:sessionEmail},
        // {$set:{logedIn:true},$push:{connectedWithIps:{$each:ipsArray}}},{new:true})
        console.log("employee loged in",logedInEmployee)
           
            }else if(loginCompany!=null){
                sessionEmail=loginEmployee.email
            res.json({loginInfo:"company"});
            
            }else{
                res.json({loginInfo:"notFound"});
            }
            
            } catch (error) {
            console.error('login route failed: ',error);    
            }
        })
        //test socket 
        // wss.on('connection', function connection(ws, req) {
        //     var component=""
        //     ws.on('error', console.error);
            
        //     ws.on('message', function message(data) {
        //         const dataString = Buffer.from(data).toString('utf-8');
        //         // Parse the JSON data
        //         const finalData = JSON.parse(dataString);
        //         console.log("component",finalData);
        //         component=finalData.message
        //     });
            
        //         cron.schedule('2 * * * * *',async()=>{
        //             console.log("srver express cron is triggered..")
        //             fetch("https://type.fit/api/quotes")
        //             .then(function(response) {
        //             return response.json();
        //             })
        //             .then (async function(data) {
        //               let newQuote=data[Math.floor(Math.random() * data.length)];
        //               ws.send(JSON.stringify(
        //               {text:newQuote.text,author:newQuote.author}))
        //               console.log("new quote is sent..")
        //             })
        //             .catch((error)=>console.error("promise notification: ",error))
        //           })
            
        //     ws.on('close', () => {
        //         console.log('Client disconnected');
        //       });
            
        //       // Example: Send a message to the client every 5 seconds
        //       Company.watch().on('change', async(data) => {
        //         console.log("changes made: ",data)
        //         if(data.operationType=='update'){
        //             const getUser=await Employee.findOne({email:sessionEmail})
        //             if(getUser){
        //                 let companySerialId=getUser.companyId;
        //                 let getCompany=await Company.findOne({serialId:companySerialId}).lean()
        //                 let dataToSend={
        //                 events:getCompany.events.reverse(),
        //                 urgents:getCompany.urgents,
        //                 products:getCompany.products.reverse(),
        //                 voteSubject:getCompany.vote.subject
        //                 }
        //                 let updatedField=data.updateDescription.updatedFields
        //                 console.log(Object.keys(updatedField)[0])

        //                 if(Object.keys(updatedField)[0].match(/events/g)){
        //                     ws.send(JSON.stringify({events:dataToSend.events}));
        //                 console.log("events...")

        //                 }else if(Object.keys(updatedField)[0].match(/urgents/g)){
        //                     ws.send(JSON.stringify({urgents:dataToSend.urgents}));
        //                 console.log("urgents...")
                        
        //                 }else if(Object.keys(updatedField)[0].match(/products/g)){      
        //                     ws.send(JSON.stringify({products:dataToSend.products}));                       
        //                 console.log("products...")
                        
        //                 }else if(Object.keys(updatedField)[0].match(/vote/g)){
        //                     ws.send(JSON.stringify({voteSubject:dataToSend.voteSubject}));
        //                 console.log("vote...")
        //                 }
        //             }   
        //         }
        //     });
        //     Employee.watch().on('change', async(data) => {
        //         console.log("changes made: ",data)
        //         if(data.operationType=='update'){
        //             const getUser=await Employee.findOne({email:sessionEmail})
        //             let updatedField=data.updateDescription.updatedFields
        //             if(Object.keys(updatedField)[0].match(/vote/g)){
        //                 let getCompany=await Company.findOne({serialId:getUser.companyId}).lean()
        //                 if(getCompany){
        //                     let companySerialId=getCompany.serialId;
        //                     //update vote result list and do stat : %,major result
        //                 }
        //             console.log("vote employee...")
        //             }
        //             else if(Object.keys(updatedField)[0].match(/logedIn/g)){
        //                 console.log("logedIn...")
        //                 // const interfaces = os.networkInterfaces();
        //                 // console.log(interfaces)
        //                 // let ipsArray=[]
        //                 // Object.values(interfaces).forEach((inFace,i)=>{
        //                 //         console.log(inFace)
        //                 //         inFace.forEach((val)=>{
        //                 //             if (val.family === 'IPv4' && !val.internal) {
        //                 //                 console.log(val.address)
        //                 //                 ipsArray.push(val.address)
        //                 //             }
        //                 //         })
        //                 // })
        //                 // const connectedEmployee=await Employee.findOne({logedIn:true,connectedWithIps:{$in:ipsArray}})
        //                 const userData = await loadUserData();
        //                 if(userData!={}){
        //                     const connectedEmployee=await Employee.findOne({userId:userData.userId,password:userData.password})
                            
        //                     console.log('Loaded user data in server express after change stream: ', userData);
        //                     if(connectedEmployee!=null){
        //                         ws.send(JSON.stringify({loginInfo:"employee",name:connectedEmployee.name}))
        //                         sessionEmail=connectedEmployee.email
        //                         console.log("connected employee from checkLgin route: ",connectedEmployee)
        //                     }else{
        //                         ws.send(JSON.stringify({loginInfo:"none"}))
        //                     }
        //                 };
                        
        //             }
        //         }
        //     })
        //   });
        //vote post route
        app.post('/vote',async(req,res)=>{
            try {
                const {vote}=req.body
            let subjectVote=''
            console.log("vote route triggered: ",vote)
            const getUser=await Employee.findOne({email:sessionEmail})
            console.log(getUser)
            if(getUser){
                const getCompany=await Company.findOneAndUpdate({serialId:getUser.companyId},
                    {$push:{"vote.result":vote},$inc:{"vote.numberOfVotes":1}},{new:true}
                )
                console.log(getCompany)
                res.json({subject:getCompany.vote.subject,vote:vote});
            }
            } catch (error) {
             console.error("vote route failed: ",error);   
            }
        })
        //check for login 
        app.get('/checkLogin',async(req,res)=>{
            try {
                // const interfaces = os.networkInterfaces();
            // console.log(interfaces)
            // let ipsArray=[]
            // Object.values(interfaces).forEach((inFace,i)=>{
            //         console.log(inFace)
            //         inFace.forEach((val)=>{
            //             if (val.family === 'IPv4' && !val.internal) {
            //                 console.log(val.address)
            //                 ipsArray.push(val.address)
            //             }
            //         })
            // })
            // const connectedEmployee=await Employee.findOne({logedIn:true,connectedWithIps:{$in:ipsArray}})
            const userData = await loadUserData();
            if(userData!={}){
                
                const connectedEmployee=await Employee.findOne({userId:userData.userId,password:userData.password})
                
                console.log('Loaded user data:', userData);
                if(connectedEmployee!=null){
                    res.json({loginInfo:"employee",name:connectedEmployee.name})
                    sessionEmail=connectedEmployee.email
                    console.log("connected employee from checkLgin route: ",connectedEmployee)
                }else{
                    res.json({loginInfo:"none"})
                }
            };
            } catch (error) {
              console.error("checkLogin route failed: ",error);  
            }
        })
        //notification employee
        app.get('/notification-starter-employee',async(req,res)=>{
            try {
                console.log("req.session.email: get ",sessionEmail)
            const findEmployee=await Employee.findOne({email:sessionEmail})
            console.log("employee found in notification started route: ",findEmployee)
            if(findEmployee){
            const companySerialId=findEmployee.companyId
            console.log("companySerialId: ",companySerialId)
            const rule=await Company.findOne({serialId:companySerialId}).lean()
            console.log(rule.rules)
            res.json({rule:rule.rules,events:rule.events.reverse(),urgents:rule.urgents.reverse(),products:rule.products})
            }
            } catch (error) {
             console.error("notification starter employee route failed: ",error);   
            }
        })
        app.get('/events', (req, res) => {
            try {
                res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            //change stream for companies
            Company.watch().on('change', async(data) => {
                console.log("changes made: ",data)
                if(data.operationType=='update'){
                    const getUser=await Employee.findOne({email:sessionEmail})
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
                        res.write(JSON.stringify({events:dataToSend.events}));
                        console.log("events...")
                        console.log(Object.values(updatedField)[0])
                        }else if(Object.keys(updatedField)[0].match(/urgents/g)){
                            res.write({urgents:dataToSend.urgents});
                        console.log("urgents...")
                        }else if(Object.keys(updatedField)[0].match(/products/g)){
                            res.write({products:dataToSend.products});
                        console.log("products...")
                        }else if(Object.keys(updatedField)[0].match(/vote/g)){
                            res.write({voteSubject:dataToSend.voteSubject,
                                userChoice:getUser.vote});
                        console.log("vote...")
                        }
                        
                    }   
                }
      });
            req.on('close', () => {
              
              res.end();
            });
            } catch (error) {
               console.error("events route failed: ",error); 
            }
          });
    

    // company serving image logo on
    app.get('/api', (req, res) => {
    try {
        // Replace with the actual filename of the image you want to serve
    const imageName = 'anime.jpg';
    const imageUrl = `http://192.168.56.1:${PORT}/images/${imageName}`;

    res.json({
        imageUrl: imageUrl
    });
    } catch (error) {
       console.error("api route failed: ",error); 
    }
    
    });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export {startServer};
