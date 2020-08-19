document.addEventListener('DOMContentLoaded', domLoaded);
var date, color, orange, black, time, cClass;
var timeHead;

var teachers = ["Crystal Hawes", "Vicki Browne", "Jeral Scofield", "Robin Mccarter", "Trung Vong", "William Lyons", "Nicholas Eagle"];

var classLinks = ["https://scps.webex.com/meet/hawescl", "https://scps.webex.com/meet/brownevj", "https://scps.webex.com/meet/scofiejh", "https://scps.webex.com/meet/fitzwarj",
"https://scps.webex.com/meet/DrVong", "https://scps.webex.com/meet/lyonswr", "https://scps.webex.com/meet/eaglena"];

var classTimesSpliced = [[7, 10], [9, 2], [11, 24], [23, 50], [24, 20]]; //Hours and minutes
var classTimes = [];
var schoolEndTime = classTimesSpliced[classTimesSpliced.length - 1] - 10;

for(var i = 0; i < classTimesSpliced.length; i++){
    var val = classTimesSpliced[i][0] * 60 + classTimesSpliced[i][1];
    classTimes.push(val);
}

document.addEventListener('DOMContentLoaded', domLoaded);

function domLoaded(){
    date = new Date();

    orange = document.getElementById("Orange");
    black = document.getElementById("Black");

    time = document.getElementById("time");
    cClass = document.getElementById("class");
    timeHead = document.getElementById("timeHead");

    orange.addEventListener("click", function(){
       color = "orange";
       hideButtons();
    });

    black.addEventListener('click', function(){
        color = "black";
        hideButtons();
    });
}

function hideButtons(){
    orange.style.display = "none";
    black.style.display = "none";
    document.getElementById("title").style.display = "none";
}

function updateTime(){
    var cTime = date.getHours() * 60 + date.getMinutes();

    if(cTime >= schoolEndTime){
        time.innerHTML = "School is over. Please get a life :)";
    }
    else if(cTime <= classTimes[0] - 10){
        time.innerHTML = "School has not yet begun. Slither on to ur bed now sir";
    }
    else{
        var index = 0;
        for(index; index < classTimes.length; index++){
            if(cTime < classTimes[index]){
                break;
            }
        }

        if(classTimes[index] - cTime < 10){
            setTime(classTimes[index] - cTime);
            setClass(index);
            timeHead.innerHTML = "Time left until class starts:";
        }else{
            setTime(classTimes[index] - 10 - cTime);
            setClass(index - 1);
            timeHead.innerHTML = "Time left until class ends:";
        }
    }
}

function setTime(extraTime){
    var eHours = Math.floor(extraTime / 60);
    var eMin = extraTime - eHours * 60;

    var outTimeStr = "";

    if(eHours != 0){
        outTimeStr += eHours + " Hour and ";
    }

    outTimeStr += eMin + " Minutes";

    time.innerHTML = outTimeStr;
}

function setClass(index){
    if(color == "orange"){
        index *= 2;
    }
    else if(color == "black"){
        index = 1 + index * 2;
        if(index == 7){index = 6};
    }

    cClass.innerHTML = teachers[index];
    cClass.href = classLinks[index];
}

var updateTimeInterval = setInterval(function(){
    if(color == "orange" || color == "black"){
        updateTime();
    }
}, 1000);