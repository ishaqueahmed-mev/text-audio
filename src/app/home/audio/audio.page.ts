import { Component, OnInit, ViewChild } from "@angular/core";
// import { HttpClient, HttpHeaders } from "@angular/common/http";
const PptxGenJS = require("pptxgenjs");
const des = require("../../../assets/audio/despacito.json");
// const des = require("../../../assets/audio/cup.json")

@Component({
    selector: "app-audio",
    templateUrl: "./audio.page.html",
    styleUrls: ["./audio.page.scss"]
})
export class AudioPage implements OnInit {
    pptx = new PptxGenJS();
    myJson = [];
    @ViewChild("audio") aud: any;
    audi = new Audio();
    stop: any;
    iampaused: boolean = false;
    timeInterval: any;
    textInterval: any;
    ele: any;
    nextStart: any;
    nextArr = [];
    allTimeLog: any;
    timer: any;
    nex: any;
    isDoubled = false;
    wordTime: any;
    textArrayLength: any;
    wordInterval: any;

    constructor() {}

    ngOnInit() {
        this.myJson = [...des];
        this.myJson = this.convertToMs(this.myJson);
        this.showSubtitles(this.myJson, 0);
        this.ele = document.getElementById("subtitles");
    }

    onUpdate(e) {
        // this.allTimeLog = e.target.currentTime * 1000;
    }

    parseTime(t) {
        var segments = t.split(":");
        var ms = parseInt(segments[2].split(",")[1]);
        var h = parseInt(segments[0]);
        var m = parseInt(segments[1]);
        var s = parseInt(segments[2]);
        return h * 60 * 60 * 1000 + m * 60 * 1000 + s * 1000 + ms;
    }

    convertToMs(arr) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].startTime = this.parseTime(arr[i].startTime);
            arr[i].endTime = this.parseTime(arr[i].endTime);
        }
        this.nextArr = arr;
        return arr;
    }

    paused(e) {
        clearTimeout(this.timeInterval);
        clearTimeout(this.wordInterval);
        this.timer = 0;
        this.iampaused = true;
        this.stop = e.target.currentTime;
        let stopped = String(this.stop);
        let time = stopped.split(".");
        let ms = parseFloat(time[1].slice(0, 3));
        let split = +time[0] / 60;
        let mins = 0 + String(split).split(".")[0];
        let secSplit = +time[0] % 60;
        let sec = String(secSplit).length == 1 ? "0" + secSplit : secSplit;
        let hrs = "00";
        // console.log(`${hrs}:${mins}:${sec}:${ms}`);
    }

    play(e) {
        if (this.iampaused) {
            e.target.currentTime = this.stop;
            let stopped = this.stop;
            this.nextStart = stopped * 1000;
            this.nextStart > 0 ? this.startAgain(this.nextStart) : "";
        }
    }

    showSubtitles(arr, i, p?, n?) {
        var that = this;
        if (i == 0) {
            this.timer = arr[i].startTime;
            if (p) {
                this.timer = arr[i].endTime - n;
                i++;
            }
        } else {
            this.timer = arr[i].startTime - arr[i - 1].startTime;
            if (p) {
                this.timer = arr[i].endTime - n;
                i++;
            }
        }
        // console.log("TIMER ", this.timer);

        this.timeInterval = setTimeout(
            function() {
                var elem = document.getElementById("subtitles");
                let span;
                // let span = document.createElement('span')
                // span.setAttribute('class', 'any')
                // span.innerText = arr[i].text
                // elem.appendChild(span)
                // var elem = document.getElementById("subtitles");
                // elem.innerHTML = arr[i].text;

                let text = arr[i].text;
                that.setWords(text, i);
                i++;
                if (arr.length > i) {
                    that.showSubtitles(arr, i);
                }
            },
            this.isDoubled ? this.timer / 1.5 : this.timer
        );
        // console.log("CURRENT INDEX :: ", arr[i]);
    }

    beatMe(aud) {
        this.isDoubled = !this.isDoubled;
        this.isDoubled ? (aud.playbackRate = 1.5) : (aud.playbackRate = 1);
    }

    startAgain(n) {
        // console.log(n);
        if (n != NaN) {
            var elem = document.getElementById("subtitles");
            let indexed = this.nextArr.findIndex((x, i) => {
                if (x.startTime < n && x.endTime > n) {
                    // console.log(x);
                    elem.innerHTML = x.text;
                    let text = x.text;
                    this.setWords(text, i);
                    return x;
                } else if (x.endTime > n) {
                    console.log("I AM HERE BOONE");
                    console.log(x);
                    elem.innerHTML = x.text;
                    let text = x.text;
                    this.setWords(text, i);
                    return x;
                }
            });

            // if(indexed == -1) {
            //     let it = this.nextArr.findIndex(x => {if (x.endTime > n) return x});
            //     console.log('IT ', it)
            //     this.showSubtitles(this.nextArr, it, true, n);
            // } else {
            //     this.showSubtitles(this.nextArr, indexed, true, n);
            // }
            if (indexed != -1)
                this.showSubtitles(this.nextArr, indexed, true, n);
        }
    }

    setWords(text, i) {
        var elem = document.getElementById("subtitles");
        let that = this;
        let textArr = text.split(/(\s+)/).filter(x => {
            return x.trim().length > 0;
        });
        that.wordTime =
            i == 0
                ? this.myJson[i].startTime / textArr.length
                : (this.myJson[i].startTime - this.myJson[i - 1].startTime) /
                  textArr.length;
        elem.innerHTML = "";

        that.textArrayLength = textArr;
        for (let i = 0; i < textArr.length; i++) {
            let span = document.createElement("span");
            span.setAttribute("class", "any");
            span.innerText = textArr[i] + " ";
            that.textArrayLength.map((x, ind) => {
                if (x == textArr[i]) {
                    this.wordInterval = setTimeout(
                        () => {
                            span.style.color = "red";
                        },
                        textArr[i].length > 2
                            ? ind * Math.ceil(that.wordTime) + 3
                            : ind * Math.ceil(that.wordTime) + 2
                    );
                }
            });
            elem.appendChild(span);
        }
    }

    captureAudio() {}
}
