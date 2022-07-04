const HTTP = require("http");
const QS = require("querystring")
const FS = require("fs");
const DATA_STORE = require('nedb');
const FORMIDABLE = require("formidable")
const { addToDataBase, findAllInDataBase, removeFromDataBase } = require('./exports/functions.js')

//json
const MIME_TYPES = require("./json/file-extension-to-mime-types.json");

// database
const DATABASE = new DATA_STORE({
   filename: 'database/playlist.db',
   autoload: true
});

//ports
const PORT = 3000;

// --------------------------------------------
// server req, res
// --------------------------------------------

var server = HTTP.createServer(function (req, res) {
   req.url = decodeURIComponent(req.url).toString()

   const baseURL = 'http://' + req.headers.host + '/';
   const reqUrl = new URL(req.url, baseURL);
   let pathname = decodeURIComponent(reqUrl.pathname)

   switch (req.method) {
      case "GET":

         switch (pathname) {
            case "/":
               FS.readFile(`static/pages/home.html`, function (_error, data) {
                  res.writeHead(200, { 'Content-Type': `text/html;charset=utf-8` });
                  if (data != undefined) res.write(data);
                  res.end();
               })
               break
            case "/admin":
               FS.readFile(`static/pages/admin.html`, function (_error, data) {
                  res.writeHead(200, { 'Content-Type': `text/html;charset=utf-8` });
                  if (data != undefined) res.write(data);
                  res.end();
               })
               break
            default:
               FS.readFile(`static/${pathname}`, function (_error, data) {
                  if (data != undefined) {
                     let dataSize = Buffer.byteLength(data);

                     let range = req?.headers?.range ? req.headers.range.replace("bytes=", "").split('-') : ["", ""];

                     let bytes_start = range[0] != "" ? parseInt(range[0], 10) : 0
                     let bytes_end = range[1] != "" ? parseInt(range[1], 10) : dataSize;

                     let chunk_size = bytes_end - bytes_start;

                     if (chunk_size == Buffer.byteLength(data)) {
                        res.writeHead(200, {
                           'Content-Type': `${Filetype(pathname)};charset=utf-8`,
                           'Content-Length': dataSize,
                           "Access-Control-Allow-Origin": "*",
                           "Accept-Ranges": "bytes",
                        });
                        res.write(data);
                     }
                     else {
                        res.writeHead(206, {
                           'Content-Type': `${Filetype(pathname)};charset=utf-8`,
                           'Content-Length': chunk_size,
                           "Access-Control-Allow-Origin": "*",
                           "Accept-Ranges": "bytes",
                           "Content-Range": `bytes ${bytes_start}-${bytes_end - 1}/${dataSize}`
                        });
                        res.write(data.slice(bytes_start, bytes_end));
                     }
                  }

                  res.end();
               })
               break
         }
         break;

      case "POST":

         switch (pathname) {
            case "/getAlbumInfo":
               servResponse(req, res, (data) => {
                  const parsedData = JSON.parse(data)

                  let objJSON = {
                     covers: []
                  };

                  if (parsedData.action == "first") {
                     let albumNames = FS.readdirSync("static/albums");
                     objJSON["albumNames"] = albumNames.map(el => ({
                        album: el,
                        cover: getCoverPhoto(el)
                     }));
                     objJSON.covers = getAudioFiles(albumNames[0]);
                  }
                  else if (parsedData.action == "next") {
                     objJSON.covers = getAudioFiles(parsedData.albumName);
                  }
                  res.writeHead(200, { 'Content-Type': `application/json;charset=utf-8`, "Access-Control-Allow-Origin": "*" });
                  res.end(JSON.stringify(objJSON, null, 4));
               })
               break

            // -------------------------------
            // Database
            // -------------------------------
            case "/addToDataBase":
               servResponse(req, res, (data) => {
                  let finish = JSON.parse(data)
                  addToDataBase(req, res, finish, DATABASE)
               })
               break;
            case "/removeFromDataBase":
               servResponse(req, res, (data) => {
                  let finish = JSON.parse(data)
                  removeFromDataBase(finish, DATABASE, () => {
                     findAllInDataBase(req, res, DATABASE);
                  })
               })
               break
            case "/findAllInDataBase":
               findAllInDataBase(req, res, DATABASE);
               break

            //* -------------------------------
            //* upload files
            //* -------------------------------
            case "/postAudio":

               // --------------
               // formidable
               // --------------
               let dir = "./static/uploads";

               let form = new FORMIDABLE.IncomingForm();
               form.uploadDir = dir  // katalog na zuploadowane pliki
               form.keepExtensions = true
               form.multiples = true

               // --------------------
               // form functions
               // --------------------              

               form.parse(req, function (_err, fields, files) {

                  if (fields["album_name"] != undefined && fields["album_name"].match(/^[a-zA-Z0-9 ]+$/gm) != null) {
                     let count = 0;

                     (function f() {

                        let folderName = count == 0 ? fields["album_name"] : `${fields["album_name"]}${count}`
                        dir = `./static/albums/${folderName}`;
                        count++

                        if (!FS.existsSync(dir)) {
                           FS.mkdirSync(dir);
                        }
                        else f();
                     })()
                  }
                  else {
                     let count = 0;

                     (function f() {
                        let time = Date.now().toString(36);
                        let folderName = count == 0 ? time : `${time}${count}`
                        dir = `./static/albums/0_${folderName}`;
                        count++

                        if (!FS.existsSync(dir)) {
                           FS.mkdirSync(dir);
                        }
                        else f();
                     })()
                  }

                  if (files == {}) {
                     res.writeHead(200, { 'content-type': 'application/json;charset=utf-8' });
                     res.end(JSON.stringify([]))
                     return
                  }

                  // -------------------------------
                  // set nameTable
                  // -------------------------------
                  let file_names;

                  if (!Array.isArray(files.file)) {
                     file_names = [{
                        vanilla_name: files.file.path.replace(/\\/g, "/"),
                        real_name: files.file.name,
                     }]
                  }
                  else {
                     file_names = files.file.map(el => ({
                        vanilla_name: el.path.replace(/\\/g, "/"),
                        real_name: el.name
                     }))
                  }

                  // -------------------------------
                  // change name of file
                  // -------------------------------

                  let data_table = [];

                  file_names.forEach(el => {
                     data_table.push(el.real_name);
                     FS.renameSync(el.vanilla_name, `${dir}/${el.real_name}`)
                  })

                  res.writeHead(200, { 'content-type': 'application/json;charset=utf-8' });
                  res.end(JSON.stringify(data_table))
               });

               break;
            default:
               servResponse(req, res, (data) => {
                  let finish = QS.parse(data)

                  res.writeHead(200, { 'content-type': 'application/json;charset=utf-8' }); // nagłówek
                  res.end(JSON.stringify(finish)); // odsyłamy dane do klienta w postaci stringa
               });
               break
         }
         break;
   }
})


