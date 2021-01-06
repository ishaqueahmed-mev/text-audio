import { Component } from '@angular/core';

@Component({
    selector: "app-home",
    templateUrl: "home.page.html",
    styleUrls: ["home.page.scss"]
})
export class HomePage {
    constructor() {}

    lists = [
        {
            lesson: "Lektion1",
            chapters: ["Kapitel", "Kapitel", "Kapitel"]
        },
        {
            lesson: "Lektion2",
            chapters: ["Kapitel", "Kapitel", "Kapitel"]
        },
        {
            lesson: "Lektion3",
            chapters: ["Kapitel", "Kapitel", "Kapitel"]
        },
        {
            lesson: "Lektion4",
            chapters: ["Kapitel", "Kapitel", "Kapitel"]
        }
    ];
}
