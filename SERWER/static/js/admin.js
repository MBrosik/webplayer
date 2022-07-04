window.onload = () => {

   // -------------------
   // html - set defalut
   // -------------------
   document.querySelector("html").ondragover = function (e) {
      e.preventDefault(); // usuwa domyślne zachowanie strony po wykonaniu zdarzenia, warto zakomentować i sprawdzić
      e.stopPropagation(); // zatrzymuje dalszą propagację zdarzenia, warto zakomentować i sprawdzić
   }

   document.querySelector("html").ondrop = function (e) {
      e.preventDefault();
      e.stopPropagation();
   }

   /**
    * On drag enter and leave
    */
   document.querySelector("html").ondragenter = function (e) {
      e.preventDefault(); // usuwa domyślne zachowanie strony po wykonaniu zdarzenia, warto zakomentować i sprawdzić
      e.stopPropagation(); // zatrzymuje dalszą propagację zdarzenia, warto zakomentować i sprawdzić

      document.getElementById("upload-place").innerHTML = "Upuść tutaj";
   }

   document.querySelector("html").ondragleave = function (e) {
      if (e.currentTarget.contains(e.relatedTarget)) {
         return;
      }
      e.preventDefault(); // usuwa domyślne zachowanie strony po wykonaniu zdarzenia, warto zakomentować i sprawdzić
      e.stopPropagation(); // zatrzymuje dalszą propagację zdarzenia, warto zakomentować i sprawdzić

      document.getElementById("upload-place").innerHTML = "Przeciągnij tutaj pliki";
   }

   // -------------------
   // div - drag
   // -------------------
   document.querySelector("#upload-place").ondragover = function (e) {
      e.stopPropagation();
      e.preventDefault();
   }

   /**
    * on drag enter and leave
    */
   document.querySelector("#upload-place").ondragenter = function (e) {
      e.stopPropagation();
      e.preventDefault();

      document.getElementById("upload-place").innerHTML = "Upuść";
   }

   document.querySelector("#upload-place").ondragleave = function (e) {
      e.stopPropagation();
      e.preventDefault();

      document.getElementById("upload-place").innerHTML = "Upuść tutaj";
   }

   // -------------------
   // div - drop
   // -------------------
   /**
    * @type {HTMLInputElement}
    */
   let input = document.getElementById("upload-input");

   let input_lis = (e) => {

      if (e.currentTarget.value.match(/^[a-zA-Z0-9 ]+$/gm) != null) {
         e.currentTarget.style.borderColor = "white";
      }
      else {
         e.currentTarget.style.borderColor = "red";
      }
   }

   input.oninput = input_lis;
   input.onfocus = input_lis;

   document.querySelector("#upload-place").ondrop = function (e) {
      e.stopPropagation();
      e.preventDefault();

      // ------------------------
      // prepare files for send
      // ------------------------
      var files = e.dataTransfer.files;

      var fd = new FormData();
      for (const key in files) {
         fd.append('file', files[key]);
      }
      // -----------------------
      // album name
      // -----------------------
      let album_name = document.getElementById("upload-input").value;

      if (album_name.match(/^[a-zA-Z0-9 ]+$/gm) == null) {
         alert("Źle napisana nazwa folderu")
         return
      }

      fd.append("album_name", album_name)


      // ------------------------
      // info about uploading
      // ------------------------
      let uploading_window = document.createElement('div');
      uploading_window.id = "upload-window";
      uploading_window.innerHTML = "Upload..."
      document.body.appendChild(uploading_window);


      fetch("/postAudio", {
         method: "POST",
         body: fd,
      })
         .then(res => res.json())
         .then(data => {
            // ------------------------
            // remove info
            // ------------------------
            uploading_window.remove()

            // ------------------------
            // info about files
            // ------------------------
            let upload_files_list_container = document.getElementById("upload-files-list");
            upload_files_list_container.innerHTML = "";


            data.forEach(el => {
               let ext_table = ["png", "jpg", "mp3"]
               let extension = el.split(".").pop();

               // create content
               let file_content = document.createElement("div");
               file_content.classList.add("file-content");

               let img = document.createElement("img");
               img.classList.add("file-img")
               img.src = `/images/file_icons/${ext_table.includes(extension) ? extension : "another"}.png`
               file_content.appendChild(img);

               let file_name_content = document.createElement("div");
               file_name_content.classList.add("file-name-content");
               file_name_content.innerHTML = el;
               file_content.appendChild(file_name_content);

               upload_files_list_container.appendChild(file_content);
            })
         })
         .catch(error => {
            alert("Wrzuciłeś niewłaściwy plik")
            console.error('error :>> ', error);
            uploading_window.remove()
         })
   }
}