function currentTime() {
  let date = new Date(); //creating object of date class
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();
  hour = updateTime(hour);
  min = updateTime(min);
  sec = updateTime(sec);

  let timer = setTimeout(function () {
    currentTime();
  }, 1000); // setting the timer

  //AM and PM
  let midday = "AM";
  midday = hour >= 12 ? "PM" : "AM";

  //12 hour time
  hour = hour == 0 ? 12 : hour > 12 ? hour - 12 : hour;
  $("#timer").html(hour + " : " + min + " : " + sec + " " + midday);
}

function updateTime(timeValue) {
  if (timeValue < 10) {
    return "0" + timeValue;
  } else {
    return timeValue;
  }
}

currentTime();
