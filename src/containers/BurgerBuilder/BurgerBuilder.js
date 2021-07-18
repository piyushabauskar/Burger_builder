import React, { Component } from 'react';
import Aux from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    // constructor(props){
    //     super(props);
    //     this.state ={

    //     }
    // }
    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseUpdate: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('/ingredients.json')
            .then(response => {
                this.setState({
                    ingredients: response.data
                })
            })
            .catch(error => {
                this.setState({
                    error: true
                })
            })
    }
    purchaseUpdateState(ingredient) {
        const sum = Object.keys(ingredient)
            .map((igKey) => {
                return ingredient[igKey];
            }, 0)
            .reduce((sum, el) => {
                return sum + el;
            });
        this.setState({
            purchaseUpdate: sum > 0
        })
    }

    addIngredientsHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedStateCount = {
            ...this.state.ingredients
        };
        updatedStateCount[type] = updatedCount;
        const price = INGREDIENT_PRICES[type];
        const newPrice = this.state.totalPrice + price;
        this.setState({
            ingredients: updatedStateCount,
            totalPrice: newPrice
        });
        this.purchaseUpdateState(updatedStateCount);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedStateCount = {
            ...this.state.ingredients
        }
        updatedStateCount[type] = updatedCount;
        const price = INGREDIENT_PRICES[type];
        const newPrice = this.state.totalPrice - price;
        this.setState({
            ingredients: updatedStateCount,
            totalPrice: newPrice
        });
        this.purchaseUpdateState(updatedStateCount);
    }

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        })
    }

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        })
    }

    purchaseContinueHandler = () => {
        this.setState({
            loading: true
        })
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Piyusha Bauskar',
                address: {
                    street: 'JM Road',
                    zipcode: '412211',
                    country: 'India'
                },
                email: 'piyu19@gmail.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({
                    loading: false, purchasing: false
                });
            })
            .catch(error => {
                this.setState({
                    loading: false, purchasing: false
                })
            });
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;

        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls ingredientsAdded={this.addIngredientsHandler}
                        ingredientsRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchaseUpdate}
                        ordered={this.purchaseHandler} />
                </Aux>
            )
            orderSummary = <OrderSummary ingredients={this.state.ingredients}
                purchaseCancel={this.purchaseCancelHandler}
                purchaseContinue={this.purchaseContinueHandler}
                price={this.state.totalPrice} />
        }

        if (this.state.loading) {
            orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}
export default withErrorHandler(BurgerBuilder, axios);