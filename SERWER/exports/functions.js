module.exports = {
   addToDataBase(_req, res, data, database) {
      let doc = {
         albumName: data.albumName,
         name: data.name,
         size: data.size
      }

      database.findOne({ ...doc }, (_err, doc1) => {
         res.writeHead(200, { 'content-type': 'application/json;charset=utf-8', "Access-Control-Allow-Origin": "*" });

         if (doc1 == undefined) {
            database.insert(doc, (_err, newDoc) => {
               res.end(JSON.stringify({ action: true }))
            })
         }
         else {
            res.end(JSON.stringify({ action: false }))
         }
      })
   },

   removeFromDataBase(data, database, callback) {
      let doc = {
         albumName: data.albumName,
         name: data.name,
         size: data.size
      }

      database.remove({ ...doc }, {}, (_err, _numRemoved) => {
         callback();
      })
   },

   findAllInDataBase(_req, res, database) {
      database.find({}, (_err, doc) => {
         let newDoc = doc.map(el => ({
            albumName: el.albumName,
            name: el.name,
            size: el.size
         }))
         res.writeHead(200, { 'content-type': 'application/json;charset=utf-8', "Access-Control-Allow-Origin": "*" });
         res.end(JSON.stringify(newDoc))
      })
   }
};