const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true,
		trim : true
	},
	age :{
		type : Number,
		required : true,
		validate(value){
			if(value<0){
				throw new Error('Age must be +ve number')
			}
		}
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
	city : {
		type : String,
		required : true,
		trim : true
	},
	state : {
		type : String,
		required : true,
		trim : true
	},
	postal_code : {
		type : Number,
		required : true,
		trim : true,
		validate(val){
			if(val.toString().length < 6 || val.toString().length > 6){
				throw new Error('postal code must be equal to six characters')
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


userSchema.methods.toJSON = function(){
	const user = this
	const userObj = user.toObject()
	delete userObj.password
	delete userObj.tokens
	return userObj
}

userSchema.methods.generateAuthToken = async function (){
	const user = this
	const token = jwt.sign({ _id:user._id.toString() },'dogscanjumpandwalk')

	user.tokens = user.tokens.concat({token})
	await user.save()

	return token
}



userSchema.statics.findByCredentials = async (email,password)=>{
	const user = await User.findOne({email})
	if(!user) throw new Error('Unable to Login')

	const isMatch = await bcrypt.compare(password,user.password)
	
	if(!isMatch) throw new Error('Unable to login')

	return user;
}



userSchema.pre('save',async function (next){
	const user = this
	if(user.isModified('password')){
		user.password = await bcrypt.hash(user.password,8)
	}
	next()
})

userSchema.pre('remove',async function(next){
	const user = this

	await Task.deleteMany({owner:user._id})

	next()
})

const User = mongoose.model('User',userSchema)


module.exports = User