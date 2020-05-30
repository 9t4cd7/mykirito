//自動行動、隨機延遲、機率隨機行動、按鈕樣式偵測、文字偵測、反腳本偵測 腳本
//新增破解反腳本驗證（使用樓層獎勵漏洞）

//最重要的東西
var target = 7; //目標選擇，1~7
var timeshow = 1; //如果條成0，就不會顯示時間，1的話會顯示時間
var looptime = 11000; //一個循環幾毫秒
var cdtime = 100; //戰鬥的CD，單位秒
var intiP = -2; // 模式選擇 0是每個循環都點(危險) -2是CD到了才點(根據上面兩個進行判定)
var auto_floor = 1;//自動領樓層獎勵（如果開啟破解反腳本會自動關閉此功能）

//必須的功能們，各功能皆為 1:開啟 0:關閉

//偵測驗證並發信&通知
var hc_check = 1; //開啟偵測驗證
var hc_mail = 0; //開啟驗證出現後發信
var hc_notify = 1;//開啟驗證出現後發網頁通知

//破解反腳本驗證(沒啥用 ㄅ欠)
var anti_check = 0;//開啟破解反腳本

function emailsend(){
    Email.send({
        SecureToken : "68a7986c-5829-42ce-9458-a552df2f9276",
        To : "你的email",  /*填入你的EMAIL，寄信是用禾的GMAIL母咪*/
        From : "astria@astriaworks.moe",
        Subject : "我的桐人跳反腳本偵測了 ID: "+playername[0].textContent,
        Body : "我的桐人跳反腳本偵測了 ID: "+playername[0].textContent
    }).then(
      message => alert(message)
    );
}


//非必須功能們，各功能皆為 1:開啟 0:關閉

//隨機延遲，極度推薦開
var ranDelay = 1; //開啟隨機延遲才點擊
var ranDelayRange = 10; //延遲的時間範圍 單位秒

//機率隨機行動，推薦開
var ranAct = 1; //開啟後會有一定機率隨機行動
var ranActChance = 0.1 //隨機行動的機率

//高級偵測 ( 按鈕樣式偵測 )，開發中，開不開看個人
var highLevelCheck = 1; //開啟高級偵測選項，會偵測hidden 按鈕文字 大小
var highLevelShow = 1; // 是否顯示高級偵測輸出訊息

//mega選項 ( 偵測行動後文字 ) ，推薦開
var megaCheck = 1; //開啟mega選項，這東西會偵測行動後的第一行文字，如果連續megaFail次偵測失敗就會自動暫停腳本，如果暫停結束再次偵測失敗就會繼續暫停腳本
var megaClick = 0; //是否偵測失敗後再次點擊事件
var megaTime = 60; //自動暫停時間，單位分鐘
var megaFail = 5; //連續幾次失敗自動暫停腳本

//高級偵測與mega選項共同使用項
var reClickTime = 5;//每個偵測失敗後的重新點擊時間, 單位秒


/////這東西是執行中更改項//////
var pause = -2;
//0是不暫停，looptime豪秒點一次「「「手動輸入pause = 數字，進行暫停」」」
//=1或以上的話是暫停輸入的數字的分鐘，然後變成intiP
//=-1的話可以暫停到下次可行動的時候自動點擊 這個沒啥用 可忽略


/////以上是可調整項 下面的不要動////
var timecount = 0;
var tempcount = 0;
var flag = 0;
var cdCount = 0;
var ranDelayTime = 1;
var btn2;
var playername;
var tempP = 0;
var failTime = 0;
var megaStart = 0;
var succC = 0;
var cflag = 0;
var cflag2 = 0;
var hc_checkf = 0;
var hc_min = 0; var hc_sec = 0; var hc_hour = 0;
var hc_flag = 0;
///主程式區塊
intiSet();

