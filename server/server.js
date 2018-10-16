const express = require('express');
const app = express()
const PORT = process.env.EXPRESS_CONTAINER_PORT || 4000 
const path = require('path')
const Items = require('./db/models/Items.js');
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '../build')))

app.get('/', () => {
  res.sendFile('../build/index.html')
})

app.get('/items', (req, res) => {
  // res.json({
  //   items: [{
  //       id: 1,
  //       name: 'A Large Healing Potion',
  //       weight: 0.1,
  //       type: 'consumable'
  //     },
  //     {
  //       id: 2,
  //       name: 'Wirts Leg',
  //       weight: 10,
  //       type: 'weapon'
  //     },
  //     {
  //       id: 3,
  //       name: 'Dreamwalker Spaulders',
  //       weight: 2,
  //       type: 'armor'
  //     }
  //   ]
  // })
  Items
    .fetchAll()
    .then( items => {
      res.json(items.serialize())
    }) 
    .catch( err => {
      console.log('error', err)
    })
})

app.post( '/', (req, res) => {
  const newItem = {
    // id: req.body.id,
    task: req.body.task,
    description: req.body.description,
    priority: req.body.priority,
    type: req.body.type,
    sortingid: req.body.sortingid
  }

  Items
    .forge(newItem)
    .save()
    .then((data) => {
      return Items.fetchAll()
      console.log(data, 'data FUCK')
    })
    .then ( newItems => {
      res.json(newItems.serialize())
    })
    .catch(err => {
      console.log('error', err)
      res.json(err)
    })
})

app.delete( '/:id', (req, res) => {
const id = req.body.item.id;

  Items
    .where({ id })
    .destroy()
    .then(() => {
      return Items.fetchAll()
    })
    .then ( newItems => {
      res.json(newItems.serialize())
    })
    .catch(err => {
      res.json(err);
    })
})

app.put( '/:id', (req, res) => {

  const id = parseInt(req.body.item.id);

  const newItem = {
    // id: req.body.item.id,
    task: req.body.item.task,
    description: req.body.item.description,
    priority: req.body.item.priority,
    type: req.body.item.type
  }
  console.log(req.body.item, 'this is getting annoying' )

  Items
  .where({id})
  .fetch()
  .then(update => {
    return update.save(newItem)
  })
  .then((data) => {
    return Items.fetchAll()
  })
  .then ( newItems => {
    res.json(newItems.serialize())
  })
  .catch(err => {
    console.log('error', err)
    res.json(err)
  })
})

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`)
})
