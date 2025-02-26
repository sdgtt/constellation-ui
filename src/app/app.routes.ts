import { Routes } from '@angular/router';
import { KuiperlinuxciComponent } from './tabs/kuiperlinuxci/kuiperlinuxci.component';
import { ScorecardComponent } from './tabs/scorecard/scorecard.component';
import { SelectedboardComponent } from './tabs/selectedboard/selectedboard.component';

export const routes: Routes = [
    { 
        path: '', 
        title: 'Constellation Kuiperlinux CI',
        redirectTo: '/kuiperlinuxci', pathMatch: 'full' },
    {
        path: 'kuiperlinuxci',
        title: 'Constellation Kuiperlinux CI',
        component: KuiperlinuxciComponent,
    },
    {
        path: 'scorecard',
        title: 'Constellation Scorecard',
        component: ScorecardComponent,
    },
    {
        path: 'selectedboard/:boardName',
        title: 'Constellation KuiperLinux CI',
        component: SelectedboardComponent,
        // canActivate: [AuthGuard],
    },
];
