<template >
	<div
		class="song-container"
		:style="computedBackgroundColor"
		@mouseover="MouseOverMusicContainer"
		@mouseout="MouseOutMusicContainer"
	>
		<!-- ------------------ -->
		<!-- song informations -->
		<!-- ------------------ -->
		<div class="song-author">{{ musicObject.albumName }}</div>
		<div class="song-name">{{ musicObject.name }}</div>
		<div class="song-size">{{ fileSize }}</div>

		<!-- ----------------- -->
		<!-- play button -->
		<!-- ----------------- -->
		<div class="song-controller-container">
			<button
				class="song-controller-button"
				:style="songControllerImages"
				@click="clickControllerButton"
			></button>
		</div>
		<div class="song-add-to-playlist-container">
			<button
				class="song-add-to-playlist-button"
				:style="songAddToPlaylistCSS"
				@click="clickAddToPlaylistButton"
			></button>
		</div>
	</div>
</template>

<script>
// --------------------
// vue component
// --------------------
export default {
	props: ["musicObject", "arrayIndex"],
	data() {
		return {
			seeButton: false,
		};
	},

	computed: {
		// ------------------------------
		// information about file size
		// ------------------------------
		fileSize() {
			return `${Number(this.musicObject.size / 1024 / 1024).toFixed(2)} MB`;
		},

		// ------------------------------
		// check if that piece of music
		// is selected and played
		// ------------------------------
		computedBool() {
			return (
				this.music_on_controller &&
				this.selectedMusic.songName == this.musicObject.name
			);
		},

		// --------
		// css
		// --------
		songControllerImages() {
			return {
				backgroundImage: `url('http://localhost:3000/images/${
					this.computedBool ? "pause.png" : "play.png"
				}')`,
				opacity: this.seeButton ? 1 : 0,
			};
		},
		songAddToPlaylistCSS() {
			return {
				opacity: this.seeButton ? 1 : 0,
				backgroundImage: `url("http://localhost:3000/images/${
					this.selected_custom_album
						? "remove_from_playlist.png"
						: "add_to_playlist.png"
				}")`,
			};
		},
		computedBackgroundColor() {
			return {
				backgroundColor:
					this.selectedMusic.songName == this.musicObject.name
						? "rgb(68, 108, 146)"
						: "white",
				color:
					this.selectedMusic.songName == this.musicObject.name
						? "white"
						: "black",
			};
		},

		// ----------------------------------------
		// get music information form store/state
		// ----------------------------------------
		music_on_controller() {
			return this.$store.state.music_on;
		},
		selectedMusic() {
			return this.$store.state.selectedMusic;
		},

		selected_custom_album() {
			return this.$store.state.selected_custom_album;
		},
	},

	methods: {
		// ----------------------------
		// check if mouse is over or out
		// of piece Container
		// ----------------------------
		MouseOverMusicContainer() {
			this.seeButton = true;
		},
		MouseOutMusicContainer() {
			this.seeButton = false;
		},

		// --------------------
		// play music button
		// --------------------
		clickControllerButton() {
			if (this.computedBool) {
				this.$store.commit("playPauseMusic", [false]);
			}

			// -------------------------------------------
			// check if music from that piece is selected
			// if not, then send link to music
			// -------------------------------------------
			else {
				this.$store.commit("playPauseMusic", [
					true,
					this.selectedMusic.songName == this.musicObject.name
						? null
						: `http://localhost:3000/albums/${this.musicObject.albumName}/${this.musicObject.name}`,
				]);

				this.$store.commit("changeSelectedMusic", [
					this.musicObject.name,
					this.musicObject.albumName,
					`http://localhost:3000/albums/${this.musicObject.albumName}/${this.musicObject.name}`,
					this.arrayIndex,
				]);
			}
		},

		// -----------------------
		// add to playlist
		// -----------------------
		clickAddToPlaylistButton() {
			if (this.selected_custom_album) {
				this.$store.dispatch("removeFromPlaylist", this.musicObject);
			} else {
				this.$store.dispatch("addToPlaylist", this.musicObject);
			}
		},
	},
};
</script>

<style scoped>
.song-container {
	display: grid;
	grid-template-columns: 20% auto 20% 40px 60px;
	padding: 5px;
}
.song-container:hover {
	background-color: rgb(68, 108, 146) !important;
   color: white !important;
}
.song-container div {
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	cursor: context-menu;

	padding-left: 2px;
	padding-right: 2px;
}

.song-controller-button {
	cursor: pointer;
	padding: 0;
	outline: 0;
	border: 0;
	width: 30px;
	height: 30px;
	background-size: 100% 100%;
	background-color: transparent;
}
.song-add-to-playlist-button {
	cursor: pointer;
	padding: 0;
	outline: 0;
	border: 0;
	width: 30px;
	height: 30px;
	background-size: 100% 100%;
	background-color: transparent;
}
</style>