// --------------------------------------------
// functions
// --------------------------------------------

/**
 * @callback requestCallback
 * @param {{}} Data
 */

/**
 * 
 * @param {requestCallback} callback 
 */
function servResponse(req, _res, callback) {
   var allData = "";

   req.on("data", function (data) {
      allData += data;
   })

   req.on("end", function (_data) {
      try {
         callback(allData)
      }
      catch (err) {
         console.error(err)
      }
   })
}


function Filetype(url) {
   let FileType = url.split(".").pop();
   return MIME_TYPES[`.${FileType}`]
}

function getAudioFiles(albumName) {
   let musicAlbum = FS.readdirSync(`static/albums/${albumName}`)
      .filter(el => (el.split('.').pop() == "mp3"));

   let table = musicAlbum.map(el => {
      let fileInfo = FS.statSync(`static/albums/${albumName}/${el}`);
      return {
         albumName: albumName,
         name: el,
         size: fileInfo.size
      }
   })
   return table
}

function getCoverPhoto(albumName) {
   return FS.readdirSync(`static/albums/${albumName}`).find(el => {

      if (!FS.statSync(`static/albums/${albumName}/${el}`).isFile()) return false;

      let ext = el.split('.').pop()
      return (ext == "png" || ext == "jpg")
   });
}

// --------------------------------------------
// port listening
// --------------------------------------------
server.listen(PORT, () => console.log(`serwer startuje na porcie ${PORT}`));