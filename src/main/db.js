import { mongoose } from "mongoose";

const companyschema=new mongoose.Schema({
    name:String,
    password:String,
    email:String,
    serialId:String,
    userId:String,
    ip:String,
    events:[
        {
            name:String,
            date:Date,
            description:String,
            place:String
        }
    ],
    rules:[],
    employees:[
        {
            position:String,
            email:String,
        }
    ],
    NumberOfEmployees:Number,
    products:[
        {
            name:String,
            deadline:Date,
            completion:Number,
            team:String
        }
    ],
    urgents:[]
    ,vote:{
        subject:String,
        result:[],
        numberOfVotes:Number
    }

});
const Company=mongoose.model('Company',companyschema);

const employeeschema=new mongoose.Schema({
    name:String,
    password:String,
    email:String,
    position:String,
    userId:String,
    companyId:String,
    task:String,
    team:String,
    vote:String,
    logedIn:Boolean,
    connectedWithIps:[]
});
const Employee=mongoose.model('Employee',employeeschema);

export {Employee,Company}; 