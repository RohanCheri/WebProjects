document.addEventListener('DOMContentLoaded', domLoaded);
var date, color, orange, black, time, cClass;
var timeHead, signaled;

// cookiesSet variable determines if all cookies have been set!
var endDate = new Date(), cDate = new Date();
if(cDate.getMonth() < 6){
    endDate.setFullYear(cDate.getFullYear(), 6, 1);
}
else{
    endDate.setFullYear(cDate.getFullYear() + 1, 6, 1);
}

//Modal Variables
var modal, span;

var teachers = ["Crystal Hawes", "Vicki Browne", "Jeral Scofield", "Robin Mccarter", "Lunch", "Lunch", "Trung Vong", "William Lyons", "Nicholas Eagle"];

var classLinks = ["https://scps.webex.com/meet/hawescl", "https://scps.webex.com/meet/brownevj", "https://scps.webex.com/meet/scofiejh", "https://scps.webex.com/meet/fitzwarj", null, null,
"https://scps.webex.com/meet/DrVong", "https://scps.webex.com/meet/lyonswr", "https://scps.webex.com/meet/eaglena"];

var classTimesSpliced, classTimes = [], schoolEndTime;
document.addEventListener('DOMContentLoaded', domLoaded);

function domLoaded(){
    date = new Date();

    if(date.getDay() === 3){ // Hours and minutes
        classTimesSpliced = [[7, 10], [8, 45], [10, 20], [10, 50], [12, 25], [13, 20]];
    }
    else{
        classTimesSpliced = [[7, 10], [9, 7], [10, 59], [11, 24], [13, 12], [14, 20]]
    }

    for(let i = 0; i < classTimesSpliced.length; i++){
        let val = classTimesSpliced[i][0] * 60 + classTimesSpliced[i][1];
        classTimes.push(val);
    }

    schoolEndTime = classTimes[classTimes.length - 1] - 10;
    signaled = false;

    orange = document.getElementById("Orange");
    black = document.getElementById("Black");

    time = document.getElementById("time");
    cClass = document.getElementById("class");
    timeHead = document.getElementById("timeHead");

    modal = document.getElementById("myModal");
    span = document.getElementsByClassName("close")[0];

    // cookieInitialization();

    orange.addEventListener("click", function(){
       color = "orange";
       hideButtons();
    });

    black.addEventListener('click', function(){
        color = "black";
        hideButtons();
    });

    span.addEventListener('click', function(){
       modal.style.display = 'none';
    });

    window.addEventListener('click', function(e){
       if(e.target === modal){
           modal.style.display = 'none';
       }
    });
}

function cookieInitialization(){
    alert(checkCookie('cookiesSet'))
    if(!checkCookie("cookiesSet")){
        modal.style.display = 'block';
    }
}

function setCookie(name, value, date){
    if(date == null){
        document.cookie = name + "=" + value + ";expires=" + endDate.toUTCString() + ";path=/";
    }
    else{
        document.cookie = name + "=" + value + ";expires=" + date.toUTCString() + ";path=/";
    }
}

function deleteCookie(name){
    var delDate = new Date();
    delDate.setFullYear(1980);
    setCookie(name, "deleted", delDate)
}

function checkCookie(name){
    let res = getCookie(name);
    if(res === ""){
        return false;
    }

    return true;
}

function getCookie(name){
    name += "=";
    let decodedCookieStr = decodeURIComponent(document.cookie);
    let cookies = decodedCookieStr.split(";");

    for(let i = 0; i < cookies.length; i++){
        let curr = cookies[i];
        curr = curr.trim();

        if(curr.indexOf(name) == 0){
            return curr.substring(name.length, curr.length).trim();
        }
    }

    return "";
}

function hideButtons(){
    orange.style.display = "none";
    black.style.display = "none";
    document.getElementById("title").style.display = "none";
    updateTime();
}

function updateTime(){
    date = new Date();
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
            if(cTime <= classTimes[index]){
                break;
            }
        }

        if(classTimes[index] - cTime == 0){
            index += 1;
        }

        if(classTimes[index] - cTime <= 10){
            if(classTimes[index] - cTime < 3 && !signaled){
                signaled = true;
                alert("Your class with " + teachers[calcIndex(index)] + " is starting soon!");
            }

            setTime(classTimes[index] - cTime);
            setClass(index);
            timeHead.innerHTML = "Time left until class starts:";
        }else{
            signaled = false;

            setTime(classTimes[index] - 10 - cTime);
            setClass(index - 1);
            timeHead.innerHTML = "Time left until class ends:";
        }
    }
}

function setTime(extraTime){
    extraTime -= 1;
    let eHours = Math.floor(extraTime / 60);
    let eMin = extraTime - eHours * 60;

    let outTimeStr = "";

    if(eHours > 0){
        outTimeStr += eHours + " Hour and ";
    }

    if(eMin > 0){
        outTimeStr += eMin + " Minutes ";
    }

    outTimeStr += (60 - date.getSeconds()) + " Seconds"

    time.innerHTML = outTimeStr;
}

function setClass(index){
    index = calcIndex(index);
    cClass.innerHTML = teachers[index];

    if(teachers[index] != "Lunch"){
        cClass.href = classLinks[index];
    }
}

function calcIndex(index){
    if(color == "orange"){
        index *= 2;
    }
    else if(color == "black"){
        index = 1 + index * 2;
        if(index == 9){index = 8};
    }

    return index;
}

setInterval(function(){
    if(color == "orange" || color == "black"){
        updateTime();
    }
}, 1000);