# Webplayer


## Interface

- webplayer site 👉 [localhost:8080](http://localhost:8080/)
![image](https://user-images.githubusercontent.com/63966121/177172227-bdb89eff-0775-4e28-b38d-8de811a5d7fc.png)

- admin site 👉 [localhost:3000/admin](http://localhost:3000/admin)
![image](https://user-images.githubusercontent.com/63966121/177172639-80fde31d-9fdb-4807-a694-79332ad1b2bc.png)

## Installation

- in project directory
```
git init
git remote add origin https://github.com/MBrosik/webplayer.git
git pull origin master
```
- split terminal 
- in first terminal
```
cd .\KLIENT
npm i
npm run serve
```
- in second terminal
```
cd .\SERWER
npm i
node server.js
```

## Features
- Listening to music
- Creating playlist
- Looping/shuffle
- Volume change
- Add new albums and music at [localhost:3000/admin](http://localhost:3000/admin)

## Technologies

### Frontend
![vue](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![sass](https://img.shields.io/badge/SASS-CC6699?logo=Sass&logoColor=white&style=for-the-badge)

### Backend
![nodejs](https://img.shields.io/badge/Node.js-339933?logo=Node.js&logoColor=white&style=for-the-badge)
![nedb](https://img.shields.io/badge/nedb-white?logo=data:image/png;base64,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&logoColor=white&style=for-the-badge)