(function loop() {
    setTimeout(function () {
        var dt = new Date();
        var min = dt.getMinutes();
        var sec = dt.getSeconds();
        var hour = dt.getHours();
        btn2 = document.getElementsByClassName("sc-AxgMl llLWDd");
        playername = document.getElementsByClassName("sc-AxhUy dRdZbR");
        if(ranDelay == 1) ranDelayTime = 10; else ranDelayTime = 0;
        if(pause == 0 || pause == -2) if( pause != intiP ) pause = intiP;
        timecount += (looptime / 1000);
        cdCount += (looptime / 1000);
        if (hc_check == 1 ) {
            hc_checkf = document.getElementsByName("h-captcha-response");
            if (typeof hc_checkf != "undefined" && hc_checkf != null && hc_checkf.length != null && hc_checkf.length > 0) {
                if (hc_flag == 0) {
                    if(hc_mail == 1) emailsend();
                    if(hc_notify == 1) hc_notifier();
                    hc_sec = sec;
                    hc_min = min;
                    hc_hour = hour;
                    hc_flag = 1;
                }
                if(btn2.length > 1){
                btn2[1].click();
                btn2 = document.getElementsByClassName("sc-AxgMl llLWDd");
                }
                if(hc_checkf[0].value.length != 0 ) click();
                console.log("發生驗證", hc_hour, ":", hc_min, ":", hc_sec);
            } else {
                hc_flag = 0;
            }
        } else hc_flag = 0;
            if(auto_floor == 1 ) 
                if(btn2.length > 8 ||btn2.length == 2 ){
                btn2[1].click();
                btn2 = document.getElementsByClassName("sc-AxgMl llLWDd");
            }
            if (pause > 0 && flag == 0) {
                flag = 1;
                tempcount = timecount;
            }
            if (pause > 0)
                if (timecount - tempcount >= pause * 60) {
                    flag = 0;
                    pause = intiP;
                }
            if (pause == 0) {
                var raNum = Math.floor(Math.random() * 1000 * ranDelayRange);
                cflag2 = 0;
                if (ranDelay == 1) setTimeout("click()", raNum);
                else click();
                cdCount = 0;
            }
            if (pause == -1 && cdCount >= (cdtime + ranDelayTime)) {
                var raNum = Math.floor(Math.random() * 1000 * ranDelayRange);
                cflag2 = 0;
                if (ranDelay == 1) setTimeout("click()", raNum);
                else click();
                pause = intiP;
                cdCount = 0;
            }
            if (pause == -2 && cdCount >= (cdtime + ranDelayTime)) {
                var raNum = Math.floor(Math.random() * 1000 * ranDelayRange);
                cflag2 = 0;
                if (ranDelay == 1) setTimeout("click()", raNum);
                else click();
                cdCount = 0;
            }
            if (timeshow == 1 && pause <= 0) console.log('現在時間 :', hour, ' : ', min, ' : ', sec, " 總時間 : ", timecount, "秒");
            if (pause > 0) console.log('現在時間 :', hour, ':', min, ':', sec, "總時間 :", timecount, "秒", "暫停中,剩", (pause * 60 - timecount + tempcount), "秒");
        
        loop()
    }, looptime);
}());

function intiSet() {
    var dt = new Date();
    var min = dt.getMinutes();
    var sec = dt.getSeconds();
    var hour = dt.getHours();
    btn2 = document.getElementsByClassName("sc-AxgMl llLWDd");
    if (intiP > 0) intiP = 0;
    if(anti_check == 1) auto_floor = 0;
    pause = intiP;
    if (timeshow == 1) console.log('現在時間 :', hour, ' : ', min, ' : ', sec, " 總時間 : ", timecount, "秒");
    if(hc_check == 1) noticheck();
    cflag2 = 0;
    click(0);
}
function noticheck(){
    if (Notification.permission === 'default' || Notification.permission === 'undefined') {
        alert("點同意");
        Notification.requestPermission(function(permission) {
        });
    }
}
function hc_notifier(){
    var notifyConfig = {
        body: '\\ ^o^ /'+playername[0].textContent, // 設定內容
        icon: 'https://astriaworks.moe/images/fin_logo.png', // 設定 icon
      };
      var notification = new Notification('幹你娘跳驗證了拉', notifyConfig);
}

