const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const vaccinationSchema = new mongoose.Schema({
	// centre_id : {
	// 	type : String,
	// 	required : true,
	// 	triem : true
	// },
	centre_name : {
		type : String,
		required : true,
		trim : true
	},
	timing :{
		type : String,
		required : true,
		trim :true,
	},
	user_details : [],
	phone_no : {
		type : Number,
		required : true,
		validate(value){
			if(value.toString().length < 10 || value.toString().length > 10){
				throw new Error('phone number is invalid')
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
	}
},{
	timestamps : true
})

// vaccinationSchema.statics.saveUserID = async (centre, user_id)=>{
// 	const  = await User.findOne({email})
// 	if(!user) throw new Error('Unable to Login')

// 	const isMatch = await bcrypt.compare(password,user.password)
	
// 	if(!isMatch) throw new Error('Unable to login')

// 	return user;
// }


const Vaccination = mongoose.model('Vaccination',vaccinationSchema)


module.exports = Vaccination