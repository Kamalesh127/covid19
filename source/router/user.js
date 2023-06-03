const express = require('express')
const router  = new express.Router()
const User = require('../models/user')
const Vaccination = require('../models/vaccination')
const auth = require('../middleware/auth')

router.post('/users',async (req,res)=>{
	const user = new User(req.body)

	try{
		await user.save();
		const token = await user.generateAuthToken()

		res.status(201).send({user,token})
	} catch(e){
		res.status(400).send(e);
	}
})

router.post('/users/login',async (req,res)=>{
	try{
		const user = await User.findByCredentials(req.body.email,req.body.password)
		const token = await user.generateAuthToken()
		res.send({user,token})
	} catch(e){
		res.status(400).send()
	}
})


router.post('/users/logout',auth,async (req,res)=>{
	try{
		req.user.tokens = []
		await req.user.save()
		res.send()
	}catch(e){
		res.status(500).send()
	}
})

router.get('/users/me',auth, async (req,res)=>{
	res.send(req.user)
})

router.get('/users/vaccination_centres',auth, async (req,res)=>{
	try{
		const details  = await Vaccination.find()
		res.send(details)
	} catch(e){
		console.log(e)
		res.status(500).send()
	}
})

router.get('/users/book_centre/:centre', auth, async (req,res)=>{
	const centre_name = req.params.centre;
	try{
		const user_id = req.user._id;
		const centre = await Vaccination.findOne({centre_name});
		for(var i = 0; i < centre.user_details.length; i++){
			if(user_id == centre.user_details[i]) return res.send("Already slot booked");
		}
		if(centre.user_details.length >= 10) return res.send("Maximum limit reached")
		centre.user_details.push(user_id.toString())
		await centre.save()
		res.send(centre)
	} catch(e){
		res.status(500).send(e)
	}
})

router.patch('/users/me',auth,async (req,res)=>{
	const updates = Object.keys(req.body)
	const allowedupdates = ['name','email','password','age']

	const isValid = updates.every((updates)=> allowedupdates.includes(updates))

	if(!isValid){
		return res.status(400).send('invalid update request')
	}

	try{
		updates.forEach((update)=>req.user[update] = req.body[update])

		await req.user.save()

		res.send(req.user)
	} catch(e){
		res.status(400).send(e)
	}
})

router.delete('/users/me',auth,async (req,res) => {
	try{
		await req.user.deleteOne()
		res.send(req.user);

	} catch(e){
		res.status(500).send(e)
	}
})


module.exports = router




