import { Component, ElementRef, forwardRef, HostListener, Input, OnInit, ViewEncapsulation, } from '@angular/core';
import { NpDatePickerService } from './np-datepicker.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateFormatter, DaysMapping, MonthMapping, NepaliDate, } from './types';
import { daysMapping, monthsMapping } from './mapping';

@Component({
    selector: 'npdual-datepicker',
    templateUrl: './np-date-picker.component.html',
    styleUrls: ['./np-date-picker.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NpxNpDatePickerComponent),
            multi: true,
        },
    ],
    encapsulation: ViewEncapsulation.None,
})
export class NpxNpDatePickerComponent implements OnInit, ControlValueAccessor {
    @Input()
    theme!: string;

    @Input()
    language: 'en' | 'ne' = 'ne';

    @Input() isfinancialYear: Boolean = false;
    @Input() isengDate: Boolean = true;

    @Input() minDate = '2001/01/01';
    @Input() maxDate = '2099/10/30';
    @Input() format = 'yy/mm/dd';

    date: Date;
    npminDate: NepaliDate = { day: 0, month: 0, year: 0 };
    npmaxDate: NepaliDate = { day: 0, month: 0, year: 0 };
    nepaliDateToday: NepaliDate = { day: 0, month: 0, year: 0 };
    currentNepaliDate: NepaliDate = { day: 0, month: 0, year: 0 };
    selectedDate!: NepaliDate;
    formattedDate = '';
    currentDate: any;

    displayDate!: string;

    years: number[] = [];

    currentMonthData!: any;

    daysMapping: DaysMapping = daysMapping;

    monthsMapping: MonthMapping = monthsMapping;

    isOpen = false;

    hideInput = false;

    alwaysVisible = false;


    monthDisplayType: 'default' | 'modern' | 'short' = 'default';
    dayDisplayType: 'default' | 'short' = 'short';
    initialized = false;
    isminDate = false;
    ismaxDate = false;


    constructor(
        public _nepaliDate: NpDatePickerService,
        private eRef: ElementRef
    ) {
        this.currentDate = new Date();
        this.nepaliDateToday = _nepaliDate.engToNepDate(
            this.currentDate.getDate(),
            this.currentDate.getMonth(),
            this.currentDate.getFullYear()
        );
    }

    @HostListener('document:click', ['$event'])
    clickout(event: any) {
        if (!this.eRef.nativeElement.contains(event.target)) {
            this.close();
        }
    }

    dateFormatter: DateFormatter = (selectedDate: NepaliDate) => {
        const dd =
            selectedDate.day < 9 ? '0' + selectedDate.day : selectedDate.day;
        const mm =
            selectedDate.month < 9
                ? '0' + (selectedDate.month + 1)
                : selectedDate.month + 1;

        switch (this.format) {
            case 'dd-mm-yy':
                return `${dd}/${mm}/${this.selectedDate.year}`;
            default:
                return `${this.selectedDate.year}/${mm}/${dd}`;
        }
    };


    async ngOnInit() {
        this.setCurrentDate();
        // this.selectDate(this.currentNepaliDate.day);
        this.populateYears();
        this.setCurrentMonthData();
        // console.log(this.currentMonthData);


        if (this.minDate.length > 0) {
            let minDateArray = this.minDate.split('/');
            this.isminDate = true;
            this.npminDate = {
                day: parseInt(minDateArray[2]),
                month: parseInt(minDateArray[1]) - 1,
                year: parseInt(minDateArray[0]),
            };
        }

        if (this.maxDate.length > 0) {
            let minDateArray = this.maxDate.split('/');
            this.ismaxDate = true;
            this.npmaxDate = {
                day: parseInt(minDateArray[2]),
                month: parseInt(minDateArray[1]) - 1,
                year: parseInt(minDateArray[0]),
            };
        }
        this.selectDate(this.currentNepaliDate.day);
    }

    populateYears() {
        for (let i = 2001; i <= 2099; i++) {
            this.years.push(i);
        }
    }

    selectYear(e: any) {
        this.currentNepaliDate.year = parseInt(e.target.value);

        const newDate = {
            day: this.currentNepaliDate.day,
            month: this.currentNepaliDate.month,
            year: this.currentNepaliDate.year,
        };

        this.currentDate = this._nepaliDate.nepToEngDate(
            newDate.day,
            newDate.month,
            newDate.year
        );

        this.setCurrentMonthData();
    }

    selectMonth(e: any) {
        let month = e.target.value;
        let nep_month_index =
            this.monthsMapping[this.language][this.monthDisplayType]?.indexOf(
                month
            ) ?? 0;

        this.currentNepaliDate.month = nep_month_index;

        const newNepaliDate = {
            day: this.currentNepaliDate.day,
            month: this.currentNepaliDate.month,
            year: this.currentNepaliDate.year,
        };

        this.currentDate = this._nepaliDate.nepToEngDate(
            newNepaliDate.day,
            newNepaliDate.month,
            newNepaliDate.year
        );
        //console.log(this.currentDate);
        this.setCurrentMonthData();
    }

