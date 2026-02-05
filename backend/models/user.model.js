import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    assistantName:{
        type:String
    },
    assistantImage:{
        type:String
    },
    preferredLanguage:{
        type:String,
        default:'en'
    },
    location:{
        type:String,
        default:'Delhi'
    },
    customizationData:{
        type: Object,
        default: {
            themeColors: {
                primary: '#6366f1',
                secondary: '#8b5cf6',
                accent: '#ec4899',
                background: '#0f0f23'
            },
            selectedVoice: '',
            avatarScale: 1,
            avatarRotation: 0
        }
    },
    history:[
        {type:String}
    ],
    reminders:[
        {
            time:{type:Date, required:true},
            message:{type:String, required:true},
            active:{type:Boolean, default:true}
        }
    ],
    teacherProgress: [
        {
            teacherId: { type: String, required: true },
            lessonsCompleted: { type: Number, default: 0 },
            totalLessons: { type: Number, default: 0 },
            currentLevel: { type: String, default: "Beginner" },
            streak: { type: Number, default: 0 },
            lastLessonDate: { type: Date },
            currentModule: { type: String, default: "module1" },
            currentLessonIndex: { type: Number, default: 0 }
        }
    ]

},{timestamps:true})

const User=mongoose.model("User",userSchema)
export default User