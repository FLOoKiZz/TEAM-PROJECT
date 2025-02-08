/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // remove field
  collection.fields.removeById("date2782324286")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "autodate2782324286",
    "name": "timestamp",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date2782324286",
    "max": "",
    "min": "",
    "name": "timestamp",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // remove field
  collection.fields.removeById("autodate2782324286")

  return app.save(collection)
})
