import { inject, Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { withLatestFrom, filter, map } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { selectCounter } from "./counter.selector";
import { CounterActions } from "./counter.actions";

@Injectable()
export class CounterEffects {
    actions$ = inject(Actions);
    store$ = inject(Store<'counter'>);
   
    checkThreshold$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CounterActions.increment),
            withLatestFrom(this.store$.select(selectCounter)),
            filter(([, count]) => count === 5),
            map(() => CounterActions.threshold({ threshold: 5 }))
        )
    );
}