    resetCurrentMonthData() {
        this.currentMonthData = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
        };
    }

    formatValue() {
        if (this.selectedDate) {
            this.formattedDate = this.dateFormatter(this.selectedDate);
        }
    }

    propagateChange = (_: any) => {
    };
    propagateTouch = (_: any) => {
    };

    writeValue(value: any) {
        this.propagateChange(this.selectedDate);
        if (value) {
            let minDateArray = value.split('/');
            let data = {
                day: parseInt(minDateArray[2]),
                month: parseInt(minDateArray[1]) - 1,
                year: parseInt(minDateArray[0]),
            };
            this.selectedDate = data;
            this.currentNepaliDate = data;
            this.formatValue();
            this.propagateChange(this.formattedDate);
        } else {
            this.setCurrentDate();
        }
    }

    registerOnTouched() {
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    setCurrentDate() {
        if (!this.selectedDate) {
            this.currentNepaliDate = this._nepaliDate.engToNepDate(
                this.currentDate.getDate(),
                this.currentDate.getMonth(),
                this.currentDate.getFullYear()
            );
        } else {
            const { day, month, year } = this.selectedDate;
            this.currentNepaliDate = this._nepaliDate.engToNepDate(day, month, year);
            this.currentDate = this._nepaliDate.nepToEngDate(
                this.selectedDate.year,
                this.selectedDate.month,
                this.selectedDate.day
            );
        }
    }

    setCurrentMonthData() {
        this.resetCurrentMonthData();

        // fill the currentMonthData with current date
        let day = this.currentDate.getDay();

        this.currentMonthData[day] = [this.currentNepaliDate.day];

        // fill the currentMonthData with day before the current date
        this.setMonthDataBefore(day - 1, this.currentNepaliDate.day - 1);

        let currentMonthMaxValue =
            this._nepaliDate.nepaliMonths[this.currentNepaliDate.year - 2000][
            this.currentNepaliDate.month
            ];

        // fill the currentMonthData with day after the current date
        this.setMonthDataAfter(
            day + 1,
            this.currentNepaliDate.day + 1,
            currentMonthMaxValue
        );

        // we need some empty spaces in place so that the dates are shown in correct order
        // eg if the 1st day starts on monday then we need 1 empty space for non existingn date on Sunday
        this.createEmptySpaces();
    }

    setMonthDataBefore(day: any, date: any) {
        if (date >= 1) {
            if (day < 0) {
                day = 6;
            }
            this.currentMonthData[day] = [date, ...this.currentMonthData[day]];
            this.setMonthDataBefore(--day, --date);
        }
    }

    setMonthDataAfter(day: any, date: any, currentMonthMaxValue: any) {
        const nepaliDate = {
            day: date,
            month: this.currentNepaliDate.month,
            year: this.currentNepaliDate.year,
        };

        //  only add the data if the current month matches
        if (date <= currentMonthMaxValue) {
            if (day > 6) {
                day = 0;
            }
            this.currentMonthData[day] = [...this.currentMonthData[day], date];
            this.setMonthDataAfter(++day, ++date, currentMonthMaxValue);
        }
    }

    createEmptySpaces() {
        // first find out which day has the 1st
        //  if its a Sunday, then don't do anything else add 1 space on each previous day
        let dayIndex = 0;
        let value: any;
        Object.values(this.currentMonthData).map((item, index) => {
            value = item;
            if (value.includes(1)) {
                dayIndex = index;
            }
            return value.includes(1);
        });

        if (dayIndex) {
            for (dayIndex; dayIndex > 0; dayIndex--) {
                const monthData = this.currentMonthData[dayIndex - 1];
                this.currentMonthData[dayIndex - 1] = [null, ...monthData];
            }
        }
    }

    selectDate(day: number) {
        this.selectedDate = { ...this.currentNepaliDate, day };

        this.date = this._nepaliDate.nepToEngDate(this.selectedDate.day, this.selectedDate.month, this.selectedDate.year);
        this.formatValue();
        // this.close();
        this.propagateChange(this.formattedDate);
    }

    prevMonth() {
        if (this.currentNepaliDate.month <= 0) {
            this.currentNepaliDate.month = 11;
            this.currentNepaliDate.year--;
        } else {
            this.currentNepaliDate.month--;
        }

        const newNepaliDate = {
            day: this.currentNepaliDate.day,
            month: this.currentNepaliDate.month,
            year: this.currentNepaliDate.year,
        };
        this.currentDate = this._nepaliDate.nepToEngDate(
            newNepaliDate.day,
            newNepaliDate.month,
            newNepaliDate.year
        );

        this.setCurrentMonthData();
    }

    nextMonth() {
        if (this.currentNepaliDate.month >= 11) {
            this.currentNepaliDate.month = 0;
            this.currentNepaliDate.year++;
        } else {
            this.currentNepaliDate.month++;
        }

        const newDate = {
            day: this.currentNepaliDate.day,
            month: this.currentNepaliDate.month,
            year: this.currentNepaliDate.year,
        };
        this.currentDate = this._nepaliDate.nepToEngDate(
            newDate.day,
            newDate.month,
            newDate.year
        );
        this.setCurrentMonthData();
    }

    toggleOpen() {
        if (!this.alwaysVisible) {
            this.isOpen = !this.isOpen;
        }
    }

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
        //this.setCurrentDate();
    }

    fdDateChanges(e: any) {

        this.selectedDate = this._nepaliDate.engToNepDate(
            e.getDate(),
            e.getMonth(),
            e.getFullYear()
        );

        this.currentNepaliDate = this._nepaliDate.engToNepDate(
            e.getDate(),
            e.getMonth(),
            e.getFullYear()
        );


        this.currentDate = this._nepaliDate.nepToEngDate(
            this.selectedDate.year,
            this.selectedDate.month,
            this.selectedDate.day
        );


        this.formatValue();
        //this.close();
        this.propagateChange(this.formattedDate);
    }


}
