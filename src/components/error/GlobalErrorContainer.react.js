import {connect} from 'react-redux';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {isEmpty} from 'ramda';
import {revert, resolveError} from '../../actions';
import serverErrorCSS from './werkzueg.css';
import {DebugMenu} from './menu/DebugMenu.react';

class UnconnectedGlobalErrorContainer extends Component {
    constructor(props) {
        super(props);
    }

    resolveError(dispatch, type, myId) {
        if (type === 'backEnd') {
            dispatch(resolveError({type}));
            dispatch(revert());
        } else {
            dispatch(resolveError({myId, type}));
        }
    }

    serverError(error) {
        var newWin = open('error.html', 'werkzueg', 'height=1024,width=1280');
        newWin.document.write(error.backEnd.errorPage);
        var debugger_css = newWin.document.getElementsByTagName('link')[0];
        debugger_css.parentNode.removeChild(debugger_css);
        var style = newWin.document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = serverErrorCSS;
        newWin.document.getElementsByTagName('head')[0].appendChild(style);
        newWin.document.close();
    }

    render() {
        const {error, dispatch} = this.props;
        return (
            <div id="_dash-global-error-container">
                <img
                    src="http://placehold.it/1x1"
                    onLoad={
                        isEmpty(error.backEnd)
                            ? (() => {
                                  return;
                              })()
                            : (() => this.serverError(error))()
                    }
                />
                <DebugMenu
                    errors={error}
                    dispatch={dispatch}
                    resolveError={this.resolveError}
                >
                    {this.props.children}
                </DebugMenu>
            </div>
        );
    }
}

UnconnectedGlobalErrorContainer.propTypes = {
    children: PropTypes.object,
    error: PropTypes.object,
    dispatch: PropTypes.func,
};

const GlobalErrorContainer = connect(
    state => ({
        error: state.error,
    }),
    dispatch => ({dispatch})
)(Radium(UnconnectedGlobalErrorContainer));

export default GlobalErrorContainer;
