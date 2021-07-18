import React from 'react';
import classes from './Burger.css'
import BurgerIngredients from './BurgerIngredient/BurgerIngredient';


const burger = (props) => {
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKeys => {
            // console.log(igKeys);
            return (
                [...Array(props.ingredients[igKeys])].map((l, i) => {
                    // console.log(l, i);
                    return <BurgerIngredients key={igKeys + i} type={igKeys} />
                })
            );
        }).reduce((arr, el) => {
            //console.log(el);
            return arr.concat(el);
        }, []);
    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding Ingredients!!</p>
    }
    //console.log(transformedIngredients);
    return (
        <div className={classes.Burger}>
            <BurgerIngredients type="bread-top" />
            {transformedIngredients}
            <BurgerIngredients type="bread-bottom" />
        </div>
    )
}

export default burger;