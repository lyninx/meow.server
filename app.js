let request  = require('request')
let mongoose = require('mongoose')
let crypto 	 = require('crypto')

let cat      = require('./model/cat.js')

const POLLING_RATE = 16
const LISTINGS_URL = 'https://www.torontohumanesociety.com/api/api.php?action=getAnimalsForSpeciesId&id=2&stageId=2'
const ANIMAL_URL = 'https://www.torontohumanesociety.com/api/api.php?action=getListingForAnimalId&id='

module.exports = {
	start() {
		this._bind('fetch_cats', 'fetch_cat', 'update', 'update_cat', 'generate_hash')
		this.fetch_cats()
		setInterval(this.fetch_cats, POLLING_RATE*1000)
	},
    _bind(...methods) {
        methods.forEach((method) => this[method] = this[method].bind(this))
    },
	fetch_cats() {
		request(LISTINGS_URL, (error, response, body) => {
			if(error) return
		 	let cats = JSON.parse(body).AdoptableSearchResult.XmlNode
		 	cats.forEach((elem) => {
		 		if(elem) { 
		 			this.fetch_cat(elem.adoptableSearch.ID)
		 		}
		 	})
		})
	},
	fetch_cat(id) {
		request(ANIMAL_URL+id, (error, response, body) => {
			if(error) return
			try {
				let cat = JSON.parse(body).AdoptableDetailsResult.adoptableDetails
				this.update(id, cat)
			} 
			catch(e) {
				console.log(e)
			}
		})
	},
	update(cat_id, cat_data) {
		cat.findOne({cat_id: cat_id}, (err, c) => {	
			if (err) return next(err)
			if(c) {
				if(c.hash != this.generate_hash(JSON.stringify(cat_data))){
					this.update_cat(cat_data)
				}
			} else {
				this.update_cat(cat_data)
			}
		})
	},
	update_cat(c){
		cat_data = JSON.stringify(c)
		let obj = {
			updated: Date.now(),
			cat_id: c.ID,
			hash: this.generate_hash(cat_data),
			cat: cat_data
		}
		cat.create(obj, (err, c) => {	
			if (err) return next(err)
			console.log(c)
		})		
	},
	generate_hash(data){
		return crypto.createHash('md5').update(data).digest("hex")
	}
}