function click() {
    cflag = 0;
    if(target == 0) target = 1;
    var temp = target;
    if (ranAct == 1) {
        var raNum = Math.floor(Math.random() * 10);
        if (raNum <= ranActChance * 10) {
            target = Math.floor(Math.random() * 7+1);
            console.log("隨機行動 :", target);
        }
    }

    if (typeof btn2 != "undefined" && btn2 != null && btn2.length != null && btn2.length > 2) {
        if (highLevelCheck == 0) {
            cflag = 1;
            btn2[target].click();
            hc_flag = 0;
        }
        else {
            var btns = getComputedStyle(btn2[target]);
            if (btn2[target].hidden == false && btns.backgroundColor == "rgb(224, 224, 224)"
                && btns.color == "rgb(0, 0, 0)" && btns.fontSize == "16px"
                && btns.height == ("36px")) {
                if (btn2[target].textContent == "狩獵兔肉") {
                    highLevelClick("偵測成功 執行兔肉");
                }
                else if (btn2[target].textContent == "自主訓練") {
                    highLevelClick("偵測成功 執行訓練");
                }
                else if (btn2[target].textContent == "外出野餐") {
                    highLevelClick("偵測成功 執行野餐");
                }
                else if (btn2[target].textContent == "汁妹") {
                    highLevelClick("偵測成功 執行汁妹");
                }
                else if (btn2[target].textContent == "做善事") {
                    highLevelClick("偵測成功 執行善事");
                }
                else if (btn2[target].textContent == "坐下休息") {
                    highLevelClick("偵測成功 執行休息");
                }else if (btn2[target].textContent == "釣魚") {
                    highLevelClick("偵測成功 執行釣魚");
                }else {
                    cflag = -1;//文字偵測失敗
                }
            } else cflag = -2;//樣式偵測失敗
        }
    } else cflag = -3; // 取得按鈕失敗

    if (cflag <= 0 && highLevelCheck == 1 && cflag2 == 0) {
        if (highLevelShow == 1) {
            if (cflag == -1) console.log("文字偵測失敗");
            if (cflag == -2) console.log("樣式偵測失敗");
            if (cflag == -3) console.log("取得按鈕失敗(or還在冷卻)");
        }
        cflag2 = 1;
        setTimeout("click()", reClickTime*1000);
    }

    target = temp;
    if (megaCheck == 1) setTimeout("megaCheckF()", 1000);
}
function highLevelClick(mess) {
    succC += 1;
    cflag = 1;
    hc_flag = 0;
    if (highLevelShow == 1) console.log(mess, "總進行", succC, "次");
    btn2[target].click();
}


function megaCheckF() {
    if (megaStart <= highLevelCheck) {
        megaStart += 1;
        console.log("首次不執行檢查");
    } else {
        var text = document.getElementsByClassName("sc-fznKkj fQkkzS");
        if (typeof text != "undefined" && text != null && text.length != null && text.length > 0) {
            var t = -1;
            t = text[0].textContent.indexOf("經驗值");
            if (t == -1) {
                failTime += 1;
                console.log("行動失敗 :", failTime);
                if (megaClick == 1) {
                    cflag2 = 1;
                    setTimeout("click()", reClickTime*1000);
                }
            } else {
                failTime = 0;
            }
        } else { //取得失敗
            failTime += 1;
            console.log("無內容 :", failTime);
            if (failTime >= megaFail) {
                console.log("自動停止 :", megaTime, "分鐘");
                pause = megaTime;
            }
        }
    }
    if (failTime >= megaFail) {
        console.log("自動停止 :", megaTime, "分鐘");
        pause = megaTime;
    }
}
var Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };
