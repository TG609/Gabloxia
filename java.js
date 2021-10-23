lastResult = null;
lastData = {
	avatar: 0,
	username: "",
	discriminator: 0,
};
// Credit to https://stackoverflow.com/a/18278346/16367360

function loadJSON(path, success, error) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success) success(JSON.parse(xhr.responseText));
			} else {
				if (error) error(xhr);
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.send();
}

function statusUpdater() {
	discordID = "852643033325371394";
	loadJSON("https://api.lanyard.rest/v1/users/" + discordID, function (data) {
		avatar = document.getElementById("avatar");
		if (lastData.avatar != avatar) {
			avatarLink =
				"https://cdn.discordapp.com/avatars/" +
				discordID +
				"/" +
				data.data.discord_user.avatar +
				"?size=1024";
			avatar.src = avatarLink;
			lastData.avatar = avatar;
		}
		if (lastData.username != data.data.discord_user.username) {
			username = document.getElementById("username");
			username.innerHTML = data.data.discord_user.username;
			lastData.username = data.data.discord_user.username;
		}
		if (lastData.discriminator != data.data.discord_user.discriminator) {
			discriminator = document.getElementById("discrim");
			discriminator.innerHTML = "#" + data.data.discord_user.discriminator;
			lastData.discriminator = data.data.discord_user.discriminator;
		}

		if (data != lastResult) {
			statusText = document.getElementById("status");
			statusIcon = document.getElementById("status-icon");
			blobcolor = "";
			activitiesList = [];
			if (data.data.discord_status == "online") {
				statusType = "Online";
				if (data.data.listening_to_spotify) {
					activitiesList.push("Listening to Spotify");
				}
				textcolor = "0,255,0";
				statusIcon.className = "blob green";
			} else if (data.data.discord_status == "idle") {
				statusType = "Idle";
				textcolor = "255,165,0";
				statusIcon.className = "blob orange";
			} else if (data.data.discord_status == "dnd") {
				statusType = "Online";
				textcolor = "255,0,0";
				statusIcon.className = "blob red";
			} else if (data.data.discord_status == "offline") {
				statusType = "Offline";
				textcolor = "128,128,128";
				statusIcon.className = "blob gray";
			}

			// Check for activities
			if (
				data.data.activities.length != 0 &&
				(data.data.discord_status == "online" || data.data.discord_status == "dnd")
			) {
				for (let i = 0; i < data.data.activities.length; i++) {
					currentActivity = data.data.activities[i];
					if (
						currentActivity.name != "Spotify" &&
						currentActivity.name != "Custom Status"
					) {
						if (currentActivity.name == "Stadia") {
							if (currentActivity.state != null) {
								activitiesList.push(
									currentActivity.details + " " + currentActivity.state + " on Stadia"
								);
							} else {
								activitiesList.push(currentActivity.details + " on Stadia");
							}
						} else {
							if (currentActivity.details != null) {
								activityname = currentActivity.name;
								if (activityname == "Visual Studio Code") {
									activitiesList.push(currentActivity.details + " in VSCode");
								} else if (["Disney+", "YouTube"].includes(activityname)) {
									activitiesList.push(currentActivity.details + " on " + activityname);
								} else {
									activitiesList.push(activityname + " • " + currentActivity.details);
								}
							} else {
								activitiesList.push(currentActivity.name);
							}
						}
					}
				}

				activitiesList = activitiesList.join(", ");
			}
		}
		seperator = " • ";
		console.log(screen.width);
		if (document.documentElement.clientWidth < 800) {
			statusIcon.style.display = "none";
			statusType =
				"<p style='display: inline-block;color: rgb(" +
				textcolor +
				")';>" +
				statusType +
				"</p><br><br>";
			seperator = " ";
		} else {
			statusIcon.style.display = "block";
		}
		lastResult = data;
		if (activitiesList != "") {
			statusText.innerHTML = statusType + seperator + activitiesList;
		} else {
			statusText.innerHTML = statusType;
		}
	});
}

statusUpdater();
// Fetch discord
setInterval(statusUpdater, 5000);