import React, { Component } from 'react';
import Aux from '../Auxilary/Auxilary';
import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = {
            error: null
        }
        constructor() {
            super();
            axios.interceptors.request.use(req => {
                this.setState({
                    error: null
                })
                return req;
            })

            axios.interceptors.response.use(res => res, error => {
                this.setState({
                    error: error
                })
            });
        }

        errorConfirmedHandler = () => {
            this.setState({
                error: null
            })
        }
        render() {
            return (
                <Aux>
                    <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
                        Something went wrong...
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }
    }
}

export default withErrorHandler;