const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true,
		trim : true
	},
	gender : {
		type : String,
		trim : true,
		validate(val){
			if(val !== 'male' && val !== 'female'){
				throw new Error('gender must be male/female')
			}
		}
	},
	phone_no : {
		type : Number,
		required : true,
		validate(value){
			if(value.toString().length < 10 || value.toString().length > 10){
				throw new Error('phone number is invalid')
			}
		}
	},
	email : {
		type : String,
		unique : true,
		required : true,
		trim : true,
		lowercase : true,
		validate(val){
			if(!validator.isEmail(val)){
				throw new Error('Email is invalid')
			}
		}
	},
	password : {
		type : String,
		required : true,
		trim : true,
		validate(val){
			if(val.length<=6){
				throw new Error('Password must be greater than six characters')
			}
		}
	},
	tokens : [{
		token : {
			type : String,
			required :true
		}
	}]
},{
	timestamps : true
})


adminSchema.methods.toJSON = function(){
	const admin = this
	const adminObj = admin.toObject()
	delete adminObj.password
	delete adminObj.tokens
	return adminObj
}

adminSchema.methods.generateAuthToken = async function (){
	const admin = this
	const token = jwt.sign({ _id:admin._id.toString() },'isthereasoftwaredeveloper')

	admin.tokens = admin.tokens.concat({token})
	await admin.save()

	return token
}



adminSchema.statics.findByCredentials = async (email,password)=>{
	const admin = await Admin.findOne({email})
	if(!admin) throw new Error('Unable to Login')

	const isMatch = await bcrypt.compare(password,admin.password)
	
	if(!isMatch) throw new Error('Unable to login')

	return admin;
}



adminSchema.pre('save',async function (next){
	const admin = this
	if(admin.isModified('password')){
		admin.password = await bcrypt.hash(admin.password,8)
	}
	next()
})


const Admin = mongoose.model('Admin',adminSchema)


module.exports = Admin