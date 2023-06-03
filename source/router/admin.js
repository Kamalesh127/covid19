const express = require('express')
const router  = new express.Router()
const Admin = new require('../models/admin');
const Vaccination = require('../models/vaccination')
const adminauth = require('../middleware/adminauth')

router.post('/admin',async (req,res)=>{
	const admin = new Admin(req.body)

	try{
		await admin.save();
		const token = await admin.generateAuthToken()

		res.status(201).send({admin,token})
	} catch(e){
		res.status(400).send(e);
	}
})

router.post('/admin/login',async (req,res)=>{
	try{
		const admin = await Admin.findByCredentials(req.body.email,req.body.password)
		const token = await admin.generateAuthToken()
		res.send({admin,token})
	} catch(e){
		console.log(e);
		res.status(400).send()
	}
})

router.post('/admin/addCentre',adminauth, async (req,res)=>{
	const vacc = new Vaccination(req.body)

	try{
		await vacc.save();
		res.send(vacc)
	} catch(e){
		res.status(400).send(e);
	}
})

router.post('/admin/logout',adminauth,async (req,res)=>{
	try{
		req.admin.tokens = []
		await req.admin.save()
		res.send()
	}catch(e){
		res.status(500).send()
	}
})

router.delete('/centre/:id',adminauth,async (req,res)=>{
	const _id = req.params.id;
	try{
		const centre = await Vaccination.findOneAndDelete({_id})
		if(!centre) return res.status(404).send()

		res.send(centre)
	} catch(e){
		res.status(500).send(e)
	}
})


module.exports = router
