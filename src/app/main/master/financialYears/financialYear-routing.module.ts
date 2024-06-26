﻿import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialYearsComponent } from './financialYears.component';

const routes: Routes = [
    {
        path: '',
        component: FinancialYearsComponent,
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FinancialYearRoutingModule {}
