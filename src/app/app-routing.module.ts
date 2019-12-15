import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillSplitComponent } from './route-components/bill-split/bill-split.component';


const routes: Routes = [
  {
    path: '', component: BillSplitComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
